"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { ArrowUpRight, ChevronLeft, ChevronRight, Heart, X, ZoomIn, ZoomOut } from "lucide-react";

const MAX_ZOOM = 4;

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

  // ---- zoom & pan (pinch, wheel, buttons, drag) ----
  const [zoom, setZoom] = useState(1);
  const zoomRef = useRef(1);
  const zs = useMotionValue(1); // scale
  const tx = useMotionValue(0); // pan
  const ty = useMotionValue(0);
  const box = useRef<HTMLDivElement>(null);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; z: number } | null>(null);
  const pan = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const moved = useRef(false);

  const clampPan = useCallback(() => {
    const el = box.current;
    if (!el) return;
    const mx = ((zoomRef.current - 1) * el.clientWidth) / 2;
    const my = ((zoomRef.current - 1) * el.clientHeight) / 2;
    tx.set(Math.max(-mx, Math.min(mx, tx.get())));
    ty.set(Math.max(-my, Math.min(my, ty.get())));
  }, [tx, ty]);

  const setZ = useCallback(
    (z: number) => {
      const next = Math.max(1, Math.min(MAX_ZOOM, z));
      zoomRef.current = next;
      zs.set(next);
      setZoom(next);
      if (next === 1) {
        tx.set(0);
        ty.set(0);
      } else clampPan();
    },
    [zs, tx, ty, clampPan],
  );

  // every new picture starts un-zoomed
  useEffect(() => {
    zoomRef.current = 1;
    zs.set(1);
    tx.set(0);
    ty.set(0);
    setZoom(1);
    pointers.current.clear();
    pinch.current = null;
    pan.current = null;
  }, [index, zs, tx, ty]);

  const dist = () => {
    const [a, b] = [...pointers.current.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    moved.current = false;
    if (pointers.current.size === 2) {
      pinch.current = { d: dist() || 1, z: zoomRef.current };
      pan.current = null;
    } else if (pointers.current.size === 1 && zoomRef.current > 1) {
      pan.current = { x: e.clientX, y: e.clientY, tx: tx.get(), ty: ty.get() };
    }
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      moved.current = true;
      setZ((pinch.current.z * dist()) / pinch.current.d);
    } else if (pointers.current.size === 1 && pan.current && zoomRef.current > 1) {
      const dx = e.clientX - pan.current.x;
      const dy = e.clientY - pan.current.y;
      if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
      tx.set(pan.current.tx + dx);
      ty.set(pan.current.ty + dy);
      clampPan();
    }
  };
  const onPointerEnd = (e: React.PointerEvent) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
    if (pointers.current.size === 1 && zoomRef.current > 1) {
      const [p] = [...pointers.current.values()];
      pan.current = { x: p.x, y: p.y, tx: tx.get(), ty: ty.get() };
    } else if (pointers.current.size === 0) pan.current = null;
  };
  const onWheel = (e: React.WheelEvent) => setZ(zoomRef.current * Math.exp(-e.deltaY * 0.0018));

  const onPhotoTap = () => {
    if (moved.current) return;
    const now = Date.now();
    if (now - lastTap.current < 320 && item) {
      if (zoomRef.current > 1) setZ(1); // double-tap while zoomed: back to fit
      else {
        toggleLike(item.id, true);
        setBurst((b) => b + 1);
      }
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
            <div
              ref={box}
              className="relative min-h-0 flex-1 touch-none overflow-hidden px-3 pb-2"
              onClick={onPhotoTap}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerEnd}
              onPointerCancel={onPointerEnd}
              onWheel={onWheel}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={item.id}
                  drag={items.length > 1 && zoom === 1 ? "x" : false}
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
                  <motion.div className="relative h-full w-full" style={{ scale: zs, x: tx, y: ty }}>
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="250vw"
                      quality={100}
                      priority
                      draggable={false}
                      className="select-none rounded-xl object-contain"
                    />
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* zoom controls */}
              <div
                className="absolute bottom-3 right-4 z-30 flex items-center gap-1 rounded-full bg-black/50 p-1 text-white backdrop-blur"
                onClick={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
              >
                <button
                  aria-label="Zoom out"
                  disabled={zoom <= 1}
                  onClick={() => setZ(zoomRef.current - 0.75)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-30"
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  aria-label="Zoom in"
                  disabled={zoom >= MAX_ZOOM}
                  onClick={() => setZ(zoomRef.current + 0.75)}
                  className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/15 disabled:opacity-30"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
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
          <div className="mx-auto max-h-[38vh] w-full max-w-2xl overflow-y-auto px-5 pb-[max(2rem,calc(env(safe-area-inset-bottom)+1.25rem))] pt-1 text-center no-scrollbar">
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
