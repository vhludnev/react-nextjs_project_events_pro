/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  //typescript: { ignoreBuildErrors: true },
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
}

module.exports = nextConfig
