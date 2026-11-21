"use client";

import { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

/**
 * Click-to-load Figma prototype. Loading on demand keeps the page fast and
 * avoids Figma's heavy iframe running while the visitor is still reading.
 */
export default function PrototypeFrame({
  embedUrl,
  poster,
  title,
  platform,
}: {
  embedUrl: string | null;
  poster: string;
  title: string;
  platform: "web" | "mobile";
}) {
  const [live, setLive] = useState(false);
  const mobile = platform === "mobile";

  return (
    <div
      className={`relative overflow-hidden rounded-[28px] border border-foreground/10 bg-foreground/5 shadow-2xl ${
        mobile
          ? "mx-auto aspect-[9/17] w-full max-w-[360px] lg:w-[min(360px,calc((100svh-9rem)*9/17))]"
          : "aspect-[16/10] w-full"
      }`}
    >
      {live && embedUrl ? (
        <iframe
          title={`${title} prototype`}
          src={embedUrl}
          className="absolute inset-0 h-full w-full border-0"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={poster}
            alt={title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 60vw"
            className="object-cover"
          />
          {embedUrl && (
            <button
              type="button"
              onClick={() => setLive(true)}
              className="group absolute inset-0 flex items-center justify-center bg-black/30 transition-colors hover:bg-black/40"
              aria-label={`Load interactive prototype for ${title}`}
            >
              <span className="flex items-center gap-3 rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-xl transition-transform group-hover:scale-105">
                <Play size={16} fill="currentColor" />
                Try the prototype
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
}
