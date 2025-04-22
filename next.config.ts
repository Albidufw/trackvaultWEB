/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['utfs.io', 'uploadthing.com'],
  },
};

module.exports = nextConfig;