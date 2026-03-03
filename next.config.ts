import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    useCache: true,
  },
  images: {
    remotePatterns: [
      new URL("https://i.pinimg.com/**"),
      new URL("https://picsum.photos/**"),
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "jtbcimmdmzqsetzqofrd.supabase.co",
      },
    ],
    qualities: [25, 50, 75],
  },
};

export default nextConfig;
