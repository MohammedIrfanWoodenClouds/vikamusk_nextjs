import { SanityImageAssetDocument } from 'next-sanity'

export interface Category {
  _id: string
  _type: 'category'
  title: string
  slug: { current: string }
  description?: string
  icon?: {
    asset: SanityImageAssetDocument
  }
  image?: {
    asset: SanityImageAssetDocument
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  order?: number
}

export interface Specification {
  label: string
  value: string
}

export interface Product {
  _id: string
  _type: 'product'
  title: string
  slug: { current: string }
  category: Category
  series?: string
  description?: string
  fullDescription?: any[]
  specifications?: Specification[]
  images?: Array<{
    asset: SanityImageAssetDocument
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }>
  thumbnail?: {
    asset: SanityImageAssetDocument
    hotspot?: {
      x: number
      y: number
      height: number
      width: number
    }
  }
  featured?: boolean
  brochure?: {
    asset: {
      url: string
      originalFilename: string
    }
  }
  price?: string
  availability?: 'in_stock' | 'coming_soon' | 'contact_sales'
  publishedAt: string
}

export interface Enquiry {
  _id?: string
  _type: 'enquiry'
  fullName: string
  email: string
  phone?: string
  company?: string
  productInterest?: Product[]
  message: string
  country?: string
  submittedAt?: string
  responded?: boolean
}

export interface NavLink {
  label: string
  href: string
  submenu?: NavLink[]
}
