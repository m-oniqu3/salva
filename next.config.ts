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
      new URL("https://image.tmdb.org/t/p/**"),
      new URL("http://image.tmdb.org/t/p/**"),
    ],
    qualities: [25, 50, 75],
  },
};

export default nextConfig;
