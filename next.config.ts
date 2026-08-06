import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    HF_API_KEY: process.env.HF_API_KEY,
  },

  turbopack: {},
  serverExternalPackages: ["unpdf"],
};

  serverExternalPackages: ["pdf2json"],
};

export default nextConfig;

