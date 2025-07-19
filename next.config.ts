import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { dev }) => {
    // Fix source maps in development
    if (dev) {
      config.devtool = 'source-map';
    }
    
    return config;
  },
  eslint:{
    ignoreDuringBuilds:true
  },
  typescript:{
    ignoreBuildErrors:true,
  }
};

export default nextConfig;
