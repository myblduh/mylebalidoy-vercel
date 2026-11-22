"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";
import MediaViewer, { type ViewerItem } from "@/components/media-viewer";

import certificationsData from "@/data/certifications.json";

interface Certification {
  title: string;
  image: string;
  description: string;
  issuer: string;
  date: string;
  skills: string[];
  links?: { text: string; url: string }[];
}

export default function Certifications() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const rail = useRef<HTMLDivElement>(null);
  const anim = useRef(0);

  const certifications: Certification[] = certificationsData;
  const viewerItems: ViewerItem[] = certifications.map((x) => ({
    id: x.title,
    title: x.title,
    subtitle: `${x.issuer} · ${x.date}`,
    image: x.image,
    description: x.description,
    tags: x.skills,
    links: x.links,
  }));

  const sync = () => {
    const el = rail.current;
    if (!el) return;
    // an unmeasured (zero-width) rail must never count as "at the end"
    const measured = el.scrollWidth > el.clientWidth + 8;
    setAtStart(!measured || el.scrollLeft < 8);
    setAtEnd(measured && el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
  };
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(el);
    Array.from(el.children).forEach((c) => ro.observe(c));
    return () => ro.disconnect();
  }, []);

  const nudge = (dir: 1 | -1) => {
    const el = rail.current;
    if (!el) return;
    const card = el.children[0] as HTMLElement | undefined;
    const step = (card?.offsetWidth ?? 360) + 24;
    const per = Math.max(1, Math.floor(el.clientWidth / step));
    const max = el.scrollWidth - el.clientWidth;
    const from = el.scrollLeft;
    const to = Math.max(0, Math.min(max, from + dir * step * per));
    if (to === from) return;
    cancelAnimationFrame(anim.current);
    el.style.scrollSnapType = "none"; // snapping is paused while we animate, then restored
    const start = performance.now();
    const DURATION = 650;
    const ease = (t: number) => 1 - Math.pow(1 - t, 4); // easeOutQuart: quick start, soft landing
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / DURATION);
      el.scrollLeft = from + (to - from) * ease(t);
      if (t < 1) anim.current = requestAnimationFrame(tick);
      else el.style.scrollSnapType = "";
    };
    anim.current = requestAnimationFrame(tick);
  };

  return (
    <section id="certifications" className="px-6 py-12 sm:py-16 md:px-12 md:py-24 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 md:mb-10">
          <div className="max-w-3xl">
            <Reveal>
              <Eyebrow n="06" label="Credentials" />
            </Reveal>
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl tracking-tighter text-foreground md:text-5xl">
              <WordReveal text="Certificates I've earned" highlight={["earned"]} />
            </h2>
            <p className="max-w-2xl text-xs leading-relaxed text-gray-500 dark:text-gray-400 md:text-sm">
              Swipe or use the arrows through {certifications.length} certificates. Tap one to see it up close.
            </p>
          </div>

          {/* Arrows (shown on phones too) */}
          <div className="flex gap-2">
            <button
              onClick={() => nudge(-1)}
              disabled={atStart}
              aria-label="Previous certificates"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 sm:h-12 sm:w-12 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowLeft size={18} />
            </button>
            <button
              onClick={() => nudge(1)}
              disabled={atEnd}
              aria-label="Next certificates"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15 sm:h-12 sm:w-12 transition-colors hover:border-brand hover:text-brand disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Swipeable rail of certificate previews (bleeds to the screen edge) */}
      <Reveal y={40}>
        <div
          ref={rail}
          onScroll={sync}
          onPointerDown={() => {
            cancelAnimationFrame(anim.current);
            if (rail.current) rail.current.style.scrollSnapType = "";
          }}
          onWheel={() => {
            cancelAnimationFrame(anim.current);
            if (rail.current) rail.current.style.scrollSnapType = "";
          }}
          className="no-scrollbar -mx-6 flex snap-x snap-mandatory -mt-6 gap-4 overflow-x-auto px-[max(1.5rem,calc((100vw-min(78vw,380px))/2))] sm:px-[max(1.5rem,calc((100vw-360px)/2))] pb-6 pt-8 md:-mx-12 md:scroll-pl-12 md:gap-6 md:px-12 lg:-mx-20 lg:scroll-pl-20 lg:px-20"
        >
          {certifications.map((cert, i) => (
            <button
              key={cert.title}
              type="button"
              onClick={() => setOpenIdx(i)}
              aria-label={`View certificate: ${cert.title}`}
              className="group flex w-[78vw] max-w-[380px] shrink-0 snap-center flex-col md:snap-start cursor-pointer text-left sm:w-[360px]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl border border-foreground/10 bg-white shadow-md transition-all duration-500 group-hover:-translate-y-1.5 group-hover:border-brand/60 group-hover:shadow-[0_28px_56px_-24px_rgba(139,92,246,0.45)] dark:bg-[#16161a]">
                <Image
                  src={cert.image}
                  alt={cert.title}
                  fill
                  sizes="(max-width: 640px) 78vw, 380px"
                  className="object-contain p-2"
                  draggable={false}
                />
              </div>
              <div className="mt-3 flex items-start justify-between gap-2 px-1 sm:mt-4 sm:gap-3">
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
                    {cert.issuer}
                  </p>
                  <h3 className="mt-1 line-clamp-2 text-[15px] sm:min-h-[2.75rem] sm:text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand">
                    {cert.title}
                  </h3>
                </div>
                <span className="shrink-0 whitespace-nowrap pt-0.5 text-right font-display text-sm italic sm:text-base text-brand">
                  {cert.date}
                </span>
              </div>
            </button>
          ))}
        </div>
      </Reveal>

      <MediaViewer
        items={viewerItems}
        index={openIdx}
        onIndex={setOpenIdx}
        onClose={() => setOpenIdx(null)}
        likeKey="certs"
      />
    </section>
  );
}
