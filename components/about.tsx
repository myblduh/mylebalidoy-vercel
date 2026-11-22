"use client";
import { useState } from "react";
import Image from "next/image";
import { Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";
import MediaViewer, { type ViewerItem } from "@/components/media-viewer";
import PhotoStack from "@/components/photo-stack";
import aboutData from "@/data/about.json";

const companies: { name: string; role: string; period: string; logo?: string }[] = [
  {
    name: "Wovlo Studio",
    role: "Digital Designer",
    period: "Sep. 2026 – Present",
    logo: "/assets/logos/wovlo.png",
  },
  {
    name: "Blueshift Energy",
    role: "UI/UX Designer",
    period: "July 2026 – Sep. 2026",
    logo: "/assets/logos/blueshift.png",
  },
  {
    name: "KMC Solutions",
    role: "UI/UX Designer Intern",
    period: "Jan. 2026 – May 2026",
    logo: "/assets/logos/kmc.png",
  },
  {
    // no logo, so the row shows a suitcase
    name: "Improbable Labs",
    role: "Data Entry & Design Assistant",
    period: "Sep. 2025 – Mar. 2026",
  },
];

const badges = [
  { name: "Google Agile Essentials", image: "/assets/certs/badge1.png" },
  { name: "Google Prompting Essentials", image: "/assets/certs/badge2.png" },
  { name: "Canva Graphic Design Essentials", image: "/assets/certs/badge6.png" },
  { name: "Microsoft UX Design", image: "/assets/certs/badge3.png" },
  { name: "IBM UX Design Fundamentals", image: "/assets/certs/badge5.png" },
];

// The big figure shown for each fact (the wording underneath comes from data/about.json)
const factFigure: Record<string, string> = {
  Education: "BSIT",
  Awardee: "1st",
  Projects: "10+",
  Experience: "1 yr",
};

const awardItem: ViewerItem = {
  id: "award",
  title: "1st Runner Up · Enterprise Track",
  subtitle: "Protothon 2026: The Online UX Hackathon",
  image: "/assets/awards/award_00.png",
};

const stripHtml = (s: string) => s.replace(/<br\s*\/?>/gi, " · ");

export default function About() {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [awardOpen, setAwardOpen] = useState<number | null>(null);

  // "Hello, I'm Myle! I'm a UI/UX Designer who likes to ... I'm a BS ... interfaces."
  const sentences = aboutData.journey[0].split(/(?<=[.!])\s+/);
  const greeting = sentences[0];
  const statement = sentences[1] ?? "";
  const body = sentences.slice(2).join(" ");

  return (
    <section
      id="about"
      className="relative overflow-x-clip px-6 py-12 sm:py-16 md:px-12 md:py-24 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-5 max-w-3xl md:mb-6">
          <Reveal>
            <Eyebrow n="04" label="Background" />
          </Reveal>
          <h2 className="mb-4 text-2xl font-bold sm:text-3xl tracking-tighter text-foreground md:text-5xl">
            <WordReveal text="About Me" highlight={["Me"]} />
          </h2>
        </div>

        {/* Row 1: statement, badges, polaroid */}
        <div className="grid items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal>
              <p className="mb-5 text-sm font-semibold uppercase tracking-[0.2em] text-brand">
                {greeting}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <p className="font-display text-3xl leading-[1.15] text-foreground sm:text-4xl md:text-5xl">
                {statement}
              </p>
            </Reveal>
            {body && (
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-xl text-[13px] leading-relaxed text-foreground/60 sm:text-sm md:text-base">
                  {body}
                </p>
              </Reveal>
            )}

            {/* Certification badges: their own row, away from the photo */}
            <Reveal delay={0.22}>
              <div className="mt-8 text-center lg:text-left">
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/45">
                  Certified in
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 lg:justify-start">
                  {badges.map((b) => (
                    <motion.div
                      key={b.name}
                      whileHover={{ y: -4, scale: 1.12, rotate: -4 }}
                      transition={{ type: "spring", stiffness: 320, damping: 18 }}
                      onMouseEnter={() => setHoveredBadge(b.name)}
                      onMouseLeave={() => setHoveredBadge(null)}
                      className="relative flex h-14 w-14 cursor-default sm:h-16 sm:w-16 select-none items-center justify-center"
                    >
                      <Image
                        src="/assets/bubble.webp"
                        alt=""
                        fill
                        sizes="64px"
                        className="object-contain drop-shadow-md"
                        draggable={false}
                      />
                      <div className="relative z-10 h-[55%] w-[55%]">
                        <Image
                          src={b.image}
                          alt={b.name}
                          fill
                          sizes="36px"
                          className="object-contain"
                          draggable={false}
                        />
                      </div>
                      <AnimatePresence>
                        {hoveredBadge === b.name && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.85, y: 4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.85, y: 4 }}
                            transition={{ duration: 0.15 }}
                            className="pointer-events-none absolute bottom-full z-[100] mb-2 whitespace-nowrap rounded-md border border-white/10 bg-black/90 px-2.5 py-1 text-[10px] font-semibold tracking-tight text-white shadow-xl dark:bg-white/95 dark:text-black"
                          >
                            {b.name}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal className="lg:col-span-5" scale={0.94} delay={0.1}>
            <PhotoStack />
          </Reveal>
        </div>

        {/* Row 2: experience ledger (full width) */}
        <div className="mt-10 md:mt-14">
          <Reveal>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/45">
              Design experience
            </p>
          </Reveal>
          <ul className="border-t border-foreground/15">
            {companies.map((c, i) => (
              <Reveal as="li" key={c.name} delay={i * 0.08} y={30}>
                <div className="group grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-0.5 border-b border-foreground/15 py-4 transition-colors sm:gap-x-6 sm:py-6 duration-300 hover:bg-foreground/[0.03] md:grid-cols-[minmax(180px,0.8fr)_1.6fr_auto] md:gap-x-10 md:px-3 md:py-8">
                  <p className="order-2 col-span-2 font-display text-lg italic text-brand sm:text-2xl md:order-none md:col-span-1 md:text-3xl">
                    {c.period}
                  </p>
                  <div className="order-1 min-w-0 md:order-none">
                    <h3 className="flex flex-wrap items-center gap-2 text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand sm:text-xl md:text-2xl">
                      {c.name}
                    </h3>
                    <p className="mt-0.5 text-xs text-foreground/60 sm:text-sm">{c.role}</p>
                  </div>
                  <span className="relative order-1 h-10 w-10 shrink-0 sm:h-12 sm:w-12 overflow-hidden rounded-2xl border border-foreground/10 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 md:order-none md:h-14 md:w-14">
                    {c.logo ? (
                      <Image
                        src={c.logo}
                        alt={c.name}
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center bg-brand/10 text-brand">
                        <Briefcase size={22} aria-hidden />
                      </span>
                    )}
                  </span>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>

        {/* Row 3: key facts as one band of big figures */}
        <Reveal className="mt-14 md:mt-20" y={40}>
          <dl className="grid grid-cols-2 overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/[0.03] sm:rounded-[32px] lg:grid-cols-4">
            {aboutData.cards.map((card, i) => {
              const isAward = card.icon === "Trophy";
              const Cell = isAward ? "button" : "div";
              return (
                <Cell
                  key={card.title}
                  {...(isAward
                    ? { type: "button" as const, onClick: () => setAwardOpen(0) }
                    : {})}
                  className={`group flex flex-col items-start p-4 text-left transition-colors sm:p-8 ${
                    i % 2 === 1 ? "border-l border-foreground/10" : ""
                  } ${i >= 2 ? "border-t border-foreground/10 lg:border-t-0" : ""} ${
                    i > 0 ? "lg:border-l lg:border-foreground/10" : ""
                  } ${isAward ? "cursor-pointer hover:bg-amber-500/10" : ""}`}
                >
                  <dt className="text-[10px] font-semibold uppercase tracking-[0.2em] text-foreground/45 sm:text-[11px]">
                    {card.title}
                  </dt>
                  <dd className="mt-2 sm:mt-3">
                    <span
                      className={`block font-display text-3xl leading-none sm:text-6xl ${
                        isAward ? "text-amber-500" : "text-brand"
                      }`}
                    >
                      {factFigure[card.title] ?? card.subtitle}
                    </span>
                    <span className="mt-2 block text-xs font-semibold leading-snug text-foreground sm:mt-4 sm:text-sm">
                      {card.subtitle}
                    </span>
                    <span className="mt-1 block text-[11px] leading-relaxed text-foreground/55 sm:text-[13px]">
                      {stripHtml(card.details)}
                    </span>
                    {isAward && (
                      <span className="mt-3 block text-xs font-semibold text-amber-600 transition-transform group-hover:translate-x-1 dark:text-amber-400">
                        View award →
                      </span>
                    )}
                  </dd>
                </Cell>
              );
            })}
          </dl>
        </Reveal>
      </div>

      <MediaViewer
        items={[awardItem]}
        index={awardOpen}
        onIndex={setAwardOpen}
        onClose={() => setAwardOpen(null)}
        likeKey="award"
      />
    </section>
  );
}
