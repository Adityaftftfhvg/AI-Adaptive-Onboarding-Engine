import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  env: {
    HF_API_KEY: process.env.HF_API_KEY,
  },
<<<<<<< HEAD
  turbopack: {},
  serverExternalPackages: ["unpdf"],
};
=======
  serverExternalPackages: ["pdf2json"],
};

export default nextConfig;
>>>>>>> 1994384d9fedfbe400d6911da1b972e6c5caff88
