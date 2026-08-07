import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    HF_API_KEY: process.env.HF_API_KEY,
  },
  turbopack: {},

  serverExternalPackages: ["unpdf", "pdf2json", "@xenova/transformers", "@prisma/client"],
};

export default nextConfig;