"use client";

import { useCallback, useEffect, useState } from "react";
import { Heart } from "lucide-react";

const EVENT = "likes-changed";

/**
 * Hearts for one collection (e.g. "cases"). Saved in this browser only and kept in sync
 * between every place that shows the same heart (cards, gallery tiles, the case study).
 */
export function useLikes(ns: string) {
  const key = `${ns}-likes-v1`;
  const [likes, setLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    const read = () => {
      try {
        const raw = localStorage.getItem(key);
        setLikes(new Set(raw ? JSON.parse(raw) : []));
      } catch {
        setLikes(new Set());
      }
    };
    read();
    const onChange = (e: Event) => {
      if ((e as CustomEvent).detail === key) read();
    };
    window.addEventListener(EVENT, onChange);
    window.addEventListener("storage", read);
    return () => {
      window.removeEventListener(EVENT, onChange);
      window.removeEventListener("storage", read);
    };
  }, [key]);

  const toggle = useCallback(
    (id: string) => {
      try {
        const raw = localStorage.getItem(key);
        const next = new Set<string>(raw ? JSON.parse(raw) : []);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        localStorage.setItem(key, JSON.stringify([...next]));
        window.dispatchEvent(new CustomEvent(EVENT, { detail: key }));
      } catch {}
    },
    [key],
  );

  return { likes, toggle };
}

export default function HeartButton({
  ns,
  id,
  variant = "icon",
  className = "",
}: {
  ns: string;
  id: string;
  /** "icon" = round overlay button, "pill" = labeled button for page headers */
  variant?: "icon" | "pill";
  className?: string;
}) {
  const { likes, toggle } = useLikes(ns);
  const liked = likes.has(id);

  const onClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggle(id);
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={liked}
        className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
          liked
            ? "border-rose-500 bg-rose-500 text-white"
            : "border-foreground/15 text-foreground/70 hover:border-rose-500 hover:text-rose-500"
        } ${className}`}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
        {liked ? "Liked" : "Like this"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={liked ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={liked}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-transform hover:scale-110 active:scale-90 ${className}`}
    >
      <Heart
        size={16}
        className={liked ? "text-rose-500" : ""}
        fill={liked ? "currentColor" : "none"}
      />
    </button>
  );
}
