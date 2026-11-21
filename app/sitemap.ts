import type { MetadataRoute } from "next";
import { designs } from "@/lib/designs";

const SITE_URL = "https://mylebalidoy.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/resume`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    // Confidential case studies and /gallery are intentionally not listed.
    ...designs
      .filter((d) => !d.confidential)
      .map((d) => ({
        url: `${SITE_URL}/designs/${d.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  ];
}
