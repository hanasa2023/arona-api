/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['minio.hanasaki.tech'],
  },
}

module.exports = nextConfig
