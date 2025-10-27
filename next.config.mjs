/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Force Next.js to include libsql native binaries in standalone build
  outputFileTracingIncludes: {
    '/': [
      './node_modules/@libsql/**/*',
    ],
  },

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
