import type { MetadataRoute } from "next";

const SITE_URL = "https://mylebalidoy.vercel.app";

// Do NOT disallow /api/gallery/: Google can only honor an image's `X-Robots-Tag: noindex`
// header if it is allowed to request the image URL. Those URLs answer crawlers with a 404
// that carries the noindex header. Only the non-image helper endpoints are blocked.
const PRIVATE = ["/api/gallery-auth", "/api/gallery-preview"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      // AI assistants and answer engines are welcome on public pages only
      {
        userAgent: [
          "GPTBot",
          "OAI-SearchBot",
          "ChatGPT-User",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended",
          "Applebot-Extended",
          "CCBot",
          "Bingbot",
        ],
        allow: "/",
        disallow: PRIVATE,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
