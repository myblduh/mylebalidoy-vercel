"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, X } from "lucide-react";

export interface ViewerItem {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  description?: string;
  tags?: string[];
  links?: { text: string; url: string }[];
}

/**
 * Full-screen viewer shared by the development projects and the certificates.
 * Same look and behavior as the gallery viewer: heart on the left, X on the right,
 * the whole image fits on screen, swipe / arrows move between items, double-tap to heart.
 */
export default function MediaViewer({
  items,
  index,
  onIndex,
  onClose,
  likeKey,
}: {
  items: ViewerItem[];
  index: number | null;
  onIndex: (i: number) => void;
  onClose: () => void;
  /** localStorage namespace for hearts (saved on this device only) */
  likeKey: string;
}) {
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [burst, setBurst] = useState(0);
  const lastTap = useRef(0);
  const storeKey = `${likeKey}-likes-v1`;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storeKey);
      if (raw) setLikes(new Set(JSON.parse(raw)));
    } catch {}
  }, [storeKey]);

  const toggleLike = useCallback(
    (id: string, force?: boolean) => {
      setLikes((prev) => {
        const next = new Set(prev);
        if (force === true || (force === undefined && !next.has(id))) next.add(id);
        else next.delete(id);
        try {
          localStorage.setItem(storeKey, JSON.stringify([...next]));
        } catch {}
        return next;
      });
    },
    [storeKey],
  );

  const open = index !== null;
  const item = open ? items[index] : undefined;

  const step = useCallback(
    (d: number) => {
      if (index === null) return;
      onIndex((index + d + items.length) % items.length);
    },
    [index, items.length, onIndex],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
      if (e.key.toLowerCase() === "l" && item) toggleLike(item.id);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose, step, item, toggleLike]);

  const onPhotoTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 320 && item) {
      toggleLike(item.id, true);
      setBurst((b) => b + 1);
    }
    lastTap.current = now;
  };

  return (
    <AnimatePresence>
      {item && index !== null && (
        <motion.div
          key="media-viewer"
          className="fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label={item.title}
        >
          {/* Header: heart left, X right */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
            <button
              onClick={() => toggleLike(item.id)}
              aria-label={likes.has(item.id) ? "Unlike" : "Like"}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <Heart
                size={18}
                className={likes.has(item.id) ? "text-rose-500" : ""}
                fill={likes.has(item.id) ? "currentColor" : "none"}
              />
            </button>
            <div className="min-w-0 text-center">
              <p className="truncate text-sm font-semibold">{item.title}</p>
              <p className="text-[11px] text-white/50">
                {item.subtitle ? `${item.subtitle} · ` : ""}
                {index + 1} / {items.length}
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
            >
              <X size={18} />
            </button>
          </div>

          {/* Image: always fits on screen */}
          <div className="relative flex min-h-0 flex-1 flex-col">
            <div className="relative min-h-0 flex-1 px-3 pb-2" onClick={onPhotoTap}>
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.id}
                  drag={items.length > 1 ? "x" : false}
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.35}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70 || info.velocity.x < -500) step(1);
                    else if (info.offset.x > 70 || info.velocity.x > 500) step(-1);
                  }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.22 }}
                  className="relative mx-auto h-full w-full max-w-5xl"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="100vw"
                    quality={100}
                    priority
                    draggable={false}
                    className="select-none rounded-xl object-contain"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Big heart pops on double-tap, centered on the picture */}
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
              <AnimatePresence>
                {burst > 0 && (
                  <motion.div
                    key={burst}
                    className="text-rose-500 drop-shadow-lg"
                    initial={{ scale: 0.3, opacity: 0.95 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    <Heart size={110} fill="currentColor" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Description, tags and links */}
          <div className="mx-auto max-h-40 w-full max-w-2xl overflow-y-auto px-5 pb-5 pt-1 text-center no-scrollbar">
            {item.description && (
              <p className="text-xs leading-relaxed text-white/70 md:text-sm">
                {item.description}
              </p>
            )}
            {item.tags && item.tags.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="tag-purple rounded-full px-2.5 py-0.5 text-[11px] font-medium"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            {item.links && item.links.length > 0 && (
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {item.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:opacity-90"
                  >
                    {l.text}
                    <ArrowUpRight size={14} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {items.length > 1 && (
            <>
              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 md:flex"
              >
                <ChevronLeft />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 md:flex"
              >
                <ChevronRight />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
