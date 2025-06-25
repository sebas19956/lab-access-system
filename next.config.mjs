/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Necesario para GitHub Pages
  trailingSlash: true, // Asegura compatibilidad con GitHub Pages
  eslint: {
    ignoreDuringBuilds: true, // Evita errores en el build si hay problemas de ESLint
  },
  typescript: {
    ignoreBuildErrors: true, // Evita que errores de TypeScript detengan el build
  },
  images: {
    unoptimized: true, // Requiere para export estático (sin servidor)
  },
  assetPrefix: process.env.NODE_ENV === 'production' ? '/lab-access-system/' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/lab-access-system' : '',
  env: {
    NEXT_PUBLIC_BASE_URL:
      process.env.NODE_ENV === 'production'
        ? 'https://sebas19956.github.io/lab-access-system'
        : 'http://localhost:3000',
  },
};

export default nextConfig;
