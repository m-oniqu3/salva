import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  images: {
    remotePatterns: [
      new URL("https://i.pinimg.com/**"),
      new URL("https://picsum.photos/**"),
      {
        protocol: "https",
        hostname: "avatar.iran.liara.run",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
