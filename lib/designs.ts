import designsData from "@/data/designs.json";

export interface DesignLink {
  text: string;
  url: string;
}

export interface Design {
  slug: string;
  title: string;
  image: string;
  date: string;
  platform: "web" | "mobile";
  confidential?: boolean;
  role: string;
  description: string;
  overview: string[];
  behindTheScenes: { title: string; text: string }[];
  links: DesignLink[];
  skills: string[];
  award?: string;
  challenge?: string;
  results?: string[];
  figures?: { src: string; caption: string; width: number; height: number }[];
}

export const designs: Design[] = designsData as Design[];

export const getDesign = (slug: string) => designs.find((d) => d.slug === slug);

export function getNeighbors(slug: string) {
  const i = designs.findIndex((d) => d.slug === slug);
  return {
    prev: designs[(i - 1 + designs.length) % designs.length],
    next: designs[(i + 1) % designs.length],
  };
}

/** Splits "Trackify: Inventory Management System" into name + tagline. */
export function splitTitle(title: string) {
  const [name, ...rest] = title.split(":");
  return rest.length
    ? { name: name.trim(), tagline: rest.join(":").trim() }
    : { name: title, tagline: "" };
}

export function figmaEmbedUrl(url: string, mobile = false) {
  let proto = url;
  if (proto.includes("/design/")) proto = proto.replace("/design/", "/proto/");
  else if (proto.includes("/file/")) proto = proto.replace("/file/", "/proto/");
  if (!proto.includes("scaling="))
    // phone prototypes: "contain" fits the entire screen, top to bottom, inside the frame
    proto += (proto.includes("?") ? "&" : "?") + (mobile ? "scaling=contain" : "scaling=scale-down-width");
  if (!proto.includes("hide-ui=")) proto += "&hide-ui=1";
  return `https://www.figma.com/embed?embed_host=share&url=${encodeURIComponent(proto)}`;
}

export const getPrototypeLink = (d: Design) =>
  d.links.find((l) => l.url.includes("figma.com"));
