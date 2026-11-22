"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useSpring } from "framer-motion";
import {
  ArrowUp,
  Briefcase,
  Download,
  ExternalLink,
  GraduationCap,
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
        <span className="mb-4 block font-display text-lg italic text-foreground">{n}</span>
      </Reveal>
      <h2 className="text-3xl font-bold leading-[1.05] tracking-tighter text-foreground md:text-5xl">
        <WordReveal text={text} highlight={highlight} />
      </h2>
    </div>
  );
}

/** One ledger row: period on the left, details in the middle, a thumbnail on the right. */
function Row({
  i,
  period,
  title,
  meta,
  children,
  thumb,
}: {
  i: number;
  period: string;
  title: string;
  meta?: React.ReactNode;
  children: React.ReactNode;
  thumb?: React.ReactNode;
}) {
  return (
    <Reveal as="li" delay={Math.min(i, 4) * 0.06} y={30}>
      <div className="group grid grid-cols-[1fr_auto] gap-x-5 gap-y-3 border-b border-foreground/15 py-6 transition-colors duration-300 hover:bg-foreground/[0.03] md:grid-cols-[minmax(170px,0.7fr)_1.8fr_auto] md:gap-x-10 md:px-3 md:py-8">
        <p className="order-2 col-span-2 font-display text-xl italic text-brand md:order-none md:col-span-1 md:text-2xl">
          {period}
        </p>
        <div className="order-1 min-w-0 md:order-none">
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-brand md:text-2xl">
            {title}
          </h3>
          {meta && <div className="mt-1 text-sm text-foreground/60">{meta}</div>}
          <div className="mt-4">{children}</div>
        </div>
        <div className="order-1 md:order-none">{thumb}</div>
      </div>
    </Reveal>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-foreground/65 md:text-[15px]">
      {items.map((b) => (
        <li key={b} className="flex gap-3">
          <span className="mt-[0.65em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}

function Thumb({ src, alt, onClick }: { src: string; alt: string; onClick?: () => void }) {
  const inner = (
    <Image src={src} alt={alt} fill sizes="64px" className="object-cover" draggable={false} />
  );
  const cls =
    "relative block h-12 w-12 shrink-0 overflow-hidden rounded-2xl border border-foreground/10 transition-transform duration-500 group-hover:rotate-3 group-hover:scale-110 md:h-16 md:w-16";
  return onClick ? (
    <button type="button" onClick={onClick} aria-label={`View ${alt}`} className={`${cls} cursor-pointer`}>
      {inner}
    </button>
  ) : (
    <span className={cls}>{inner}</span>
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
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 28, restDelta: 0.001 });

  useEffect(() => {
    const els = SECTIONS.map((s) => document.getElementById(s.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        // the section crossing the upper third of the screen is the current one
        entries.forEach((e) => e.isIntersecting && setActive(e.target.id));
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
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
                className={`text-xs font-semibold transition-all duration-300 ${
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
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [open, setOpen] = useState<number | null>(null);

  const featuredProjects = [
    designsData.find((p) => p.title.includes("Trackify")),
    designsData.find((p) => p.title.includes("Payonnect")),
    projectsData.find((p) => p.title.includes("Lakbay Calamba")),
    designsData.find((p) => p.title.includes("CosMarket")),
    projectsData.find((p) => p.title.includes("RFID-Based")),
    designsData.find((p) => p.title.includes("HealthMate")),
  ].filter(Boolean) as any[];
  const certs = certificationsData.slice(0, 5);

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

  useEffect(() => {
    const onScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <Navbar />
      <ScrollToTop />
      <SectionNav />

      {/* soft glow + dot grid, like the landing page canvas */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[2%] -z-0 h-[760px] w-[760px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.16), transparent)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-16 pt-28 md:px-12 md:pt-32 lg:px-20">
        {/* Header */}
        <header className="grid items-center gap-10 md:grid-cols-[1fr_auto] md:gap-14">
          <div className="text-center md:text-left">
            <Reveal>
              <div className="flex justify-center md:justify-start">
                <Eyebrow n="00" label="Digital resume" />
              </div>
            </Reveal>
            <h1 className="text-5xl font-bold leading-[1.02] tracking-tighter md:text-7xl">
              <WordReveal text="Myle Balidoy" highlight={["Balidoy"]} />
            </h1>
            <Reveal delay={0.1}>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-relaxed text-foreground/65 md:mx-0 md:text-lg">
                {aboutData.journey[0]}
              </p>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex justify-center md:justify-start">
              <a
                href={aboutData.resumePath || "/assets/Myle_UXDesigner_Resume.pdf"}
                download
                className="pill-button gap-2 px-8 py-4"
              >
                Download Resume <Download size={16} />
              </a>
            </Reveal>
          </div>

          <Reveal scale={0.94} delay={0.15} className="mx-auto">
            <div className="relative h-44 w-44 overflow-hidden rounded-[2rem] border border-foreground/10 shadow-2xl md:h-60 md:w-60">
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

        {/* 01 Education */}
        <section id="education" className="py-0 mt-8 scroll-mt-24 md:mt-12">
          <Heading n="01" label="Education" text="Education" highlight={["Education"]} />
          <Reveal y={30}>
            <div className="group grid overflow-hidden rounded-3xl border border-foreground/10 md:grid-cols-[minmax(200px,0.55fr)_1.7fr]">
              {/* Left: the years, big, on a purple panel */}
              <div className="relative flex flex-col justify-between gap-5 overflow-hidden bg-gradient-to-br from-[#8B5CF6] via-[#6d3fe0] to-[#3b1a8f] p-5 text-white md:p-6">
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-40"
                  style={{ background: "radial-gradient(closest-side, rgba(255,255,255,0.55), transparent)" }}
                />
                <div className="relative h-12 w-12 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 md:h-14 md:w-14">
                  <Image
                    src="/assets/icons/education_icon.png"
                    alt="Education"
                    fill
                    sizes="80px"
                    className="object-contain drop-shadow-xl"
                    draggable={false}
                  />
                </div>
                <p className="relative font-display text-4xl italic leading-none md:text-5xl">
                  2022 – 2026
                </p>
              </div>

              {/* Right: degree, school and track */}
              <div className="flex flex-col justify-between gap-5 bg-foreground/[0.03] p-5 md:p-6">
                <div>
                  <h3 className="text-xl font-bold leading-tight tracking-tight md:text-2xl">
                    Bachelor of Science in Information Technology
                  </h3>
                  <p className="mt-1.5 text-sm font-medium text-foreground/65 md:text-base">
                    National University - Laguna
                  </p>
                </div>
                <div className="tag-purple flex items-center gap-3 rounded-2xl p-3 md:p-4">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand text-white shadow-lg shadow-brand/30">
                    <GraduationCap className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] opacity-70">
                      Specialization Track
                    </p>
                    <p className="mt-0.5 text-sm font-bold tracking-tight md:text-base">
                      Web and Mobile Development
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* 02 Experience */}
        <section id="resume-experience" className="py-0 mt-8 scroll-mt-24 md:mt-12">
          <Heading n="02" label="Experience" text="Experience" highlight={["Experience"]} />
          <ul className="border-t border-foreground/15">
            {JOBS.map((j, i) => (
              <Row
                key={j.org}
                i={i}
                period={j.period}
                title={j.role}
                meta={
                  <>
                    {j.org} <span className="text-foreground/40">·</span> {j.type}
                  </>
                }
                thumb={
                  j.logo ? (
                    <Thumb src={j.logo} alt={`${j.role} at ${j.org}`} />
                  ) : (
                    <span className="tag-purple flex h-12 w-12 items-center justify-center rounded-2xl md:h-16 md:w-16">
                      <Briefcase className="h-5 w-5 md:h-7 md:w-7" />
                    </span>
                  )
                }
              >
                <Bullets items={j.bullets} />
              </Row>
            ))}
          </ul>
        </section>

        {/* 03 Awards */}
        <section id="resume-awards" className="py-0 mt-8 scroll-mt-24 md:mt-12">
          <Heading n="03" label="Awards" text="Awards" highlight={["Awards"]} />
          <ul className="border-t border-foreground/15">
            <Row
              i={0}
              period={AWARD.date}
              title={AWARD.title}
              meta={AWARD.org}
              thumb={<Thumb src={AWARD.image} alt={AWARD.title} onClick={() => setOpen(idxOf("award"))} />}
            >
              <Bullets items={[AWARD.text]} />
            </Row>
          </ul>
        </section>

        {/* 04 Featured Projects */}
        <section id="resume-projects" className="py-0 mt-8 scroll-mt-24 md:mt-12">
          <Heading n="04" label="Projects" text="Featured Projects" highlight={["Projects"]} />
          <ul className="border-t border-foreground/15">
            {featuredProjects.map((p, i) => (
              <Row
                key={p.title}
                i={i}
                period={p.date ?? ""}
                title={p.title}
                meta={
                  p.skills?.length ? (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {p.skills.slice(0, 3).map((s: string) => (
                        <span key={s} className="tag-purple rounded-full px-2.5 py-0.5 text-[11px] font-medium">
                          {s}
                        </span>
                      ))}
                    </span>
                  ) : null
                }
                thumb={
                  p.image ? (
                    <Thumb src={p.image} alt={p.title} onClick={() => setOpen(idxOf(`p-${p.title}`))} />
                  ) : null
                }
              >
                <Bullets items={[p.description]} />
              </Row>
            ))}
          </ul>
        </section>

        {/* 05 Certifications */}
        <section id="resume-certifications" className="py-0 mt-8 scroll-mt-24 md:mt-12">
          <Heading n="05" label="Certifications" text="Certifications" highlight={["Certifications"]} />
          <ul className="border-t border-foreground/15">
            {certs.map((c, i) => (
              <Row
                key={c.title}
                i={i}
                period={c.date}
                title={c.title}
                meta={c.issuer}
                thumb={
                  c.image ? (
                    <Thumb src={c.image} alt={c.title} onClick={() => setOpen(idxOf(`c-${c.title}`))} />
                  ) : null
                }
              >
                <Bullets items={[c.description]} />
              </Row>
            ))}
          </ul>
        </section>

        {/* 06 Technical Toolbox */}
        <section id="resume-toolbox" className="py-0 mt-8 scroll-mt-24 md:mt-12">
          <Heading n="06" label="Toolkit" text="Technical Toolbox" highlight={["Toolbox"]} />
          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {skillsData.map((category, i) => (
              <Reveal key={category.title} delay={i * 0.08} y={30}>
                <div className="h-full rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6">
                  <h3 className="font-display text-2xl italic text-brand">{category.title}</h3>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className="tag-purple rounded-full px-3.5 py-1.5 text-xs font-semibold sm:text-[13px]">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Links */}
        <Reveal className="mt-8 flex flex-col items-stretch justify-center gap-3 border-t border-foreground/10 pt-8 md:mt-10 md:flex-row md:items-center">
          {LINKS.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center justify-center gap-3 rounded-full border border-foreground/15 px-8 py-4 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              <Icon className="h-5 w-5 text-brand transition-transform group-hover:scale-110" />
              {label}
            </a>
          ))}
        </Reveal>
      </div>

      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-[60] flex h-12 w-12 items-center justify-center rounded-full border border-foreground/15 bg-background/80 shadow-lg backdrop-blur-md transition-colors hover:border-brand hover:text-brand"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

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
