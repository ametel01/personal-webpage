import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "X-Content-Type-Options",
    value: "nosniff"
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin"
  },
  {
    key: "X-Frame-Options",
    value: "DENY"
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()"
  }
] as const;

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/writing/designing-audit-trails-for-ai-agent-workflows",
        destination: "/writing/how-to-record-and-verify-ai-coding-agent-activity",
        permanent: true
      },
      {
        source: "/writing/designing-contract-verification-pipelines",
        destination: "/writing/how-starknet-contract-source-verification-works",
        permanent: true
      }
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [...securityHeaders]
      }
    ];
  }
};

export default nextConfig;
