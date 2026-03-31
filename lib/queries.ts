export const GET_FEATURED_PRODUCTS = `
  *[_type == "product" && featured == true] | order(publishedAt desc)[0...6] {
    _id,
    title,
    slug,
    series,
    description,
    featured,
    price,
    availability,
    thumbnail {
      asset,
      hotspot
    },
    category->{
      _id,
      title,
      slug
    },
    publishedAt
  }
`

export const GET_ALL_CATEGORIES = `
  *[_type == "category"] | order(order asc) {
    _id,
    title,
    slug,
    description,
    icon {
      asset
    },
    image {
      asset,
      hotspot
    },
    order
  }
`

export const GET_PRODUCTS_BY_CATEGORY = `
  *[_type == "product" && category->slug.current == $categorySlug] | order(publishedAt desc) {
    _id,
    title,
    slug,
    series,
    description,
    featured,
    price,
    availability,
    thumbnail {
      asset,
      hotspot
    },
    category->{
      _id,
      title,
      slug
    },
    publishedAt
  }
`

export const GET_PRODUCT_BY_SLUG = `
  *[_type == "product" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    series,
    description,
    fullDescription,
    specifications,
    featured,
    price,
    availability,
    images[] {
      asset,
      hotspot
    },
    thumbnail {
      asset,
      hotspot
    },
    brochure {
      asset
    },
    category->{
      _id,
      title,
      slug
    },
    publishedAt
  }
`

export const GET_ALL_PRODUCTS = `
  *[_type == "product"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    series,
    description,
    featured,
    price,
    availability,
    thumbnail {
      asset,
      hotspot
    },
    category->{
      _id,
      title,
      slug
    },
    publishedAt
  }
`
