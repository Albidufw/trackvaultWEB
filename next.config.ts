/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  api: {
    bodyParser: {
      sizeLimit: '50mb', // increase if needed
    },
  },
};

export default nextConfig;
