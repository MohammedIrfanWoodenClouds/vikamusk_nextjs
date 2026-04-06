import { MongoClient, ObjectId } from 'mongodb';
import { categories as initialCategories, products as initialProducts, stats } from './data'; // Need mock data for initial seeding

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env (must be an online cluster for production)');
}
const uri = process.env.MONGODB_URI;
const options = {};
let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db();
}

function mapId(doc: any) {
  if (!doc) return null;
  const { _id, ...rest } = doc;
  return { id: _id.toString(), ...rest };
}

// -----------------------------------------
// Main Categories
// -----------------------------------------
export async function getAllMainCategories() {
  const db = await getDb();
  const cats = await db.collection('main_categories').find().sort({ sort_order: 1 }).toArray();
  // We need sub_count and product_count
  const enrichedCats = await Promise.all(cats.map(async (cat) => {
    const sub_count = await db.collection('sub_categories').countDocuments({ main_category_id: cat._id.toString() });
    
    // Product count: find all sub_categories of this main_category first
    const subs = await db.collection('sub_categories').find({ main_category_id: cat._id.toString() }).toArray();
    const subIds = subs.map(s => s._id.toString());
    const product_count = await db.collection('products').countDocuments({ sub_category_id: { $in: subIds } });

    return { ...mapId(cat), sub_count, product_count };
  }));
  return enrichedCats;
}

export async function getMainCategoryById(id: string) {
  const db = await getDb();
  const cat = await db.collection('main_categories').findOne({ _id: new ObjectId(id) });
  return mapId(cat);
}

export async function getMainCategoryBySlug(slug: string) {
  const db = await getDb();
  const cat = await db.collection('main_categories').findOne({ slug });
  return mapId(cat);
}

export async function createMainCategory(data: any) {
  const db = await getDb();
  const existing = await db.collection('main_categories').findOne({ slug: data.slug });
  if (existing) throw new Error('UNIQUE constraint');
  
  const result = await db.collection('main_categories').insertOne(data);
  return { id: result.insertedId.toString(), ...data };
}

export async function updateMainCategory(id: string, data: any) {
  const db = await getDb();
  id = id.toString();
  
  if (data.slug) {
    const existing = await db.collection('main_categories').findOne({ slug: data.slug, _id: { $ne: new ObjectId(id) } });
    if (existing) throw new Error('UNIQUE constraint');
  }

  await db.collection('main_categories').updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteMainCategory(id: string) {
  const db = await getDb();
  const stringId = id.toString();
  // Delete subcategories and products
  const subs = await db.collection('sub_categories').find({ main_category_id: stringId }).toArray();
  const subIds = subs.map(s => s._id.toString());
  
  if (subIds.length > 0) {
    await db.collection('products').deleteMany({ sub_category_id: { $in: subIds } });
  }
  await db.collection('sub_categories').deleteMany({ main_category_id: stringId });
  await db.collection('main_categories').deleteOne({ _id: new ObjectId(stringId) });
}

// -----------------------------------------
// Sub Categories
// -----------------------------------------
export async function getAllSubCategories(mainCategoryId?: string) {
  const db = await getDb();
  const query = mainCategoryId ? { main_category_id: mainCategoryId.toString() } : {};
  const subs = await db.collection('sub_categories').find(query).sort({ sort_order: 1 }).toArray();

  const enrichedSubs = await Promise.all(subs.map(async (sub) => {
    const mainCat = await db.collection('main_categories').findOne({ _id: new ObjectId(sub.main_category_id) });
    const product_count = await db.collection('products').countDocuments({ sub_category_id: sub._id.toString() });
    
    return {
      ...mapId(sub),
      main_category_name: mainCat?.name,
      main_category_slug: mainCat?.slug,
      product_count
    };
  }));
  return enrichedSubs;
}

export async function getSubCategoryById(id: string) {
  const db = await getDb();
  const sub = await db.collection('sub_categories').findOne({ _id: new ObjectId(id) });
  return mapId(sub);
}

export async function getSubCategoryBySlug(slug: string) {
  const db = await getDb();
  const sub = await db.collection('sub_categories').findOne({ slug });
  if (!sub) return null;
  const mainCat = await db.collection('main_categories').findOne({ _id: new ObjectId(sub.main_category_id) });
  return {
    ...mapId(sub),
    main_category_name: mainCat?.name,
    main_category_slug: mainCat?.slug,
  };
}

export async function createSubCategory(data: any) {
  const db = await getDb();
  data.main_category_id = data.main_category_id.toString();
  const existing = await db.collection('sub_categories').findOne({ slug: data.slug });
  if (existing) throw new Error('UNIQUE constraint');
  
  const result = await db.collection('sub_categories').insertOne(data);
  return { id: result.insertedId.toString(), ...data };
}

export async function updateSubCategory(id: string, data: any) {
  const db = await getDb();
  id = id.toString();
  if (data.main_category_id) data.main_category_id = data.main_category_id.toString();

  if (data.slug) {
    const existing = await db.collection('sub_categories').findOne({ slug: data.slug, _id: { $ne: new ObjectId(id) } });
    if (existing) throw new Error('UNIQUE constraint');
  }

  await db.collection('sub_categories').updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteSubCategory(id: string) {
  const db = await getDb();
  const stringId = id.toString();
  await db.collection('products').deleteMany({ sub_category_id: stringId });
  await db.collection('sub_categories').deleteOne({ _id: new ObjectId(stringId) });
}

// -----------------------------------------
// Products
// -----------------------------------------
export async function getAllProducts(subCategoryId?: string) {
  const db = await getDb();
  const query = subCategoryId ? { sub_category_id: subCategoryId.toString() } : {};
  const prods = await db.collection('products').find(query).sort({ sort_order: 1 }).toArray();

  return await Promise.all(prods.map(async (p) => {
    const sub = await db.collection('sub_categories').findOne({ _id: new ObjectId(p.sub_category_id) });
    const mainCat = sub ? await db.collection('main_categories').findOne({ _id: new ObjectId(sub.main_category_id) }) : null;
    return {
      ...mapId(p),
      sub_category_name: sub?.name,
      sub_category_slug: sub?.slug,
      main_category_name: mainCat?.name,
      main_category_slug: mainCat?.slug
    };
  }));
}

export async function getProductsBySubCategory(subCategorySlug: string) {
  const db = await getDb();
  const sub = await db.collection('sub_categories').findOne({ slug: subCategorySlug });
  if (!sub) return [];
  const prods = await db.collection('products').find({ sub_category_id: sub._id.toString() }).sort({ sort_order: 1 }).toArray();
  const mainCat = await db.collection('main_categories').findOne({ _id: new ObjectId(sub.main_category_id) });
  
  return prods.map(p => ({
    ...mapId(p),
    sub_category_name: sub.name,
    sub_category_slug: sub.slug,
    main_category_name: mainCat?.name,
    main_category_slug: mainCat?.slug
  }));
}

export async function getProductsByMainCategory(mainCategorySlug: string) {
  const db = await getDb();
  const mainCat = await db.collection('main_categories').findOne({ slug: mainCategorySlug });
  if (!mainCat) return [];
  const subs = await db.collection('sub_categories').find({ main_category_id: mainCat._id.toString() }).toArray();
  const subIds = subs.map(s => s._id.toString());
  
  const prods = await db.collection('products').find({ sub_category_id: { $in: subIds } }).sort({ sort_order: 1 }).toArray();
  
  return prods.map(p => {
    const sub = subs.find(s => s._id.toString() === p.sub_category_id);
    return {
      ...mapId(p),
      sub_category_name: sub?.name,
      sub_category_slug: sub?.slug,
      main_category_name: mainCat.name,
      main_category_slug: mainCat.slug
    };
  });
}

export async function getFeaturedProducts() {
  const db = await getDb();
  const prods = await db.collection('products').find({ featured: 1 }).sort({ sort_order: 1 }).toArray();
  
  return await Promise.all(prods.map(async (p) => {
    const sub = await db.collection('sub_categories').findOne({ _id: new ObjectId(p.sub_category_id) });
    const mainCat = sub ? await db.collection('main_categories').findOne({ _id: new ObjectId(sub.main_category_id) }) : null;
    return {
      ...mapId(p),
      sub_category_name: sub?.name,
      sub_category_slug: sub?.slug,
      main_category_name: mainCat?.name,
      main_category_slug: mainCat?.slug
    };
  }));
}

export async function getProductById(id: string) {
  const db = await getDb();
  const p = await db.collection('products').findOne({ _id: new ObjectId(id) });
  return mapId(p);
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  const p = await db.collection('products').findOne({ slug });
  if (!p) return null;
  const sub = await db.collection('sub_categories').findOne({ _id: new ObjectId(p.sub_category_id) });
  const mainCat = sub ? await db.collection('main_categories').findOne({ _id: new ObjectId(sub.main_category_id) }) : null;
  return {
    ...mapId(p),
    sub_category_name: sub?.name,
    sub_category_slug: sub?.slug,
    main_category_name: mainCat?.name,
    main_category_slug: mainCat?.slug
  };
}

export async function createProduct(data: any) {
  const db = await getDb();
  data.sub_category_id = data.sub_category_id.toString();
  const existing = await db.collection('products').findOne({ slug: data.slug });
  if (existing) throw new Error('UNIQUE constraint');
  
  const result = await db.collection('products').insertOne(data);
  return { id: result.insertedId.toString(), ...data };
}

export async function updateProduct(id: string, data: any) {
  const db = await getDb();
  id = id.toString();
  if (data.sub_category_id) data.sub_category_id = data.sub_category_id.toString();

  if (data.slug) {
    const existing = await db.collection('products').findOne({ slug: data.slug, _id: { $ne: new ObjectId(id) } });
    if (existing) throw new Error('UNIQUE constraint');
  }

  await db.collection('products').updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteProduct(id: string) {
  const db = await getDb();
  await db.collection('products').deleteOne({ _id: new ObjectId(id) });
}

// -----------------------------------------
// Careers
// -----------------------------------------
export async function getAllCareers(activeOnly = false) {
  const db = await getDb();
  const query = activeOnly ? { is_active: 1 } : {};
  const items = await db.collection('career_postings').find(query).sort({ created_at: -1 }).toArray();
  return items.map(mapId);
}

export async function getCareerById(id: string) {
  const db = await getDb();
  const item = await db.collection('career_postings').findOne({ _id: new ObjectId(id) });
  return mapId(item);
}

export async function createCareer(data: any) {
  const db = await getDb();
  data.created_at = new Date().toISOString();
  const result = await db.collection('career_postings').insertOne(data);
  return { id: result.insertedId.toString(), ...data };
}

export async function updateCareer(id: string, data: any) {
  const db = await getDb();
  await db.collection('career_postings').updateOne({ _id: new ObjectId(id) }, { $set: data });
}

export async function deleteCareer(id: string) {
  const db = await getDb();
  await db.collection('career_postings').deleteOne({ _id: new ObjectId(id) });
}

// -----------------------------------------
// Navigation (Menus)
// -----------------------------------------
export async function getNavCategories() {
  const db = await getDb();
  const cats = await db.collection('main_categories').find().sort({ sort_order: 1 }).toArray();
  
  const navCats = await Promise.all(cats.map(async (cat) => {
    const subs = await db.collection('sub_categories').find({ main_category_id: cat._id.toString() }).sort({ sort_order: 1 }).toArray();
    
    const enrichedSubs = await Promise.all(subs.map(async (sub) => {
      const prods = await db.collection('products').find({ sub_category_id: sub._id.toString() }).sort({ sort_order: 1 }).toArray();
      return {
        id: sub._id.toString(),
        name: sub.name,
        slug: sub.slug,
        image: sub.image,
        product_count: prods.length,
        products: prods.map(p => ({
          id: p._id.toString(),
          name: p.name,
          slug: p.slug
        }))
      };
    }));

    return {
      id: cat._id.toString(),
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      image: cat.image,
      subCategories: enrichedSubs
    };
  }));

  return navCats;
}

// -----------------------------------------
// Initial Data Seeding
// -----------------------------------------
let hasSeeded = false;

export async function seedDatabase() {
  if (hasSeeded) return;
  const db = await getDb();
  
  // Create migration document to track timestamp as requested by user
  const migrationsCollection = db.collection('migrations');
  const migrationName = `${Date.now()}_initial_seed`;
  
  const alreadySeeded = await migrationsCollection.findOne({ name: { $regex: /initial_seed/ } });
  
  if (!alreadySeeded) {
    const count = await db.collection('main_categories').countDocuments();
    if (count === 0) {
      console.log('Seeding initial MongoDB data...');
      
      const mainCatIdMap = new Map();
      let mainOrder = 0;
      for (const mc of initialCategories) {
        const res = await db.collection('main_categories').insertOne({
          name: mc.name,
          slug: mc.slug,
          description: mc.description || '',
          icon: mc.icon || '📁',
          image: mc.image || '',
          sort_order: mainOrder++
        });
        mainCatIdMap.set(mc.slug, res.insertedId.toString());
      }

      const subCatIdMap = new Map();
      let subOrder = 0;
      // Mock sub-categories since none are provided in stats
      const mockSubCategories = [{ mainCategorySlug: initialCategories[0]?.slug, name: 'Sample Sub', slug: 'sample-sub', description: '', image: '' }];
      for (const sc of mockSubCategories) {
        const mcid = mainCatIdMap.get(sc.mainCategorySlug);
        if (mcid) {
          const res = await db.collection('sub_categories').insertOne({
            main_category_id: mcid,
            name: sc.name,
            slug: sc.slug,
            description: sc.description || '',
            image: sc.image || '',
            sort_order: subOrder++
          });
          subCatIdMap.set(sc.slug, res.insertedId.toString());
        }
      }

      let prodOrder = 0;
      for (const p of initialProducts) {
        // Just put products without subcategories to prevent crash
        const scid = subCatIdMap.get(p.categorySlug) || null;
        if (true) {
          await db.collection('products').insertOne({
            sub_category_id: scid,
            name: p.name,
            slug: p.slug,
            short_description: p.shortDescription || '',
            full_description: p.fullDescription || '',
            features: JSON.stringify(p.features || []),
            specs: JSON.stringify(p.specs || {}),
            image: p.image || '',
            featured: p.featured ? 1 : 0,
            sort_order: prodOrder++
          });
        }
      }

      const mockCareers = [{ title: 'Sales Executive', department: 'Sales', location: 'UAE', type: 'Full-time', description: '', requirements: [], benefits: []}];
      for (const c of mockCareers) {
        await db.collection('career_postings').insertOne({
          title: c.title,
          department: c.department,
          location: c.location,
          type: c.type,
          description: c.description,
          requirements: JSON.stringify(c.requirements || []),
          benefits: JSON.stringify(c.benefits || []),
          is_active: 1,
          created_at: new Date().toISOString()
        });
      }
      
      await migrationsCollection.insertOne({ name: migrationName, run_at: new Date() });
      console.log('Seeding complete.');
    } else {
      await migrationsCollection.insertOne({ name: migrationName, run_at: new Date(), skipped: true });
    }
  }
  
  hasSeeded = true;
}
