/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // External packages - don't bundle libsql in serverless functions
  experimental: {
    serverComponentsExternalPackages: ['@libsql/client', 'libsql', 'drizzle-orm'],
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
