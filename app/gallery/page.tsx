import type { Metadata } from "next";
import { cookies } from "next/headers";
import Navbar from "@/components/navbar";
import GalleryClient, {
  type CaseTile,
  type GalleryImage,
  type CatKey,
} from "@/components/gallery-client";
import GalleryLock from "@/components/gallery-lock";
import GalleryKeepAlive from "@/components/gallery-keepalive";
import { ACCESS_COOKIE, galleryGroups, hasAccess, signedUrl } from "@/lib/gallery";
import { designs } from "@/lib/designs";
import { privateRobots } from "@/lib/gallery-meta";

// Rendered per request: the lock check and every signed image URL must be fresh.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Repository of My Works",
  description: "A repository of my own works.",
  robots: privateRobots,
};

// manifest category -> gallery category
const CAT: Record<string, CatKey> = {
  digital: "designs",
  social: "social",
  banners: "banners",
  appstore: "appstore",
};
const ORDER: CatKey[] = ["designs", "social", "banners", "appstore"];

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  // Locked: send ONLY the lock screen. No gallery data and no image links leave the server.
  const jar = await cookies();
  if (!hasAccess(jar.get(ACCESS_COOKIE)?.value)) {
    return (
      <main className="min-h-screen">
        <Navbar />
        <GalleryLock />
      </main>
    );
  }

  const { cat } = await searchParams;
  const initialCategory = ORDER.includes(cat as CatKey) ? (cat as CatKey) : "all";

  const images: GalleryImage[] = galleryGroups
    .flatMap((g) =>
      g.items.map((i, n) => ({
        id: i.id,
        groupId: g.id,
        label: g.label,
        category: CAT[g.category],
        type: g.type,
        description: g.description,
        wovlo: g.wovlo,
        n,
        total: g.items.length,
        w: i.w,
        h: i.h,
        thumb: signedUrl(`${i.id}-t`),
        full: signedUrl(i.id),
      })),
    )
    .sort((a, b) => ORDER.indexOf(a.category) - ORDER.indexOf(b.category));

  // Older case-study designs join the Designs category and open their write-ups.
  const cases: CaseTile[] = designs.map((d) => ({
    id: d.slug,
    label: d.title,
    image: d.image,
    href: `/designs/${d.slug}`,
    category: "designs",
    type: `Case study · ${d.platform === "mobile" ? "Mobile app" : "Web"}`,
    description: d.description,
  }));

  return (
    <main className="min-h-screen">
      <Navbar />
      <GalleryKeepAlive />
      <GalleryClient images={images} cases={cases} initialCategory={initialCategory} />
    </main>
  );
}
