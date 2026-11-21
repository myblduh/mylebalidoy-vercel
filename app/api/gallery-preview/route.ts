import { FEATURED, featuredItem, signedUrl } from "@/lib/gallery";

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

  const body = FEATURED.map((f) => ({ hit: featuredItem(f), zoom: f.zoom ?? 1 }))
    .filter((x): x is { hit: NonNullable<ReturnType<typeof featuredItem>>; zoom: number } => !!x.hit)
    .map(({ hit: { grp, item }, zoom }) => ({
      zoom,
      src: signedUrl(`${item.id}-t`),
      label: grp.label,
      type: grp.type,
      category: ({ digital: "Designs", social: "Social Media Posts", banners: "Banners", appstore: "App Store" } as Record<string, string>)[grp.category] ?? "",
      w: item.w,
      h: item.h,
    }));
  return new Response(JSON.stringify(body), { headers: HEADERS });
}
