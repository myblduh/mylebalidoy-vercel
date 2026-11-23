import { FEATURED, signedUrl } from "@/lib/gallery";

export const dynamic = "force-dynamic";

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "private, no-store, max-age=0",
  "X-Robots-Tag": "noindex, noimageindex, noarchive, nosnippet",
};


/**
 * Hands the landing page its six featured previews as freshly signed, expiring thumbnails,
 * and only to this site's own pages, so the public landing page never contains an image address.
 */
export async function GET(req: Request) {
  const site = req.headers.get("sec-fetch-site");
  if (site !== null && site !== "same-origin") {
    return new Response("[]", { status: 404, headers: HEADERS });
  }
  if (site === null) {
    const ref = req.headers.get("referer");
    const host = new URL(req.url).host;
    try {
      if (!ref || new URL(ref).host !== host)
        return new Response("[]", { status: 404, headers: HEADERS });
    } catch {
      return new Response("[]", { status: 404, headers: HEADERS });
    }
  }

  const body = FEATURED.map((f) => ({
    src: signedUrl(f.file),
    label: f.label,
    type: f.type,
    category: f.category,
    w: f.w,
    h: f.h,
    web: !!f.web,
  }));
  return new Response(JSON.stringify(body), { headers: HEADERS });
}
