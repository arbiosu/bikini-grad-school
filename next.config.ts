import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-2e58def0a2d64e1992d76e72a67be0ee.r2.dev',
        port: '',
      },
      // legacy storage for old content
      {
        protocol: 'https',
        hostname: 'mewnfmdmrrhdiglqsppr.supabase.co',
        port: '',
      },
    ],
  },
};

export default nextConfig;
