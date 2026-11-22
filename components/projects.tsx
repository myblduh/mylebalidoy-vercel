"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Reveal, Eyebrow, WordReveal } from "@/components/reveal";
import MediaViewer, { type ViewerItem } from "@/components/media-viewer";
import projectsData from "@/data/projects.json";

interface ProjectLink {
  text: string;
  url: string;
}
interface Project {
  title: string;
  image: string;
  description: string;
  links?: ProjectLink[];
  skills: string[];
  date?: string;
}

const firstSentence = (s: string) => {
  const m = s.match(/^.*?[.!?](\s|$)/);
  return (m ? m[0] : s).trim();
};

export default function Projects() {
  const projects: Project[] = projectsData;
  const [showAll, setShowAll] = useState(false);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const viewerItems: ViewerItem[] = projects.map((x) => ({
    id: x.title,
    title: x.title,
    subtitle: x.date,
    image: x.image,
    description: x.description,
    tags: x.skills,
    links: x.links,
  }));
  const visible = showAll ? projects : projects.slice(0, 5);

  return (
    <section
      id="projects"
      className="py-12 sm:py-16 md:py-24 px-6 md:px-12 lg:px-20 relative"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 md:mb-14 max-w-3xl">
          <Reveal>
            <Eyebrow n="03" label="Also build" />
          </Reveal>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-5 leading-[1.05]">
            <WordReveal text="Software development, in brief" highlight={["brief"]} />
          </h2>
          <Reveal delay={0.1}>
            <p className="text-gray-500 dark:text-gray-400 text-[13px] sm:text-sm md:text-base leading-relaxed max-w-2xl">
              Design is my focus, but I build too. It helps me design things
              that are realistic to ship. Here is a quick overview of the
              systems and apps I have developed.
            </p>
          </Reveal>
        </div>

        <ul className="divide-y divide-foreground/10 border-y border-foreground/10">
          {visible.map((p, i) => (
            <Reveal as="li" key={p.title} x={-30} y={10} amount={0.4}>
              <div
                role="button"
                tabIndex={0}
                aria-label={`View ${p.title}`}
                onClick={() => setOpenIdx(projects.indexOf(p))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIdx(projects.indexOf(p));
                  }
                }}
                className="group flex cursor-pointer items-start gap-4 rounded-2xl px-2 py-5 transition-colors hover:bg-foreground/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand md:items-center md:gap-8 md:px-4 md:py-6">
                <span className="hidden w-8 shrink-0 font-display text-2xl italic text-brand md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Preview */}
                <div className="relative aspect-[16/10] w-28 shrink-0 overflow-hidden rounded-xl border border-foreground/10 bg-foreground/5 sm:w-44 md:w-56">
                  <Image
                    src={p.image}
                    alt={p.title}
                    fill
                    sizes="(max-width: 640px) 112px, (max-width: 768px) 176px, 224px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    draggable={false}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold tracking-tight transition-colors group-hover:text-brand md:text-xl">
                        {p.title}
                      </h3>
                      {p.date && (
                        <p className="mt-0.5 text-xs font-medium text-foreground/45">
                          {p.date}
                        </p>
                      )}
                    </div>
                  </div>

                  <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-foreground/60 md:text-sm">
                    {firstSentence(p.description)}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.skills.slice(0, 4).map((s) => (
                      <span
                        key={s}
                        className="tag-purple rounded-full px-2.5 py-0.5 text-[10px] font-medium md:text-[11px]"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </ul>

        {projects.length > 5 && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll((v) => !v)}
              className="pill-button flex items-center !gap-2 !px-5 !py-2.5 sm:!gap-3 sm:!px-10 sm:!py-4"
            >
              <span className="text-[11px] sm:text-sm font-semibold tracking-normal">
                {showAll ? "Show less" : `Show all ${projects.length} projects`}
              </span>
              {showAll ? <ChevronUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" /> : <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4" />}
            </button>
          </div>
        )}
      </div>

      {/* Same full-screen viewer as the gallery */}
      <MediaViewer
        items={viewerItems}
        index={openIdx}
        onIndex={setOpenIdx}
        onClose={() => setOpenIdx(null)}
        likeKey="projects"
      />
    </section>
  );
}
