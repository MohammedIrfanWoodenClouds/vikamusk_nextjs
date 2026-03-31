// ============================================
// Vikamusk - Product & Company Data
// Using REAL product images from client
// ============================================

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  shortDescription: string;
  fullDescription: string;
  features: string[];
  specs: Record<string, string>;
  image: string;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image: string;
  productCount: number;
}

export interface Location {
  id: string;
  country: string;
  city: string;
  address: string;
  isHeadOffice: boolean;
  mapUrl?: string;
}

// =========== CATEGORIES ===========
export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Forklifts & Reach Trucks',
    slug: 'forklifts-reach-trucks',
    description: 'Diesel & Electric Forklifts, Reach Trucks, VNA Forklifts and specialized attachments for efficient material handling.',
    icon: '🏗️',
    image: '/images/products/diesel-heavy-forklift.png',
    productCount: 6,
  },
  {
    id: 'cat-2',
    name: 'Aerial Work Platforms',
    slug: 'aerial-work-platforms',
    description: 'Scissor Lifts, Boom Lifts, Telehandlers for safe and productive elevated work at height.',
    icon: '⬆️',
    image: '/images/products/electric-scissor-lift.png',
    productCount: 5,
  },
];

// =========== PRODUCTS ===========
export const products: Product[] = [
  // === Forklifts & Reach Trucks ===
  {
    id: 'prod-1',
    name: 'Diesel Heavy Forklift',
    slug: 'diesel-heavy-forklift',
    category: 'Forklifts & Reach Trucks',
    categorySlug: 'forklifts-reach-trucks',
    shortDescription: 'Powerful turbocharged engine with hydraulic fork positioner for heavy-duty operations.',
    fullDescription: 'The Vikamusk Heavy Duty Diesel Forklift combines a low-oil-consumption turbocharged engine with exceptional power performance and big torque reserves. Featuring a standard hydraulic fork positioner for easy operation, box-type internal-external mast with all-round roller bearings, and superior lifting performance designed for the most demanding industrial environments.',
    features: [
      'Low oil consumption, high quality turbocharged engine',
      'Good power performance with big torque reserves',
      'Standard hydraulic fork positioner for easy operation',
      'Reduces driver labor intensity',
      'Box-type internal-external mast design',
      'Special all-round roller bearings',
      'Increased lifting performance',
      'Heavy-duty chassis for maximum stability',
    ],
    specs: {
      'Capacity': '3,000 – 16,000 kg',
      'Engine Type': 'Turbocharged Diesel',
      'Lifting Height': '3,000 – 7,000 mm',
      'Drive Type': '4-Wheel Drive',
      'Transmission': 'Automatic',
      'Fuel': 'Diesel',
    },
    image: '/images/products/diesel-heavy-forklift.png',
    featured: true,
  },
  {
    id: 'prod-2',
    name: 'Diesel Mini Forklift',
    slug: 'diesel-mini-forklift',
    category: 'Forklifts & Reach Trucks',
    categorySlug: 'forklifts-reach-trucks',
    shortDescription: 'Compact diesel forklift ideal for tight spaces and light to medium duty applications.',
    fullDescription: 'The Vikamusk Diesel Mini Forklift is engineered for compact workspaces that require diesel power. Its small turning radius and responsive controls make it perfect for warehouses, workshops, and distribution centers where space is at a premium.',
    features: [
      'Compact design with small turning radius',
      'Efficient diesel engine',
      'Excellent maneuverability in tight spaces',
      'Ergonomic operator station',
      'Low maintenance design',
      'Durable construction',
      'Easy serviceability',
      'Versatile mast options',
    ],
    specs: {
      'Capacity': '1,500 – 3,500 kg',
      'Engine Type': 'Diesel',
      'Lifting Height': '3,000 – 6,000 mm',
      'Drive Type': '2-Wheel Drive',
      'Transmission': 'Automatic',
      'Fuel': 'Diesel',
    },
    image: '/images/products/diesel-mini-forklift.png',
    featured: true,
  },
  {
    id: 'prod-3',
    name: 'Electric Forklift',
    slug: 'electric-forklift',
    category: 'Forklifts & Reach Trucks',
    categorySlug: 'forklifts-reach-trucks',
    shortDescription: 'Zero-emission lithium battery forklift with AC motor drive for indoor operations.',
    fullDescription: 'The Vikamusk Electric Forklift series delivers zero-emission performance with advanced lithium-ion battery technology. Featuring regenerative braking, AC motor drive systems, and intelligent battery management, these forklifts are ideal for warehouse, food processing, and clean-room operations.',
    features: [
      'Advanced lithium-ion battery technology',
      'Zero emissions for indoor use',
      'AC motor drive system',
      'Regenerative braking for extended runtime',
      'Intelligent battery management system',
      'Low maintenance requirements',
      'Ergonomic operator cabin',
      'On-board diagnostics system',
    ],
    specs: {
      'Capacity': '1,500 – 5,000 kg',
      'Battery': 'Lithium-ion',
      'Lifting Height': '3,000 – 6,000 mm',
      'Drive Type': 'AC Motor',
      'Charging Time': '1.5 – 3 hours',
      'Runtime': '6 – 8 hours',
    },
    image: '/images/products/electric-forklift.png',
    featured: true,
  },
  {
    id: 'prod-4',
    name: 'Reach Trucks',
    slug: 'reach-trucks',
    category: 'Forklifts & Reach Trucks',
    categorySlug: 'forklifts-reach-trucks',
    shortDescription: 'Narrow aisle reach truck for high-density warehouse racking operations.',
    fullDescription: 'The Vikamusk Reach Truck is designed for narrow-aisle warehouse operations, offering exceptional maneuverability and high lifting capabilities. With advanced AC motor technology and precise controls, operators can efficiently handle pallets in tight spaces at heights up to 12 meters.',
    features: [
      'Narrow aisle operation capability',
      'High lift mast up to 12m',
      'AC motor drive system',
      'Regenerative braking',
      'Ergonomic operator compartment',
      'Side-shift and tilt functions',
      'Intelligent control system',
      'Low energy consumption',
    ],
    specs: {
      'Capacity': '1,400 – 2,500 kg',
      'Lifting Height': '5,400 – 12,000 mm',
      'Battery': 'Lead-acid / Lithium',
      'Aisle Width': '2,700 – 3,000 mm',
      'Drive Type': 'AC Motor',
      'Runtime': '6 – 8 hours',
    },
    image: '/images/products/reach-trucks.png',
    featured: false,
  },
  {
    id: 'prod-5',
    name: 'VNA Forklift',
    slug: 'vna-forklift',
    category: 'Forklifts & Reach Trucks',
    categorySlug: 'forklifts-reach-trucks',
    shortDescription: 'Very Narrow Aisle forklift for maximum storage density in warehouses.',
    fullDescription: 'Vikamusk VNA (Very Narrow Aisle) Forklifts are purpose-built for high-density storage environments. Operating in aisles as narrow as 1.6m, these machines maximize warehouse space utilization while providing reliable, precise load handling at extreme heights.',
    features: [
      'Operates in aisles as narrow as 1.6m',
      'Wire or rail guidance systems',
      'High lifting heights up to 17m',
      'Precise load positioning',
      'AC drive motors',
      'Integrated warehouse management',
      'Operator comfort at height',
      'Safety interlocks and sensors',
    ],
    specs: {
      'Capacity': '1,000 – 1,500 kg',
      'Lifting Height': 'Up to 17,000 mm',
      'Aisle Width': '1,600 – 1,800 mm',
      'Battery': 'Lithium-ion',
      'Drive Type': 'AC Motor',
      'Guidance': 'Wire / Rail',
    },
    image: '/images/products/vna-forklift.png',
    featured: false,
  },
  {
    id: 'prod-6',
    name: 'Special Attachments',
    slug: 'special-attachments',
    category: 'Forklifts & Reach Trucks',
    categorySlug: 'forklifts-reach-trucks',
    shortDescription: 'Specialized forklift attachments including clamps, rotators, and pallet handlers.',
    fullDescription: 'Vikamusk offers a comprehensive range of forklift attachments designed to extend the versatility of your material handling fleet. From paper roll clamps and carton clamps to rotators and side-shifters, these attachments are engineered for durability and precision.',
    features: [
      'Paper roll clamps',
      'Carton clamps',
      'Rotators and positioners',
      'Side-shifting fork carriages',
      'Bale clamps',
      'Multiple pallet handlers',
      'Fork extensions',
      'Custom attachment solutions',
    ],
    specs: {
      'Type': 'Clamps / Rotators / Handlers',
      'Compatibility': 'All Vikamusk Forklifts',
      'Capacity Range': '500 – 5,000 kg',
      'Mounting': 'Quick-attach system',
      'Material': 'High-strength steel',
      'Warranty': '12 months',
    },
    image: '/images/products/special-attachments.png',
    featured: false,
  },
  // === Aerial Work Platforms ===
  {
    id: 'prod-7',
    name: 'Electric Scissor Lift',
    slug: 'electric-scissor-lift',
    category: 'Aerial Work Platforms',
    categorySlug: 'aerial-work-platforms',
    shortDescription: 'Powerful lithium battery with larger work platform and on-board diagnostics.',
    fullDescription: 'The Vikamusk Electric Scissor Lift features a powerful lithium battery system with two-wheel drive for superior performance. The larger work platform with high capacity delivers great productivity, while the overload system and motion alarm ensure operator safety. Pull-out battery tray enables easy access and maintenance.',
    features: [
      'Powerful lithium battery system',
      'Two-wheel drive for better performance',
      'Larger work platform with high capacity',
      'Great productivity and efficiency',
      'Overload system and motion alarm',
      'Pull-out battery tray for easy maintenance',
      'On-board self-diagnosis system',
      'Quick troubleshooting capability',
    ],
    specs: {
      'Platform Height': '6 – 14 m',
      'Capacity': '230 – 450 kg',
      'Battery': 'Lithium-ion',
      'Drive Type': '2WD Electric',
      'Platform Size': '2.27 × 1.12 m',
      'Weight': '2,400 – 4,800 kg',
    },
    image: '/images/products/electric-scissor-lift.png',
    featured: true,
  },
  {
    id: 'prod-8',
    name: 'Diesel Scissor Lift',
    slug: 'diesel-scissor-lift',
    category: 'Aerial Work Platforms',
    categorySlug: 'aerial-work-platforms',
    shortDescription: 'Rough terrain four-wheel drive scissor lift with powerful diesel engine.',
    fullDescription: 'The Vikamusk Diesel Scissor Lift is built for demanding outdoor environments with oscillating axles and four-wheel drive. Featuring a powerful diesel engine and larger work platform with high capacity, this lift delivers great productivity on rough terrain sites.',
    features: [
      'Powerful diesel engine',
      'Oscillating axles for terrain adaptation',
      'Four-wheel drive for rough terrain',
      'Larger work platform with high capacity',
      'Overload system and motion alarm',
      'Pull-out engine tray for easy maintenance',
      'On-board self-diagnosis system',
      'Designed for outdoor rough terrain use',
    ],
    specs: {
      'Platform Height': '8 – 18 m',
      'Capacity': '450 – 680 kg',
      'Engine': 'Diesel',
      'Drive Type': '4WD',
      'Platform Size': '3.07 × 1.82 m',
      'Weight': '5,500 – 9,800 kg',
    },
    image: '/images/products/diesel-scissor-lift.png',
    featured: true,
  },
  {
    id: 'prod-9',
    name: 'Articulated Boom Lift',
    slug: 'articulated-boom-lift',
    category: 'Aerial Work Platforms',
    categorySlug: 'aerial-work-platforms',
    shortDescription: 'Multi-jointed boom for accessing hard-to-reach areas with precision.',
    fullDescription: 'The Vikamusk Articulated Boom Lift features a multi-jointed boom design that lets operators reach up and over obstacles. Ideal for construction, maintenance, and industrial applications where direct vertical access is not possible.',
    features: [
      'Multi-jointed articulating boom',
      'Outstanding up-and-over reach',
      'Zero tail swing design options',
      '4WD rough terrain capability',
      'Proportional drive and lift controls',
      'Auto-leveling platform',
      '360-degree continuous rotation',
      'Active platform leveling',
    ],
    specs: {
      'Working Height': '16 – 28 m',
      'Horizontal Reach': '8 – 16 m',
      'Capacity': '230 – 340 kg',
      'Engine': 'Diesel / Electric',
      'Drive Type': '4WD / 2WD',
      'Weight': '7,600 – 18,000 kg',
    },
    image: '/images/products/articulated-boom-lift.png',
    featured: false,
  },
  {
    id: 'prod-10',
    name: 'Telescopic Boom Lift',
    slug: 'telescopic-boom-lift',
    category: 'Aerial Work Platforms',
    categorySlug: 'aerial-work-platforms',
    shortDescription: 'Extended straight reach telescopic boom for maximum working height.',
    fullDescription: 'The Vikamusk Telescopic Boom Lift provides maximum reach and working height for construction, maintenance, and industrial applications. With a robust 4WD chassis and advanced hydraulic system, operators can work safely at extreme heights with precise control.',
    features: [
      'Extended telescopic reach capability',
      'Advanced hydraulic control system',
      'Robust 4WD chassis',
      'Proportional controls for precision',
      'Auto-leveling outriggers',
      'Safety interlocks and alarms',
      'All-terrain capability',
      '360-degree continuous rotation',
    ],
    specs: {
      'Working Height': '20 – 43 m',
      'Horizontal Reach': '17 – 22 m',
      'Capacity': '230 – 340 kg',
      'Engine': 'Diesel',
      'Drive Type': '4WD',
      'Weight': '12,000 – 22,000 kg',
    },
    image: '/images/products/telecopic-boom-lift.png',
    featured: false,
  },
  {
    id: 'prod-11',
    name: 'Diesel Telehandler',
    slug: 'diesel-telehandler',
    category: 'Aerial Work Platforms',
    categorySlug: 'aerial-work-platforms',
    shortDescription: 'Versatile telehandler for material lifting, loading and placing tasks.',
    fullDescription: 'The Vikamusk Diesel Telehandler combines the reach of a crane with the versatility of a forklift. With multiple attachment options and powerful diesel engines, it handles everything from pallet forks to buckets, making it essential equipment on construction sites.',
    features: [
      'Multiple attachment compatibility',
      'Powerful diesel engine',
      'All-wheel steer options',
      'Frame leveling system',
      'High lifting capacity',
      'Crab steering mode',
      'Load moment indicator',
      'Enclosed ROPS/FOPS cabin',
    ],
    specs: {
      'Max Lift Capacity': '2,500 – 4,500 kg',
      'Max Lift Height': '6 – 17 m',
      'Engine': 'Diesel Turbocharged',
      'Drive Type': '4WD',
      'Steering': 'All-wheel / 2-wheel / Crab',
      'Weight': '7,000 – 13,000 kg',
    },
    image: '/images/products/diesel-telehandler.png',
    featured: false,
  },
];

// =========== LOCATIONS ===========
export const locations: Location[] = [
  {
    id: 'loc-1',
    country: 'UAE',
    city: 'Ajman',
    address: 'PO Box 932, Ajman Free Zone, Sheikh Rashid Bin Saeed Al Maktoum St, Ajman, UAE',
    isHeadOffice: true,
    mapUrl: 'https://www.google.com/maps/place/Vikamusk+Construction+Equipment+FZE/@25.419355,55.45035,860m',
  },
  {
    id: 'loc-2',
    country: 'India',
    city: 'Kochi',
    address: 'PO 682031, Shanmugham Rd, Marine Drive, Kochi, Ernakulam, Kerala, India',
    isHeadOffice: false,
  },
];

// =========== STATS ===========
export const stats = [
  { label: 'Customers', value: 300, suffix: '+' },
  { label: "Equipment Sold", value: 350, suffix: '+' },
  { label: 'Sales Divisions', value: 20, suffix: '+' },
  { label: 'Service Divisions', value: 10, suffix: '+' },
  { label: 'Years Experience', value: 10, suffix: '+' },
  { label: 'Manufacturing Partners', value: 10, suffix: '+' },
];

// =========== HELPER FUNCTIONS ===========
export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
