/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Allow larger request bodies for base64 image uploads
  serverExternalPackages: ['mongodb'],
}

export default nextConfig
