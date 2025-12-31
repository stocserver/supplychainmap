/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['logo.clearbit.com', 'img.logo.dev', 'images.financialmodelingprep.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['yahoo-finance2'],
  },
}

module.exports = nextConfig

