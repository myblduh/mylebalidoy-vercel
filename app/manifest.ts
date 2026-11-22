import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Myle Balidoy | UI/UX Designer",
    short_name: "Myle",
    description: "Portfolio of Myle Balidoy, UI/UX Designer and Digital Designer.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#8B5CF6",
    icons: [
      { src: "/assets/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/assets/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/assets/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
