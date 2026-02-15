import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    loader: 'custom',
    loaderFile: './src/lib/image-loader.ts',
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'bikinigradschoolassets.com',
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
