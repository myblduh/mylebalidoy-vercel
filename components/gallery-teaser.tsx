"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight, Lock } from "lucide-react";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";

interface Preview {
  src: string;
  label: string;
  type: string;
  category: string;
  w: number;
  h: number;
}

/**
 * One featured piece: a fixed, equal-size tile; the picture fills it edge to edge. No caption.
 */
function Tile({ item, web }: { item?: Preview; web?: boolean }) {
  return (
    <div
      role="img"
      aria-label={item?.label}
      className="group relative block"
      onContextMenu={(e) => e.preventDefault()}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-foreground/10 shadow-xl transition-shadow duration-300 group-hover:shadow-[0_30px_60px_-20px_rgba(139,92,246,0.5)] md:rounded-3xl ${web ? "aspect-[1.6] lg:aspect-[1.9]" : ""}`}
        style={{
          // phone screens keep their own tall ratio; web previews are landscape (see class above)
          aspectRatio: web ? undefined : item ? String(item.w / item.h) : "0.46",
          background: "linear-gradient(135deg, rgba(139,92,246,0.22), rgba(120,120,140,0.08))",
        }}
      >
        {item && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.src}
            alt=""
            draggable={false}
            referrerPolicy="same-origin"
            className="gallery-protect h-full w-full select-none object-cover object-top"
          />
        )}
        {/* Blocks right-click / drag on the preview */}
        <span className="absolute inset-0 z-10" />
        {!item && <Lock className="absolute right-3 top-3 text-foreground/30" size={16} />}
      </div>
      {/* Design-frame selection outline + handles, like in the hero */}
      <span className="pointer-events-none absolute inset-0 -m-px rounded-2xl border border-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:rounded-3xl" />
      {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => (
        <span
          key={p}
          className={`pointer-events-none absolute ${p} hidden h-2 w-2 border-[1.5px] border-brand bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block`}
        />
      ))}
    </div>
  );
}

/** A layer that drifts with the pointer; bigger d = closer to the viewer (same idea as the hero). */
function Depth({
  sx,
  sy,
  d,
  rotate,
  className,
  children,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  d: number;
  rotate: number;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useTransform(sx, (v) => v * -d);
  const y = useTransform(sy, (v) => v * -d);
  const r = useTransform(sx, (v) => rotate + v * 1.2);
  return (
    <motion.div style={{ x, y, rotate: r }} className={className}>
      {children}
    </motion.div>
  );
}

/**
 * Landing-page teaser for the gallery: six hand-picked pieces that drift with the pointer.
 * The page itself is public and indexable, so it contains NO image addresses; the
 * previews are fetched after load from a same-origin-only endpoint that hands out
 * short-lived signed thumbnails (see app/api/gallery-preview).
 */
export default function GalleryTeaser() {
  const [items, setItems] = useState<Preview[]>([]);

  useEffect(() => {
    let alive = true;
    fetch("/api/gallery-preview", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : []))
      .then((d: Preview[]) => alive && setItems(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Pointer position over the section (-1..1) drives the depth layers
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });
  const depths = [10, 16, 22, 30, 18, 26];
  const tilts = [-0.6, 0.6, -1.2, 1.2, -1, 1];
  return (
    <section
      id="gallery"
      className="relative overflow-hidden px-6 py-12 sm:py-16 md:px-12 md:py-24 lg:px-20"
      onMouseMove={(e) => {
        if (reduce) return;
        const r = e.currentTarget.getBoundingClientRect();
        mx.set(((e.clientX - r.left) / r.width - 0.5) * 2);
        my.set(((e.clientY - r.top) / r.height - 0.5) * 2);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div className="max-w-2xl">
            <Reveal>
              <Eyebrow n="02" label="Digital & social" />
            </Reveal>
            <h2 className="mb-5 text-2xl font-bold leading-[1.1] tracking-tighter sm:text-3xl md:text-6xl">
              <WordReveal text="The repository of my own works" highlight={["own"]} />
            </h2>
            <Reveal delay={0.1}>
              <p className="text-[13px] leading-relaxed text-foreground/60 sm:text-sm md:text-base">
                A repository of my own works: app and web designs, redesign concepts,
                social media graphics, banners and app store previews. Here are a few of my favorites; the rest are in the gallery.
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <Link href="/gallery" className="pill-button !gap-1.5 !px-4 !py-2 !text-[11px] sm:!gap-2 sm:!px-8 sm:!py-4 sm:!text-[13px]">
              <Lock size={13} /> Enter the gallery <ArrowUpRight size={14} />
            </Link>
          </Reveal>
        </div>

        {/* Six across on desktop: the two web previews stacked in a double-width column, then four phone screens */}
        <div className="mx-auto grid max-w-5xl grid-cols-2 items-start gap-2.5 sm:grid-cols-4 sm:gap-3 lg:grid-cols-6 lg:gap-4">
          <div className="col-span-2 grid grid-cols-1 gap-2.5 sm:col-span-4 sm:grid-cols-2 sm:gap-3 lg:col-span-2 lg:grid-cols-1 lg:gap-4">
            {[0, 1].map((i) => (
              <Depth key={i} sx={sx} sy={sy} d={depths[i]} rotate={tilts[i]} className="relative hover:z-30">
                <Reveal scale={0.94} delay={i * 0.07}>
                  <Tile item={items[i]} web />
                </Reveal>
              </Depth>
            ))}
          </div>
          {[2, 3, 4, 5].map((i) => (
            <Depth key={i} sx={sx} sy={sy} d={depths[i]} rotate={tilts[i]} className="relative hover:z-30">
              <Reveal scale={0.94} delay={i * 0.07}>
                <Tile item={items[i]} />
              </Reveal>
            </Depth>
          ))}
        </div>

      </div>
    </section>
  );
}
