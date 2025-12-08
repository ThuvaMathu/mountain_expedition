/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    //ignoreDuringBuilds: true,
  },
  typescript: {
    //ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude Firebase Admin SDK from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        child_process: false,
      };
    }
    return config;
  },
};

export default nextConfig;
