"use client";

import { useEffect } from "react";

/**
 * Renews the unlock cookie each time the gallery opens, so a browser that has entered
 * the code once stays unlocked indefinitely (the cookie's clock restarts every visit).
 */
export default function GalleryKeepAlive() {
  useEffect(() => {
    fetch("/api/gallery-auth", { method: "PUT" }).catch(() => {});
  }, []);
  return null;
}
