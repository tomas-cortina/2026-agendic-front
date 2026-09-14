import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // bcrypt-ts is ESM-only; next/jest only transforms node_modules listed here.
  transpilePackages: ["bcrypt-ts"],
};

export default nextConfig;
