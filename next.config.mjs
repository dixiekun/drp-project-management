/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Force Next.js to include libsql native binaries in standalone build
  outputFileTracingIncludes: {
    '/': [
      './node_modules/@libsql/**/*',
    ],
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
