import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'https://delhichaska-backend.onrender.com/api/:path*',
        },
      ]
    }
    return []
  },
}

export default nextConfig;
