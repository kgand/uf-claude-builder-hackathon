/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'], // Add your domains here for Image optimization
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/:path*', // proxy to fastapi
      },
      {
        source: '/session_screenshots/:path*',
        destination: 'http://localhost:8000/session_screenshots/:path*', // proxy pics
      },
    ];
  },
};

module.exports = nextConfig;