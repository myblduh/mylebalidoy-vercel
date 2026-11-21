import { readFile } from "node:fs/promises";
import path from "node:path";
import { hasAccessFromHeader, isFeaturedThumb, verify } from "@/lib/gallery";

export const dynamic = "force-dynamic";

const HEADERS = {
  "Content-Type": "image/webp",
  // Never cache on disk / shared caches, never index, never embed elsewhere.
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, noimageindex, noarchive, nosnippet",
  "Content-Disposition": "inline",
  "X-Content-Type-Options": "nosniff",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Referrer-Policy": "no-referrer",
};

/**
 * Refusals look like an ordinary 404 to the outside, but carry a short reason code in
 * `X-Gallery-Deny` so a blank image can be diagnosed from the browser's Network tab.
 */
const deny = (reason: string) =>
  new Response("Not found", {
    status: 404,
    headers: {
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "X-Gallery-Deny": reason,
    },
  });

export async function GET(
  req: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!/^[a-z0-9-]+$/.test(file)) return deny("bad-name");

  const url = new URL(req.url);

  // Search engines, social previewers and scrapers never get an image, signed or not.
  const ua = req.headers.get("user-agent") ?? "";
  if (/bot|crawl|spider|slurp|google|bing|yandex|baidu|duckduck|facebookexternalhit|embedly|preview|python-requests|curl|wget|node-fetch|axios/i.test(ua))
    return deny("crawler");

  if (!verify(file, url.searchParams.get("e"), url.searchParams.get("s")))
    return deny("bad-or-expired-link");

  // Locked browsers get nothing, even with a valid signed link. The only exception is the
  // handful of thumbnails featured on the public landing page.
  if (!isFeaturedThumb(file) && !hasAccessFromHeader(req.headers.get("cookie")))
    return deny("locked-no-cookie");

  // Only load as an <img> from our own pages. Opening the URL in a tab, curl, or another
  // site's page is refused.
  const dest = req.headers.get("sec-fetch-dest");
  const site = req.headers.get("sec-fetch-site");
  if (dest !== null || site !== null) {
    if (dest !== "image") return deny("not-an-image-request");
    // same-origin, and same-site (e.g. localhost on another port) are our own pages
    if (site !== "same-origin" && site !== "same-site") return deny("cross-site");
  } else {
    // On https every real browser sends Sec-Fetch-*, so their absence means "not a browser".
    const secure =
      url.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";
    if (secure) return deny("no-fetch-metadata-on-https");
    // Browsers omit Sec-Fetch-* on plain-http non-localhost origins (LAN / WSL IP).
    // Fall back to: a same-origin Referer if present, and in all cases an
    // image-style Accept header (address-bar navigation asks for text/html).
    const accept = req.headers.get("accept") ?? "";
    if (!accept.includes("image/") || accept.includes("text/html")) return deny("not-image-accept");
    const ref = req.headers.get("referer");
    if (ref) {
      try {
        if (new URL(ref).host !== url.host) return deny("foreign-referer");
      } catch {
        return deny("bad-referer");
      }
    }
  }

  try {
    const buf = await readFile(
      path.join(process.cwd(), "private", "gallery", `${file}.webp`),
    );
    return new Response(new Uint8Array(buf), { headers: HEADERS });
  } catch {
    return deny("file-missing");
  }
}
