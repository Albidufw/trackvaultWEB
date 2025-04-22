/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['utfs.io', 'uploadthing.com'],
  },
};

export default nextConfig;