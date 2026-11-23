import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import manifest from "@/data/gallery.generated.json";
import config from "@/data/gallery.config.json";

export type GalleryCategory = "digital" | "social" | "banners" | "appstore";

export interface GalleryItem {
  id: string;
  variant: string;
  w: number;
  h: number;
}
export interface GalleryGroup {
  id: string;
  category: GalleryCategory;
  /** display label (see data/gallery.config.json) */
  label: string;
  wovlo: boolean;
  type: string;
  description: string;
  items: GalleryItem[];
}

const cfg = config as Record<
  string,
  { label?: string; wovlo?: boolean; type?: string; description?: string }
>;

export const galleryGroups: GalleryGroup[] = (manifest as any[]).map((g) => ({
  id: g.id,
  category: g.category,
  label: cfg[g.id]?.label ?? g.title,
  wovlo: !!cfg[g.id]?.wovlo,
  type: cfg[g.id]?.type ?? "Design",
  description: cfg[g.id]?.description ?? "",
  items: g.items,
}));

/* ------------------------------------------------------------------ *
 * Short-lived signed URLs. The image route refuses anything without a
 * valid, unexpired signature, so a copied URL stops working quickly and
 * can't be guessed or enumerated.
 * ------------------------------------------------------------------ */
const TTL_SECONDS = 60 * 30;

function secret() {
  const s = process.env.GALLERY_SECRET;
  if (!s && process.env.NODE_ENV === "production") {
    throw new Error("GALLERY_SECRET must be set in production");
  }
  return s || "dev-only-gallery-secret";
}

const sign = (file: string, exp: number) =>
  createHmac("sha256", secret()).update(`${file}.${exp}`).digest("base64url");

export function signedUrl(file: string) {
  const exp = Math.floor(Date.now() / 1000) + TTL_SECONDS;
  return `/api/gallery/${file}?e=${exp}&s=${sign(file, exp)}`;
}

export function verify(file: string, exp: string | null, sig: string | null) {
  if (!exp || !sig) return false;
  const e = Number(exp);
  if (!Number.isFinite(e) || e < Date.now() / 1000) return false;
  const a = Buffer.from(sig);
  const b = Buffer.from(sign(file, e));
  return a.length === b.length && timingSafeEqual(a, b);
}

/* ------------------------------------------------------------------ *
 * Gallery access (the 4-digit code). A correct code sets an HttpOnly cookie holding a
 * signed token. The token never expires on its own; the cookie is renewed every visit,
 * so once unlocked, a browser stays unlocked.
 * ------------------------------------------------------------------ */
export const ACCESS_COOKIE = "gallery_access";
export const ACCESS_MAX_AGE = 60 * 60 * 24 * 400; // the longest lifetime browsers allow (400 days)

/** The code. Set GALLERY_PIN in your environment (Vercel → Settings → Environment Variables). */
export const galleryPin = () => {
  const pin = process.env.GALLERY_PIN;
  if (pin) return pin;
  // The code must live in the environment in production, never in the source (the repo is public).
  if (process.env.NODE_ENV === "production") throw new Error("GALLERY_PIN must be set in production");
  return "0227"; // local development convenience only
};

export const accessToken = () =>
  createHmac("sha256", secret()).update("gallery-access-v1").digest("base64url");

export function hasAccess(cookieValue?: string | null) {
  if (!cookieValue) return false;
  const a = Buffer.from(cookieValue);
  const b = Buffer.from(accessToken());
  return a.length === b.length && timingSafeEqual(a, b);
}

/** Pull our cookie out of a raw Cookie header (used by the image route). */
export function hasAccessFromHeader(cookieHeader: string | null) {
  if (!cookieHeader) return false;
  // Split on ";" and trim, so the cookie is found wherever it sits among the others
  for (const part of cookieHeader.split(";")) {
    const i = part.indexOf("=");
    if (i < 0 || part.slice(0, i).trim() !== ACCESS_COOKIE) continue;
    try {
      return hasAccess(decodeURIComponent(part.slice(i + 1).trim()));
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * The six pieces shown on the public landing page, in order. Only THESE thumbnails
 * (private/gallery/preview-N-t.webp) can be loaded without the code; every other image
 * requires an unlocked browser.
 */
export const FEATURED: { file: string; label: string; type: string; category: string; w: number; h: number; web?: boolean }[] = [
  { file: "preview-1-t", label: "Blueshift Residential Solar", type: "Web Design", category: "Designs", w: 1200, h: 1597, web: true },
  { file: "preview-2-t", label: "Trackify", type: "Web Design", category: "Designs", w: 1200, h: 776, web: true },
  { file: "preview-3-t", label: "Payonnect", type: "App Design", category: "Designs", w: 1200, h: 2602 },
  { file: "preview-4-t", label: "CosMarket", type: "App Design", category: "Designs", w: 1200, h: 2597 },
  { file: "preview-5-t", label: "Budget Organizer", type: "App Store", category: "App Store", w: 1200, h: 2597 },
  { file: "preview-6-t", label: "Poke Scanner", type: "App Store", category: "App Store", w: 1200, h: 2597 },
];
export const isFeaturedThumb = (file: string) => FEATURED.some((f) => f.file === file);
