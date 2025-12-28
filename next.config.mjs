import createNextIntlPlugin from 'next-intl/plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt');
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'tiyf2vzl1qwd7vwd.public.blob.vercel-storage.com',
      },
    ],
  },
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
