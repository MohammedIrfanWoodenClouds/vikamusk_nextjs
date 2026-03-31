import { sanityFetch } from '@/lib/sanity'
import { GET_PRODUCT_BY_SLUG, GET_ALL_PRODUCTS } from '@/lib/queries'
import { Product } from '@/types'
import { notFound } from 'next/navigation'
import { ProductDetailClient } from '@/components/product-detail-client'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const products = await sanityFetch<Product[]>({
      query: GET_ALL_PRODUCTS,
    })

    return products.map((product) => ({
      slug: product.slug.current,
    }))
  } catch (error) {
    console.error('Failed to generate static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  try {
    const product = await sanityFetch<Product>({
      query: GET_PRODUCT_BY_SLUG,
      params: { slug },
    })

    if (!product) return {}

    return {
      title: `${product.title} | Vikamusk`,
      description: product.description || `Discover ${product.title} construction equipment`,
    }
  } catch (error) {
    return {}
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  try {
    const product = await sanityFetch<Product>({
      query: GET_PRODUCT_BY_SLUG,
      params: { slug },
    })

    if (!product) {
      notFound()
    }

    return <ProductDetailClient product={product} />
  } catch (error) {
    console.error('Failed to load product:', error)
    notFound()
  }
}
