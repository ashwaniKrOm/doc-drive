import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: "100MB",
    },
  },
  
  eslint: {

    ignoreDuringBuilds: true,

  },
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"png.pngtree.com",
      },
      {
        protocol:"https",
        hostname:"cloud.appwrite.io",
      }
    ]
  }
};

export default nextConfig;
