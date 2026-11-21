"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";
import { designs, splitTitle } from "@/lib/designs";

export default function Designs() {
  return (
    <section
      id="designs"
      className="py-12 sm:py-16 md:py-24 px-6 md:px-12 lg:px-20 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <Reveal>
            <Eyebrow n="01" label="Selected work" />
          </Reveal>
          <h2 className="text-3xl md:text-6xl font-bold tracking-tighter text-foreground mb-5 leading-[1.05]">
            <WordReveal text="Case studies in user-centric design" highlight={["user-centric"]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Each project opens into a full write-up: the problem, the
              overview, the thinking behind the screens, and a prototype you
              can try.
            </p>
          </Reveal>
        </div>

        {/* Equal cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-8 lg:gap-10">
          {designs.map((design, i) => (
            <Reveal key={design.slug} delay={(i % 3) * 0.08} y={60} className="h-full">
              <DesignCard design={design} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function DesignCard({
  design,
}: {
  design: (typeof designs)[number];
}) {
  const name = splitTitle(design.title).name; // used for image alt text only

  return (
    <div className="relative h-full">
    <Link
      href={`/designs/${design.slug}`}
      className="project-card group flex h-full flex-col transition-transform duration-500 hover:-translate-y-2"
    >
      <div className="relative aspect-[16/9] w-full flex-shrink-0 md:aspect-[16/10] overflow-hidden">
        <Image
          src={design.image}
          alt={name}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          draggable={false}
        />
      </div>

      <div className="flex flex-1 flex-col p-5 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <h3 className="text-base md:text-xl lg:text-2xl font-bold leading-tight tracking-tight transition-colors duration-300 group-hover:text-brand">
          {design.title}
        </h3>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full md:h-11 md:w-11 border border-foreground/15 transition-all duration-300 group-hover:bg-brand group-hover:text-white group-hover:border-brand">
            <ArrowUpRight className="h-4 w-4 md:h-5 md:w-5 transition-transform duration-300 group-hover:rotate-12" />
          </span>
        </div>
        <p className="mt-1.5 text-xs font-semibold text-brand/90 md:mt-2">{design.date}</p>

        <p className="mt-3 line-clamp-2 text-gray-500 dark:text-gray-400 text-[13px] leading-relaxed md:mt-4 md:line-clamp-3 md:text-sm">
          {design.description}
        </p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-4 md:gap-2 md:pt-6">
          {design.award && (
            <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-300">
              🏆 {design.award}
            </span>
          )}
          {design.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="tag-purple rounded-full px-3 py-1 text-[11px] font-medium"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </Link>
    </div>
  );
}
