/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lab-access-system' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/lab-access-system' : '',
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NODE_ENV === 'production' 
      ? 'https://sebas19956.github.io/lab-access-system' 
      : 'http://localhost:3000'
  }
}

export default nextConfig