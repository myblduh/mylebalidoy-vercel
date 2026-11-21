import type { Metadata } from "next";

export const GALLERY_SECTIONS = {
  designs: {
    title: "Designs",
    blurb:
      "Case studies and redesign concepts, all in one place.",
    source: "digital" as const,
  },
  social: {
    title: "Social Media Posts",
    blurb: "Graphics, carousels and campaign posts made for social channels.",
    source: "social" as const,
  },
  banners: {
    title: "Social Media Banners",
    blurb: "Cover photos, promo banners and app banners.",
    source: "banners" as const,
  },
};
export type SectionKey = keyof typeof GALLERY_SECTIONS;

export const privateRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  nocache: true,
  noarchive: true,
  nosnippet: true,
  noimageindex: true,
  googleBot: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
};
