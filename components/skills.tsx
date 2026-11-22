"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import skillsData from "@/data/skills.json";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";

const iconMap: Record<string, string> = {
  Terminal: "/assets/icons/frontend_icon.png",
  Cpu: "/assets/icons/backend_icon.png",
  Palette: "/assets/icons/design_icon.png",
};

// Design leads: it is the main skill set. Frontend next, then backend.
const ORDER = ["Palette", "Terminal", "Cpu"];

const blurbs: Record<string, string> = {
  Palette: "Where I spend most of my time: interfaces, systems and visuals.",
  Terminal: "Enough frontend to build what I design.",
  Cpu: "Projects and coursework behind the scenes.",
};

export default function Skills() {
  const groups = [...skillsData]
    .sort((a, b) => ORDER.indexOf(a.icon) - ORDER.indexOf(b.icon))
    .map((g) => ({ ...g, iconSrc: iconMap[g.icon] || iconMap.Cpu, blurb: blurbs[g.icon] ?? "" }));
  const [active, setActive] = useState(0);
  const cur = groups[active];

  return (
    <section id="skills" className="px-6 py-10 sm:py-12 md:px-12 md:py-16 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 max-w-3xl md:mb-7">
          <Reveal>
            <Eyebrow n="05" label="Toolkit" />
          </Reveal>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl tracking-tighter text-foreground md:text-5xl">
            <WordReveal text="Skills & Tools" highlight={["Tools"]} />
          </h2>
        </div>

        <Reveal y={40}>
          {/* Tab bar: pill tabs, the selected one is filled. Scrolls sideways on small phones. */}
          <div
            role="tablist"
            aria-label="Skill categories"
            className="mb-4 flex flex-wrap justify-start gap-2"
          >
            {groups.map((g, i) => {
              const on = i === active;
              return (
                <button
                  key={g.title}
                  id={`skill-tab-${i}`}
                  role="tab"
                  aria-selected={on}
                  aria-controls="skill-panel"
                  onClick={() => setActive(i)}
                  className={`cursor-pointer whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all duration-300 sm:px-4 sm:py-2 sm:text-[13px] md:px-5 md:py-2 md:text-sm ${
                    on
                      ? "border-brand bg-brand text-white shadow-lg shadow-brand/30"
                      : "border-foreground/15 bg-white text-foreground/70 hover:border-brand/60 hover:text-brand dark:bg-[#16161a]"
                  }`}
                >
                  {g.title}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div
            id="skill-panel"
            role="tabpanel"
            aria-labelledby={`skill-tab-${active}`}
            className="relative overflow-hidden rounded-3xl border border-brand/40 bg-white p-4 dark:bg-[#16161a] sm:p-6 md:p-7"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={cur.title}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.28 }}
              >
                <div className="flex items-start justify-between gap-4 sm:gap-6">
                  <div className="min-w-0">
                    <h3 className="font-display text-2xl italic leading-tight text-brand sm:text-3xl">
                      {cur.title}
                    </h3>
                    <p className="mt-1 max-w-md text-xs leading-relaxed text-foreground/60 sm:text-sm">
                      {cur.blurb}
                    </p>
                  </div>
                  <span className="relative h-10 w-10 shrink-0 sm:h-12 sm:w-12 md:h-14 md:w-14">
                    <Image
                      src={cur.iconSrc}
                      alt=""
                      fill
                      sizes="96px"
                      className="object-contain drop-shadow-lg"
                      draggable={false}
                    />
                  </span>
                </div>

                <ul className="mt-4 flex flex-wrap gap-2 sm:mt-5">
                  {cur.skills.map((skill, k) => (
                    <motion.li
                      key={skill}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.05 + k * 0.04, duration: 0.3 }}
                      className="tag-purple tag-purple-hover rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors sm:text-[13px] md:px-4 md:text-sm"
                    >
                      {skill}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
