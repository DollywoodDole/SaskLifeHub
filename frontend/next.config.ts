import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000"}/auth/:path*`,
      },
      {
        source: "/api/marketplace/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000"}/marketplace/:path*`,
      },
      {
        source: "/api/users/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000"}/users/:path*`,
      },
      {
        source: "/api/notifications/:path*",
        destination: `${process.env.NEXT_PUBLIC_AUTH_API_URL || "http://localhost:5000"}/notifications/:path*`,
      },
    ];
  },
};
export default nextConfig;
