import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"png.pngtree.com",
        port:"",
        pathname:"/png-vector/20210604/ourmid/pngtree-gray-avatar-placeholder-png-image_3416697.jpg"
      }
    ]
  }
};

export default nextConfig;
