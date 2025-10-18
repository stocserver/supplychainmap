/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['logo.clearbit.com', 'img.logo.dev'],
  },
  experimental: {
    serverComponentsExternalPackages: ['yahoo-finance2'],
  },
}

module.exports = nextConfig

