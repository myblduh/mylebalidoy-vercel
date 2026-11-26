"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import {
  Briefcase,
  Download,
  ExternalLink,
  Github,
  Linkedin,
} from "lucide-react";
import Navbar from "@/components/navbar";
import ScrollToTop from "@/components/scroll-to-top";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";
import MediaViewer, { type ViewerItem } from "@/components/media-viewer";

import projectsData from "@/data/projects.json";
import designsData from "@/data/designs.json";
import certificationsData from "@/data/certifications.json";
import skillsData from "@/data/skills.json";
import aboutData from "@/data/about.json";

interface Job {
  role: string;
  org: string;
  type: string;
  period: string;
  logo?: string;
  bullets: string[];
}

const JOBS: Job[] = [
  {
    role: "Digital Designer",
    org: "Wovlo Studio",
    type: "Full-Time, Remote",
    period: "Sep. 2026 – Present",
    logo: "/assets/logos/wovlo.png",
    bullets: [
      "Direct brand identity systems and guidelines to ensure visual consistency across all digital platforms and campaign assets.",
      "Create responsive graphics, marketing collateral, and interactive visuals, collaborating directly with the development team.",
    ],
  },
  {
    role: "UI/UX Designer",
    org: "Blueshift Energy",
    type: "Full-Time, Hybrid",
    period: "July 2026 – Sep. 2026",
    logo: "/assets/logos/blueshift.png",
    bullets: [
      "Designed responsive commercial and residential solar landing pages with a focus on visual hierarchy.",
      "Built Figma variables, components, and interactions to maintain a scalable, consistent design system.",
    ],
  },
  {
    role: "UI/UX Designer Intern",
    org: "KMC Solutions",
    type: "Internship, Hybrid",
    period: "Jan. 2026 – May 2026",
    logo: "/assets/logos/kmc.png",
    bullets: [
      "Design responsive web and mobile interfaces, improving layout, usability, and overall user experience.",
      "Support end-to-end design processes, from concepts and user flow implementation to final prototypes.",
    ],
  },
  {
    role: "Data Entry & Design Assistant",
    org: "Improbable Labs",
    type: "Part-Time, Remote",
    period: "Sep. 2025 – Mar. 2026",
    bullets: [
      "Created app store preview assets and marketing visuals that improved app store visibility and boost user engagement.",
      "Researched competitor app listings and user search behavior to optimize discoverability and keyword placement.",
    ],
  },
];

const AWARD = {
  title: "1st Runner Up - Enterprise Track",
  date: "May 2026",
  org: "Protothon 2026: The Online UX Hackathon",
  image: "/assets/images/image3.png",
  text: "Designed Trackify, an enterprise inventory system featuring real-time tracking, barcode integration, and analytics. The design placed 2nd out of 35 teams in the Enterprise track.",
};

const LINKS = [
  { href: "https://www.linkedin.com/in/mylebalidoy/", label: "LinkedIn", Icon: Linkedin },
  { href: "https://github.com/myblduh", label: "GitHub", Icon: Github },
  { href: "https://www.behance.net/mylebalidoy", label: "Behance", Icon: ExternalLink },
];

/** Section heading: numbered eyebrow + serif-highlight title, same as the landing page. */
function Heading({ n, label, text, highlight }: { n: string; label: string; text: string; highlight: string[] }) {
  return (
    <div className="mb-5 md:mb-6">
      <Reveal>
        {/* just the number, in black: the title below already says what the section is */}
        <span className="mb-4 block font-display text-lg italic text-foreground md:text-xl">{n}</span>
      </Reveal>
      <h2 className="text-3xl font-bold leading-[1.05] tracking-tighter text-foreground md:text-5xl">
        <WordReveal text={text} highlight={highlight} />
      </h2>
    </div>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5 text-[13px] leading-relaxed text-foreground/60 md:space-y-2 md:text-[15px] md:text-foreground/65">
      {items.map((b) => (
        <li key={b} className="flex gap-2.5 md:gap-3">
          <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-brand md:h-1.5 md:w-1.5" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

/** Small rounded preview image; the parent button/link handles the click. */
function Thumb({ src, alt, size = "md" }: { src: string; alt: string; size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "h-20 w-20 md:h-24 md:w-24" : size === "sm" ? "h-12 w-12 md:h-14 md:w-14" : "h-16 w-16 md:h-20 md:w-20";
  return (
    <span className={`relative block shrink-0 overflow-hidden rounded-xl border border-foreground/10 ${dim}`}>
      <Image src={src} alt={alt} fill sizes="80px" className="object-cover transition-transform duration-500 group-hover:scale-110" draggable={false} />
    </span>
  );
}

type Shape = {
  kind: "glow" | "dot" | "ring";
  size: number;
  top: string;
  left?: string;
  right?: string;
  dx: number;
  dy: number;
  dur: number;
  opacity: number;
};

// Soft purple glows, small solid dots and thin rings, scattered down the whole page.
const SHAPES: Shape[] = [
  { kind: "glow", size: 760, top: "1%", right: "-18%", dx: -40, dy: 50, dur: 14, opacity: 0.2 },
  { kind: "glow", size: 520, top: "16%", left: "-22%", dx: 50, dy: -40, dur: 17, opacity: 0.2 },
  { kind: "glow", size: 640, top: "40%", right: "-26%", dx: -50, dy: 40, dur: 16, opacity: 0.2 },
  { kind: "glow", size: 560, top: "62%", left: "-24%", dx: 40, dy: 50, dur: 18, opacity: 0.2 },
  { kind: "glow", size: 600, top: "84%", right: "-20%", dx: -40, dy: -50, dur: 15, opacity: 0.22 },
];

/** Decorative drifting purple shapes behind the content. */
function FloatingShapes() {
  const reduce = useReducedMotion();
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {SHAPES.map((s, i) => {
        const style: React.CSSProperties = {
          top: s.top,
          left: s.left,
          right: s.right,
          width: s.size,
          height: s.size,
          opacity: s.opacity,
          ...(s.kind === "glow"
            ? { background: "radial-gradient(closest-side, rgba(139,92,246,0.9), transparent)" }
            : s.kind === "ring"
              ? { border: "1.5px solid rgba(139,92,246,0.9)" }
              : { background: "#8B5CF6" }),
        };
        return (
          <motion.span
            key={i}
            className="absolute rounded-full"
            style={style}
            animate={reduce ? undefined : { x: [0, s.dx, 0], y: [0, s.dy, 0] }}
            transition={{ duration: s.dur, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
          />
        );
      })}
    </div>
  );
}

const SECTIONS = [
  { id: "education", label: "Education" },
  { id: "resume-experience", label: "Experience" },
  { id: "resume-awards", label: "Awards" },
  { id: "resume-projects", label: "Projects" },
  { id: "resume-certifications", label: "Certifications" },
  { id: "resume-toolbox", label: "Toolbox" },
];

/** Side navigator (wide screens): a rail that fills as you scroll, with a stop per section. */
function SectionNav() {
  const [active, setActive] = useState<string>("");
  const { scrollYProgress } = useScroll();
  const progress = useTransform(scrollYProgress, (v) => (typeof window !== "undefined" && window.scrollY <= 0 ? 0 : v));
  const fill = useSpring(progress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    // The current section is the last one whose top has passed 40% of the screen;
    // at the very bottom of the page it is always the last section.
    const onScroll = () => {
      // scrollY > 200 guards the first paint, when the page hasn't grown to full height yet
      const atBottom =
        window.scrollY > 200 && window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 24;
      let current = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) current = s.id;
      }
      setActive(atBottom ? SECTIONS[SECTIONS.length - 1].id : current);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <nav aria-label="Resume sections" className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <div className="relative flex flex-col gap-5 py-1">
        <span className="absolute bottom-3 right-[5px] top-3 w-px bg-foreground/15" />
        <motion.span
          className="absolute right-[5px] top-3 w-px origin-top bg-brand"
          style={{ scaleY: fill, height: "calc(100% - 1.5rem)" }}
        />
        {SECTIONS.map((s, idx) => {
          const on = active === s.id;
          // every section already reached stays filled
          const reached = idx <= SECTIONS.findIndex((x) => x.id === active);
          return (
            <button
              key={s.id}
              type="button"
              onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: "smooth", block: "start" })}
              className="group relative flex items-center justify-end gap-3"
              aria-label={`Go to ${s.label}`}
              aria-current={on ? "true" : undefined}
            >
              <span
                className={`text-[13px] font-semibold transition-all duration-300 ${
                  "translate-x-1 rounded-full bg-background/90 px-2.5 py-1 text-foreground/70 opacity-0 shadow-sm backdrop-blur-sm group-hover:translate-x-0 group-hover:opacity-100"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`relative z-10 h-[11px] w-[11px] rounded-full border-2 transition-all duration-300 ${
                  on ? "scale-125 border-brand bg-brand" : reached ? "border-brand bg-brand" : "border-foreground/30 bg-background group-hover:border-brand"
                }`}
              />
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default function DigitalResumePage() {
  const [open, setOpen] = useState<number | null>(null);

  const featuredProjects = [
    designsData.find((p) => p.title.includes("Trackify")),
    designsData.find((p) => p.title.includes("Payonnect")),
    projectsData.find((p) => p.title.includes("Lakbay Calamba")),
    designsData.find((p) => p.title.includes("CosMarket")),
    projectsData.find((p) => p.title.includes("RFID-Based")),
    designsData.find((p) => p.title.includes("HealthMate")),
  ].filter(Boolean) as any[];
  // Resume shows the first few certificates, with Google Agile Essentials in place of AI Career Readiness.
  const certs = [
    ...certificationsData.filter((c) => !["AI Career Readiness Training", "Google Prompting Essentials", "Google Agile Essentials"].includes(c.title)).slice(0, 4),
    certificationsData.find((c) => c.title === "Google Prompting Essentials"),
    certificationsData.find((c) => c.title === "Google Agile Essentials"),
  ].filter(Boolean) as typeof certificationsData;

  // One shared viewer: the award first, then the projects, then the certificates.
  const viewerItems: ViewerItem[] = [
    { id: "award", title: AWARD.title, subtitle: AWARD.org, image: AWARD.image, description: AWARD.text },
    ...featuredProjects
      .filter((p) => p.image)
      .map((p) => ({ id: `p-${p.title}`, title: p.title, subtitle: p.date, image: p.image, description: p.description, tags: p.skills })),
    ...certs
      .filter((c) => c.image)
      .map((c) => ({ id: `c-${c.title}`, title: c.title, subtitle: `${c.issuer} · ${c.date}`, image: c.image, description: c.description })),
  ];
  const idxOf = (id: string) => viewerItems.findIndex((v) => v.id === id);

  // Always start at the top on refresh instead of restoring the old scroll position.
  useEffect(() => {
    const prev = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
    return () => {
      window.history.scrollRestoration = prev;
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <ScrollToTop />
      <SectionNav />

      {/* soft glow + dot grid, like the landing page canvas */}
      <FloatingShapes />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-12 md:pt-32 lg:px-20">
        {/* Header */}
        <header className="grid items-center gap-6 md:grid-cols-[1fr_auto] md:gap-14">
          <div className="order-2 text-center md:order-none md:text-left">
            <Reveal>
              <div className="flex justify-center md:justify-start">
                <Eyebrow n="00" label="Digital resume" />
              </div>
            </Reveal>
            <h1 className="text-5xl font-bold leading-[1.02] tracking-tighter md:text-7xl">
              <WordReveal text="Myle Balidoy" highlight={["Balidoy"]} />
            </h1>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-foreground/60 md:mx-0 md:mt-5 md:text-lg md:text-foreground/65">
                {aboutData.journey[0]}
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-6 flex justify-center md:mt-8 md:justify-start">
              <a
                href={aboutData.resumePath || "/assets/Myle_UXDesigner_Resume.pdf"}
                download
                className="pill-button !gap-2 !px-5 !py-2.5 !text-[13px] md:!px-7 md:!py-3 md:!text-sm"
              >
                Download Resume <Download size={14} />
              </a>
            </Reveal>
          </div>

          <Reveal scale={0.94} delay={0.15} className="order-1 mx-auto md:order-none">
            <div className="relative h-36 w-36 overflow-hidden rounded-[2rem] border border-foreground/10 shadow-xl md:h-60 md:w-60 md:shadow-2xl">
              <div className="absolute inset-0">
                <Image
                  src="/assets/images/image4.jpg"
                  alt="Myle Balidoy"
                  fill
                  sizes="(max-width: 768px) 176px, 240px"
                  priority
                  className="object-cover"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </Reveal>
        </header>

        {/* 01 Education: a single quiet block */}
        <section id="education" className="py-0 mt-16 scroll-mt-24 md:mt-24">
          <Heading n="01" label="Education" text="Education" highlight={["Education"]} />
          <Reveal y={20}>
            <h3 className="text-lg font-semibold leading-snug tracking-tight md:text-2xl">
              Bachelor of Science in Information Technology
            </h3>
            <p className="mt-1 text-[13px] text-foreground/55 md:text-base">National University - Laguna</p>
            <p className="mt-3 text-[13px] text-foreground/55 md:text-sm">
              <span className="font-display italic text-brand">2022 – 2026</span>
              <span className="mx-2 text-foreground/30">/</span>
              Web and Mobile Development
            </p>
          </Reveal>
        </section>

        {/* 02 Experience: stacked entries, period beside the role on desktop */}
        <section id="resume-experience" className="py-0 mt-16 scroll-mt-24 md:mt-24">
          <Heading n="02" label="Experience" text="Experience" highlight={["Experience"]} />
          <div className="space-y-9 md:space-y-12">
            {JOBS.map((j, i) => (
              <Reveal key={j.org} delay={Math.min(i, 4) * 0.05} y={20}>
                <div className="md:grid md:grid-cols-[170px_1fr] md:gap-6">
                  <p className="font-display text-base italic text-brand md:pt-1 md:text-lg">{j.period}</p>
                  <div className="mt-1 md:mt-0">
                    <div className="group flex items-center gap-3">
                      {j.logo ? (
                        <Thumb src={j.logo} alt={j.org} size="sm" />
                      ) : (
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-foreground/10 bg-foreground/[0.04] md:h-14 md:w-14">
                          <Briefcase className="h-5 w-5 text-brand md:h-6 md:w-6" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold leading-snug tracking-tight md:text-xl">{j.role}</h3>
                        <p className="mt-0.5 text-[13px] text-foreground/55 md:text-sm">
                          {j.org} <span className="text-foreground/30">·</span> {j.type}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Bullets items={j.bullets} />
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 03 Awards: one pulled-out statement */}
        <section id="resume-awards" className="py-0 mt-16 scroll-mt-24 md:mt-24">
          <Heading n="03" label="Awards" text="Awards" highlight={["Awards"]} />
          <Reveal y={20}>
            <button
              type="button"
              onClick={() => setOpen(idxOf("award"))}
              className="group flex items-center gap-4 text-left"
              aria-label={`View ${AWARD.title}`}
            >
              <Thumb src={AWARD.image} alt={AWARD.title} size="lg" />
              <span className="min-w-0">
                <span className="block font-display text-2xl italic leading-tight text-foreground transition-colors group-hover:text-brand md:text-4xl">
                  {AWARD.title}
                </span>
                <span className="mt-1.5 block text-[13px] text-foreground/55 md:text-sm">
                  {AWARD.org} <span className="text-foreground/30">·</span> {AWARD.date}
                </span>
              </span>
            </button>
            <p className="mt-3 max-w-2xl text-[13px] leading-relaxed text-foreground/60 md:text-[15px]">{AWARD.text}</p>
          </Reveal>
        </section>

        {/* 04 Featured Projects: plain text, two columns on desktop */}
        <section id="resume-projects" className="py-0 mt-16 scroll-mt-24 md:mt-24">
          <Heading n="04" label="Projects" text="Featured Projects" highlight={["Projects"]} />
          <div className="grid gap-x-12 gap-y-8 md:grid-cols-2 md:gap-y-10">
            {featuredProjects.map((p, i) => (
              <Reveal key={p.title} delay={Math.min(i, 4) * 0.05} y={20}>
                <button
                  type="button"
                  onClick={() => p.image && setOpen(idxOf(`p-${p.title}`))}
                  className="group flex w-full items-start gap-4 text-left"
                >
                  {p.image && <Thumb src={p.image} alt={p.title} />}
                  <span className="min-w-0">
                    <span className="block text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand md:text-lg">
                      {p.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-foreground/50 md:text-sm">
                      <span className="font-display italic text-brand">{p.date}</span>
                      {p.skills?.length ? <> <span className="text-foreground/30">/</span> {p.skills.slice(0, 3).join(" · ")}</> : null}
                    </span>
                    <span className="mt-2 line-clamp-3 block text-[13px] leading-relaxed text-foreground/60 md:text-sm">{p.description}</span>
                  </span>
                </button>
              </Reveal>
            ))}
          </div>
        </section>

        {/* 05 Certifications: one line each, title and date */}
        <section id="resume-certifications" className="py-0 mt-16 scroll-mt-24 md:mt-24">
          <Heading n="05" label="Certifications" text="Certifications" highlight={["Certifications"]} />
          <ul className="grid gap-x-12 gap-y-6 md:grid-cols-2">
            {certs.map((c, i) => (
              <Reveal as="li" key={c.title} delay={Math.min(i, 4) * 0.05} y={16}>
                <button
                  type="button"
                  onClick={() => c.image && setOpen(idxOf(`c-${c.title}`))}
                  className="group flex w-full items-center gap-4 text-left"
                >
                  {c.image && <Thumb src={c.image} alt={c.title} size="sm" />}
                  <span className="min-w-0 flex-1">
                    <span className="block text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-brand md:text-base">
                      {c.title}
                    </span>
                    <span className="mt-0.5 block text-[13px] text-foreground/50 md:text-sm">{c.issuer}</span>
                  </span>
                  <span className="shrink-0 self-start font-display text-sm italic text-brand md:self-center md:text-sm">{c.date}</span>
                </button>
              </Reveal>
            ))}
          </ul>
        </section>

        {/* 06 Technical Toolbox: label, then skills as plain text */}
        <section id="resume-toolbox" className="py-0 mt-16 scroll-mt-24 md:mt-24">
          <Heading n="06" label="Toolkit" text="Technical Toolbox" highlight={["Toolbox"]} />
          <dl className="space-y-6">
            {skillsData.map((category, i) => (
              <Reveal key={category.title} delay={i * 0.05} y={16}>
                <div className="md:grid md:grid-cols-[170px_1fr] md:gap-6">
                  <dt className="font-display text-xl italic text-brand md:text-2xl">{category.title}</dt>
                  <dd className="mt-1 text-[13px] leading-relaxed text-foreground/60 md:mt-0 md:text-[15px]">
                    {category.skills.join(" · ")}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </section>

        {/* Links */}
        <Reveal className="mt-8 flex flex-col items-stretch justify-center gap-3 border-t border-foreground/10 pt-8 md:flex-row md:items-center">
          {LINKS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-2 rounded-full border border-foreground/15 px-5 py-2.5 text-[13px] font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              <Icon className="h-4 w-4 text-brand transition-transform group-hover:scale-110" />
              {label}
            </a>
          ))}
        </Reveal>
      </div>

      <MediaViewer
        items={viewerItems}
        index={open !== null && open >= 0 ? open : null}
        onIndex={setOpen}
        onClose={() => setOpen(null)}
        likeKey="resume"
      />
    </main>
  );
}
