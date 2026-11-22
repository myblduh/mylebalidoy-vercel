"use client";

import Image from "next/image";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";

const STEPS = [
  {
    id: 1,
    name: "Empathize",
    image: "/assets/icons/empathize_icon.png",
    note: "I understand the people behind the screen.",
  },
  {
    id: 2,
    name: "Define",
    image: "/assets/icons/backend_icon.png",
    note: "I turn human needs into clear problems.",
  },
  {
    id: 3,
    name: "Ideate",
    image: "/assets/icons/ideate_icon.png",
    note: "I explore ideas that benefit people.",
  },
  {
    id: 4,
    name: "Prototype",
    image: "/assets/icons/design_icon.png",
    note: "I build interfaces that will help them navigate.",
  },
  {
    id: 5,
    name: "Test",
    image: "/assets/icons/projects_icon.png",
    note: "I refine based on how people experience the design.",
  },
];

/**
 * My design flow: the five design-thinking steps, as its own section right below the
 * hero. It is intentionally not part of the navigation.
 */
export default function DesignFlow() {
  return (
    <section
      id="process"
      className="relative px-6 py-12 md:px-12 md:py-24 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-8 max-w-4xl text-center md:mb-16">
          <Reveal>
            <div className="flex justify-center">
              <Eyebrow n="00" label="How I work" />
            </div>
          </Reveal>
          <h2 className="text-2xl font-bold leading-[1.1] sm:text-3xl tracking-tighter md:text-5xl">
            <WordReveal text="My design flow" highlight={["flow"]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="mt-4 text-[13px] leading-relaxed sm:text-sm text-foreground/60 md:text-base lg:whitespace-nowrap">
              Five steps I come back to on every project, from understanding
              people to refining what I build.
            </p>
          </Reveal>
        </div>

        <ol className="relative grid gap-3 md:grid-cols-5 md:gap-5">
          {STEPS.map((s, i) => (
            <Reveal as="li" key={s.id} delay={i * 0.08} y={36}>
              <div className="group relative flex h-full flex-row items-center gap-4 rounded-2xl border border-foreground/10 bg-white p-4 text-left shadow-sm transition-all duration-500 hover:border-brand/60 hover:shadow-[0_24px_48px_-20px_rgba(139,92,246,0.35)] dark:bg-[#1e1640] md:flex-col md:gap-0 md:rounded-3xl md:p-6 md:text-center md:hover:-translate-y-2">
                <div className="relative h-14 w-14 shrink-0 transition-transform md:mb-4 md:h-20 md:w-20 duration-500 group-hover:rotate-6 group-hover:scale-110">
                  <Image
                    src={s.image}
                    alt={s.name}
                    fill
                    sizes="96px"
                    className="object-contain drop-shadow-md"
                    draggable={false}
                  />
                  <span className="absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 text-[10px] md:h-6 md:w-6 md:text-[11px] font-bold text-white shadow-lg dark:border-[#1e1640]">
                    {s.id}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-brand md:text-lg">
                    {s.name}
                  </h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-foreground/60 md:mt-2 md:text-[13px]">
                    {s.note}
                  </p>
                </div>
                {/* Design-frame selection outline + handles on hover, same as the hero previews */}
                <span className="pointer-events-none absolute inset-0 -m-px rounded-2xl border border-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100 md:rounded-3xl" />
                {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => (
                  <span
                    key={p}
                    className={`pointer-events-none absolute ${p} hidden h-2 w-2 border-[1.5px] border-brand bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 sm:block`}
                  />
                ))}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
