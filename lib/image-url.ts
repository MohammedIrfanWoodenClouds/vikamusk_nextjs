import imageUrlBuilder from '@sanity/image-url'
import { client } from './sanity'

const builder = imageUrlBuilder(client)

export function urlForImage(source: any) {
  return builder.image(source).auto('format').fit('max').url()
}

export function urlForImageWithOptions(
  source: any,
  options?: {
    width?: number
    height?: number
    fit?: 'crop' | 'fill' | 'fillmax' | 'min' | 'max' | 'scale'
    quality?: number
  }
) {
  let url = builder.image(source).auto('format')

  if (options?.width) {
    url = url.width(options.width)
  }
  if (options?.height) {
    url = url.height(options.height)
  }
  if (options?.fit) {
    url = url.fit(options.fit)
  }

  return url.url()
}
