import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['pyodide'],
  // Configure friendly route redirects
  async redirects() {
    return [
      {
        source: '/practice',
        destination: '/exercises/in-loi-chao-codecobug',
        permanent: false,
      },
      {
        source: '/workspace',
        destination: '/exercises/in-loi-chao-codecobug',
        permanent: false,
      },
      {
        source: '/courses',
        destination: '/curriculum',
        permanent: false,
      },
      {
        source: '/learn',
        destination: '/curriculum',
        permanent: false,
      },
    ];
  },
  // Configure HTTP headers if required for SharedArrayBuffer / Pyodide
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
