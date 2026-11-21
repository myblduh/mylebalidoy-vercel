"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Heart,
  Layers,
  Search,
  X,
} from "lucide-react";
import { Reveal, WordReveal } from "@/components/reveal";
import HeartButton, { useLikes } from "@/components/heart-button";

export type CatKey = "designs" | "social" | "banners" | "appstore";

export interface GalleryImage {
  id: string;
  groupId: string;
  label: string;
  category: CatKey;
  type: string;
  description: string;
  wovlo: boolean;
  n: number; // position inside its project
  total: number; // images in its project
  w: number;
  h: number;
  thumb: string;
  full: string;
}
export interface CaseTile {
  id: string;
  label: string;
  image: string;
  href: string;
  category: "designs";
  type: string;
  description: string;
}
interface Group {
  id: string;
  label: string;
  category: CatKey;
  type: string;
  description: string;
  wovlo: boolean;
  items: GalleryImage[];
}

/** Tiles are mounted (and their images requested) in batches of this size. */
const BATCH = 8;

const CATEGORIES: { key: "all" | CatKey; label: string }[] = [
  { key: "all", label: "All categories" },
  { key: "designs", label: "Designs" },
  { key: "social", label: "Social Media Posts" },
  { key: "banners", label: "Banners" },
  { key: "appstore", label: "App Store" },
];
const CAT_LABEL: Record<CatKey, string> = {
  designs: "Designs",
  social: "Social Media Posts",
  banners: "Banners",
  appstore: "App Store",
};

/** Transparent layer over every image: swallows right-click, drag and long-press. */
function Shield() {
  return (
    <div
      className="absolute inset-0 z-10"
      onContextMenu={(e) => e.preventDefault()}
      onDragStart={(e) => e.preventDefault()}
    />
  );
}

function Protected({
  src,
  className = "",
  eager,
}: {
  src: string;
  className?: string;
  eager?: boolean;
}) {
  // A failed load (a request that raced the unlock cookie, a dropped connection) retries a
  // few times with a cache-busting suffix; the signature only covers file + expiry.
  const [tries, setTries] = useState(0);
  const url = tries ? src + (src.includes("?") ? "&" : "?") + "r=" + tries : src;
  return (
    <>
      {/* Plain <img>: the signed URL must reach our route directly (no optimizer proxy). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt=""
        draggable={false}
        onError={() => {
          if (tries < 1) setTimeout(() => setTries((t) => t + 1), 700);
        }}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        referrerPolicy="same-origin"
        className={`gallery-protect select-none ${className}`}
        onContextMenu={(e) => e.preventDefault()}
      />
      <Shield />
    </>
  );
}

/** A dropdown that matches the site (the browser's native one can't be themed). */
function CategorySelect({
  value,
  onChange,
  counts,
}: {
  value: "all" | CatKey;
  onChange: (v: "all" | CatKey) => void;
  counts: Record<"all" | CatKey, number>;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = CATEGORIES.find((c) => c.key === value) ?? CATEGORIES[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative min-w-0">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Filter by category"
        onClick={() => setOpen((o) => !o)}
        className={`flex w-full items-center justify-between gap-2 rounded-full border bg-white py-2 pl-3.5 pr-3 text-[13px] font-medium text-foreground outline-none transition-colors dark:bg-[#16161a] sm:w-auto sm:min-w-[200px] sm:py-3 sm:pl-5 sm:pr-4 sm:text-sm ${
          open ? "border-brand" : "border-foreground/15 hover:border-brand/60"
        }`}
      >
        <span className="truncate">{current.label}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${
            open ? "rotate-180 text-brand" : "text-foreground/50"
          }`}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute left-0 top-full z-[95] mt-2 min-w-[220px] origin-top-left overflow-hidden rounded-2xl border border-foreground/10 bg-white p-1.5 shadow-[0_24px_48px_-16px_rgba(0,0,0,0.25)] dark:bg-[#16161a]"
          >
            {CATEGORIES.map((c) => {
              const selected = c.key === value;
              return (
                <li key={c.key} role="option" aria-selected={selected}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(c.key);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      selected
                        ? "bg-brand/10 text-brand"
                        : "text-foreground/80 hover:bg-foreground/[0.06]"
                    }`}
                  >
                    <span className="flex-1 truncate">{c.label}</span>
                    <span className="text-xs font-normal text-foreground/40">
                      {counts[c.key]}
                    </span>
                    <Check size={15} className={selected ? "opacity-100" : "opacity-0"} />
                  </button>
                </li>
              );
            })}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

const LIKES_KEY = "gallery-likes-v2"; // keyed by project (group) id

export default function GalleryClient({
  images,
  cases,
  initialCategory = "all",
}: {
  images: GalleryImage[];
  cases: CaseTile[];
  initialCategory?: "all" | CatKey;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | CatKey>(initialCategory);
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [likes, setLikes] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<{ g: number; v: number } | null>(null);
  const [burst, setBurst] = useState(0); // bumps to replay the big double-tap heart
  const [navVisible, setNavVisible] = useState(true);
  const [visible, setVisible] = useState(BATCH); // how many project tiles are mounted so far
  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastTap = useRef(0);

  // Mirror the site navbar (hides on scroll down, returns on scroll up) so the
  // toolbar can sit just below it, or at the very top when it is hidden.
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setNavVisible(y <= 50);
      last = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Likes live in this browser only (no account / server).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LIKES_KEY);
      if (raw) setLikes(new Set(JSON.parse(raw)));
    } catch {}
  }, []);
  const toggleLike = useCallback((id: string, force?: boolean) => {
    setLikes((prev) => {
      const next = new Set(prev);
      if (force === true || (force === undefined && !next.has(id))) next.add(id);
      else next.delete(id);
      try {
        localStorage.setItem(LIKES_KEY, JSON.stringify([...next]));
      } catch {}
      return next;
    });
  }, []);

  // One entry per project: the grid shows its first image, variants live inside.
  const groups = useMemo<Group[]>(() => {
    const map = new Map<string, Group>();
    for (const im of images) {
      if (!map.has(im.groupId))
        map.set(im.groupId, {
          id: im.groupId,
          label: im.label,
          category: im.category,
          type: im.type,
          description: im.description,
          wovlo: im.wovlo,
          items: [],
        });
      map.get(im.groupId)!.items.push(im);
    }
    return [...map.values()];
  }, [images]);

  const q = query.trim().toLowerCase();
  // Search covers the name, tag, category and description.
  const match = (cat: CatKey, ...fields: string[]) =>
    !q ||
    CAT_LABEL[cat].toLowerCase().includes(q) ||
    fields.some((f) => f.toLowerCase().includes(q));

  const shownGroups = useMemo(
    () =>
      groups.filter(
        (g) =>
          (category === "all" || g.category === category) &&
          match(g.category, g.label, g.type, g.description, g.wovlo ? "wovlo" : "redesign concept") &&
          (!onlyLiked || likes.has(g.id)),
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groups, category, q, onlyLiked, likes],
  );
  const caseLikes = useLikes("cases").likes;
  const shownCases = useMemo(
    () =>
      !(category === "all" || category === "designs")
        ? []
        : cases.filter(
            (c) =>
              match(c.category, c.label, c.type, c.description) &&
              (!onlyLiked || caseLikes.has(c.id)),
          ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [cases, category, q, onlyLiked, caseLikes],
  );

  // A new search / category / favorites filter starts again from the first batch
  useEffect(() => {
    setVisible(BATCH);
  }, [category, q, onlyLiked]);

  // Mount the next batch a little before the end of the list scrolls into view
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || visible >= shownGroups.length) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible((v) => v + BATCH);
      },
      { rootMargin: "250px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [visible, shownGroups.length]);

  const group = open ? shownGroups[open.g] : undefined;
  const current = group?.items[open?.v ?? 0];

  const close = useCallback(() => setOpen(null), []);
  const stepVariant = useCallback(
    (d: number) =>
      setOpen((o) => {
        if (!o) return o;
        const len = shownGroups[o.g]?.items.length ?? 1;
        return { ...o, v: (o.v + d + len) % len };
      }),
    [shownGroups],
  );
  const stepProject = useCallback(
    (d: number) =>
      setOpen((o) =>
        o && shownGroups.length
          ? { g: (o.g + d + shownGroups.length) % shownGroups.length, v: 0 }
          : o,
      ),
    [shownGroups],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s", "p", "u"].includes(e.key.toLowerCase()))
        e.preventDefault();
      if (!open) return;
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") stepVariant(1);
      if (e.key === "ArrowLeft") stepVariant(-1);
      if (e.key === "ArrowDown") stepProject(1);
      if (e.key === "ArrowUp") stepProject(-1);
      if (e.key.toLowerCase() === "l" && group) toggleLike(group.id);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, stepVariant, stepProject, toggleLike, group]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Double-tap / double-click the photo to like the project, like a phone photo app.
  const onPhotoTap = () => {
    const now = Date.now();
    if (now - lastTap.current < 320 && group) {
      toggleLike(group.id, true);
      setBurst((b) => b + 1);
    }
    lastTap.current = now;
  };

  const likedCount = likes.size + caseLikes.size;
  const total = shownGroups.length + shownCases.length;

  return (
    <div
      className="mx-auto max-w-7xl px-3 pb-24 pt-24 sm:px-6 md:px-12 md:pt-32 lg:px-20"
      onContextMenu={(e) => e.preventDefault()}
    >
      <header className="mb-6 px-1 md:mb-8">
        <h1 className="text-3xl font-bold leading-[1.05] tracking-tighter md:text-5xl">
          <WordReveal text="My gallery" highlight={["gallery"]} />
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground/60">
          Tap a design to view it. Designs with a stack icon have more variants
          inside. Double-tap to heart. Hearts are saved on this device only.
        </p>
      </header>

      {/* Toolbar: solid background so nothing shows through while scrolling */}
      <div
        className={`sticky z-[90] -mx-3 mb-3 grid grid-cols-2 items-center gap-2 border-b border-foreground/10 bg-white px-3 py-2 shadow-sm transition-[top] duration-300 dark:bg-[#0a0a0a] sm:-mx-6 sm:mb-4 sm:flex sm:flex-wrap sm:px-6 sm:py-3 ${
          navVisible ? "top-[76px] md:top-[88px]" : "top-0"
        }`}
      >
        <label className="relative col-span-2 min-w-0 sm:min-w-[200px] sm:flex-1">
          <Search
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40 sm:left-4"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the gallery…"
            aria-label="Search gallery"
            className="w-full rounded-full border border-foreground/15 bg-white py-2 pl-10 pr-3 text-[13px] sm:py-3 sm:pl-11 sm:pr-4 sm:text-sm text-foreground outline-none transition-colors placeholder:text-foreground/40 focus:border-brand dark:bg-[#16161a]"
          />
        </label>

        <CategorySelect
          value={category}
          onChange={setCategory}
          counts={{
            all: groups.length + cases.length,
            designs: groups.filter((g) => g.category === "designs").length + cases.length,
            social: groups.filter((g) => g.category === "social").length,
            banners: groups.filter((g) => g.category === "banners").length,
            appstore: groups.filter((g) => g.category === "appstore").length,
          }}
        />

        <button
          onClick={() => setOnlyLiked((v) => !v)}
          aria-pressed={onlyLiked}
          className={`inline-flex w-full items-center justify-center gap-1.5 rounded-full border px-3 py-2 text-[13px] font-semibold transition-colors sm:w-auto sm:gap-2 sm:px-5 sm:py-3 sm:text-sm ${
            onlyLiked
              ? "border-rose-500 bg-rose-500 text-white"
              : "border-foreground/15 bg-white text-foreground/70 hover:border-rose-500 hover:text-rose-500 dark:bg-[#16161a]"
          }`}
        >
          <Heart size={16} fill={onlyLiked ? "currentColor" : "none"} />
          Favorites{likedCount ? ` (${likedCount})` : ""}
        </button>
      </div>

      <p className="mb-3 px-1 text-xs text-foreground/45">{total} items</p>

      {/* Photo-app grid: tight, square tiles, one per design */}
      {total === 0 ? (
        <div className="py-24 text-center">
          <Heart className="mx-auto mb-4 text-foreground/20" size={40} />
          <p className="font-display text-2xl italic">Nothing here yet</p>
          <p className="mt-2 text-sm text-foreground/50">
            {onlyLiked
              ? "Heart a few designs and they will show up here."
              : "Try a different search or category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-flow-dense grid-cols-3 gap-1 sm:grid-cols-4 sm:gap-1.5 md:grid-cols-5 lg:grid-cols-6">
          {shownCases.map((c) => (
            <div key={c.id} className="relative">
            <Link
              href={c.href}
              className="group relative block aspect-square overflow-hidden rounded-xl bg-foreground/5 sm:rounded-2xl"
            >
              <Image
                src={c.image}
                alt={c.label}
                fill
                sizes="(max-width: 768px) 33vw, 17vw"
                className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              <span className="absolute left-1.5 top-1.5 max-w-[75%] truncate rounded-full bg-brand px-2 py-0.5 text-[10px] font-semibold text-white">
                {c.type}
              </span>
              <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 pr-11 pt-6 text-[11px] font-semibold leading-tight text-white">
                <span className="line-clamp-3">{c.label}</span>
              </span>
            </Link>
            <HeartButton ns="cases" id={c.id} className="absolute bottom-1.5 right-1.5 z-20" />
            </div>
          ))}

          {shownGroups.slice(0, visible).map((g, i) => {
            const liked = likes.has(g.id);
            // Every tile is a square. Tall mobile designs crop from the top; posts and
            // banners crop from the center. The full image is shown when opened.
            return (
              <div
                key={g.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-foreground/5 sm:rounded-2xl"
              >
                <button
                  onClick={() => setOpen({ g: i, v: 0 })}
                  aria-label={`Open ${g.label}`}
                  className="absolute inset-0"
                >
                  <Protected
                    src={g.items[0].thumb}
                    eager={i < 6}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                      g.category === "designs" || g.category === "appstore" ? "object-top" : "object-center"
                    }`}
                  />
                </button>
                <span className="pointer-events-none absolute left-1.5 top-1.5 z-20 max-w-[65%] truncate rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-black shadow-sm">
                  {g.type}
                </span>
                {g.items.length > 1 && (
                  <span className="pointer-events-none absolute right-1.5 top-1.5 z-20 inline-flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur">
                    <Layers size={11} /> {g.items.length}
                  </span>
                )}
                <span className="pointer-events-none absolute inset-x-0 bottom-0 z-[15] bg-gradient-to-t from-black/75 to-transparent p-2 pr-11 pt-8 text-[11px] font-semibold leading-tight text-white">
                  <span className="line-clamp-3">{g.label}</span>
                </span>
                <button
                  onClick={() => toggleLike(g.id)}
                  aria-label={liked ? "Remove from favorites" : "Add to favorites"}
                  aria-pressed={liked}
                  className="absolute bottom-1.5 right-1.5 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-black/45 text-white backdrop-blur transition-transform hover:scale-110 active:scale-90"
                >
                  <motion.span
                    key={String(liked)}
                    initial={{ scale: liked ? 0.5 : 1 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 12 }}
                    className="flex"
                  >
                    <Heart
                      size={16}
                      className={liked ? "text-rose-500" : ""}
                      fill={liked ? "currentColor" : "none"}
                    />
                  </motion.span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Next batch loads as you near the end of what is shown */}
      {visible < shownGroups.length && (
        <div
          ref={sentinelRef}
          className="flex items-center justify-center gap-2 py-10 text-xs text-foreground/40"
          aria-live="polite"
        >
          <span className="h-3 w-3 animate-spin rounded-full border-2 border-brand/30 border-t-brand" />
          Loading more…
        </div>
      )}

      {/* Full-screen viewer: swipe through a design's variants */}
      <AnimatePresence>
        {group && current && open && (
          <motion.div
            key="viewer"
            className="gallery-protect fixed inset-0 z-[200] flex flex-col bg-black/95 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onContextMenu={(e) => e.preventDefault()}
            role="dialog"
            aria-modal="true"
            aria-label={group.label}
          >
            <div className="flex items-center justify-between gap-3 px-4 py-3 text-white">
              <button
                onClick={() => toggleLike(group.id)}
                aria-label={likes.has(group.id) ? "Unlike" : "Like"}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <Heart
                  size={18}
                  className={likes.has(group.id) ? "text-rose-500" : ""}
                  fill={likes.has(group.id) ? "currentColor" : "none"}
                />
              </button>
              <div className="min-w-0 text-center">
                <p className="truncate text-sm font-semibold">{group.label}</p>
                <p className="text-[11px] text-white/50">
                  {CAT_LABEL[group.category]}
                  {group.items.length > 1 ? ` · ${open.v + 1} of ${group.items.length}` : ""}
                </p>
              </div>
              <button
                onClick={close}
                aria-label="Close"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 flex-col">
            <div
              className={`relative min-h-0 flex-1 px-3 no-scrollbar ${
                group.category === "designs"
                  ? "overflow-y-auto overflow-x-hidden pb-6"
                  : "overflow-hidden pb-2"
              }`}
              onClick={onPhotoTap}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={current.id}
                  drag={group.items.length > 1 ? "x" : false}
                  dragDirectionLock
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.35}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -70 || info.velocity.x < -500) stepVariant(1);
                    else if (info.offset.x > 70 || info.velocity.x > 500) stepVariant(-1);
                  }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.22 }}
                  className={`relative mx-auto ${group.category === "designs" ? "" : "h-full w-full"}`}
                  style={{
                    maxWidth:
                      group.category === "designs"
                        ? current.w > 800
                          ? 1100
                          : 460
                        : 1400,
                  }}
                >
                  {/* Posts and banners: fit the WHOLE image on screen. Designs: scroll tall screens. */}
                  <Protected
                    src={current.full}
                    className={
                      group.category === "designs"
                        ? "block h-auto w-full rounded-xl"
                        : "block h-full w-full rounded-xl object-contain"
                    }
                    eager
                  />
                </motion.div>
              </AnimatePresence>

            </div>

              {/* Big heart pops on double-tap, centered on the picture area */}
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

            {group.description && (
              <div className="mx-auto max-h-28 w-full max-w-2xl overflow-y-auto px-5 pb-2 pt-1 text-center no-scrollbar">
                <p className="text-xs leading-relaxed text-white/70 md:text-sm">
                  {group.description}
                </p>
              </div>
            )}

            {group.items.length > 1 && (
              <>
                <button
                  onClick={() => stepVariant(-1)}
                  aria-label="Previous variant"
                  className="absolute left-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 md:flex"
                >
                  <ChevronLeft />
                </button>
                <button
                  onClick={() => stepVariant(1)}
                  aria-label="Next variant"
                  className="absolute right-3 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/25 md:flex"
                >
                  <ChevronRight />
                </button>
                <div className="flex justify-center gap-2 overflow-x-auto px-4 pb-5 pt-2">
                  {group.items.map((it, n) => (
                    <button
                      key={it.id}
                      onClick={() => setOpen({ ...open, v: n })}
                      aria-label={`Variant ${n + 1}`}
                      className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                        n === open.v ? "border-brand opacity-100" : "border-transparent opacity-50 hover:opacity-80"
                      }`}
                    >
                      <Protected src={it.thumb} className="h-full w-full object-cover object-top" />
                    </button>
                  ))}
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
