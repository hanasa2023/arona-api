/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: true,
    outputFileTracingExcludes: {
      '*': [
        'node_modules/@swc/core-linux-x64-gnu',
        'node_modules/@swc/core-linux-x64-musl',
        'node_modules/puppeteer-core',
        'node_modules/puppeteer',
      ],
    },
  },
  webpack: (config) => {
    config.optimization.minimize = true
    return config
  },
}

module.exports = nextConfig
