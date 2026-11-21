import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let userConfig = undefined;
try {
  // try to import ESM first
  userConfig = await import("./v0-user-next.config.mjs");
} catch (e) {
  try {
    // fallback to CJS import
    userConfig = await import("./v0-user-next.config");
  } catch (innerError) {
    // ignore error
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: false,
    qualities: [25, 50, 75, 100],
  },
  transpilePackages: ["@shadergradient/react"],
  // Private gallery images live in /private (not /public) and are read by the
  // API route at request time, so they must be bundled with that function.
  outputFileTracingIncludes: {
    "/api/gallery/[file]": ["./private/gallery/**/*"],
  },
  async headers() {
    const noindex = [
      {
        key: "X-Robots-Tag",
        value: "noindex, nofollow, noarchive, nosnippet, noimageindex",
      },
      { key: "Cache-Control", value: "private, no-store, max-age=0" },
    ];
    return [
      { source: "/gallery", headers: noindex },
      { source: "/gallery/:path*", headers: noindex },
      { source: "/api/gallery/:path*", headers: noindex },
      // Certificates and the award photo: keep the image files out of Google Images.
      // (They stay crawlable in robots.txt so Google can actually read this header.)
      {
        source: "/assets/certs/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noimageindex" }],
      },
      {
        source: "/assets/awards/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, noimageindex" }],
      },
      { source: "/designs/solar-landing-page-redesign", headers: noindex },
    ];
  },
  turbopack: {
    root: __dirname,
  },
  experimental: {
    webpackBuildWorker: true,
    parallelServerBuildTraces: true,
    parallelServerCompiles: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.resolve.alias["@shadergradient/react"] = path.resolve(
        __dirname,
        "components/shadergradient-mock.tsx",
      );
    }
    return config;
  },
};

if (userConfig) {
  // ESM imports will have a "default" property
  const config = userConfig.default || userConfig;

  for (const key in config) {
    if (
      typeof nextConfig[key] === "object" &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...config[key],
      };
    } else {
      nextConfig[key] = config[key];
    }
  }
}

export default nextConfig;
