"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Monitor,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

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

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const projects: Project[] = projectsData;

  const visibleProjects = showAll ? projects : projects.slice(0, 6);
  const hasMoreToShow = projects.length > 6;

  return (
    <section id="projects" className="py-24 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Software Projects
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl">
            A showcase of my recent development projects, ranging from web apps
            to system solutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
          {visibleProjects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={hasExpanded && index < 6 ? false : { opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -12, scale: 1.01 }}
              transition={{
                duration: 0.6,
                delay: showAll && index >= 6 ? (index - 6) * 0.1 : index * 0.1,
              }}
              viewport={{ once: true }}
              className="project-card group cursor-pointer overflow-hidden flex flex-col h-full"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden flex-shrink-0">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  draggable={false}
                />
              </div>

              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold group-hover:text-brand transition-colors duration-300 leading-tight tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border border-foreground/15 dark:border-white/15 flex-shrink-0 relative overflow-hidden flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all duration-300">
                    <ArrowUpRight className="absolute w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:translate-x-[150%] group-hover:-translate-y-[150%] text-foreground/80 dark:text-white group-hover:text-white" />
                    <ArrowUpRight className="absolute w-4 h-4 md:w-5 md:h-5 -translate-x-[150%] translate-y-[150%] transition-transform duration-300 group-hover:translate-x-0 group-hover:translate-y-0 text-foreground/80 dark:text-white group-hover:text-white" />
                  </div>
                </div>

                <p className="text-brand/60 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] mb-4">
                  {project.date}
                </p>

                <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm leading-relaxed line-clamp-3 font-medium opacity-80 mb-6">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.skills.slice(0, 3).map((skill) => (
                    <span
                      key={skill}
                      className="px-2 sm:px-3 py-1 bg-brand/5 dark:bg-brand/10 text-brand text-[9px] sm:text-[10px] uppercase font-bold tracking-widest rounded-full border border-brand/10"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {hasMoreToShow && (
          <div className="flex justify-center mt-16">
            <button
              onClick={() => {
                setShowAll(!showAll);
                if (!showAll) setHasExpanded(true);
              }}
              className="pill-button px-10 py-4 flex items-center gap-3"
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                {showAll ? "Show Less" : "View All Projects"}
              </span>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>

      <Dialog
        open={!!selectedProject}
        onOpenChange={(open) => !open && setSelectedProject(null)}
      >
        <DialogContent className="w-[95vw] max-w-[1400px] bg-background dark:bg-[#0a0a0a] border border-foreground/10 rounded-3xl h-[90dvh] overflow-hidden p-0 [&>button]:hidden shadow-2xl">
          <div className="flex flex-col sm:grid sm:grid-cols-12 h-full w-full overflow-y-auto sm:overflow-hidden no-scrollbar">
            {/* Mobile sticky back button bar */}
            <div className="sticky top-0 left-0 right-0 z-50 flex items-center px-4 py-3 bg-white dark:bg-[#0a0a0a] sm:hidden">
              <DialogClose asChild>
                <Button className="gap-2 px-4 py-2 focus-visible:ring-0 bg-black dark:bg-white hover:bg-black/80 dark:hover:bg-white/80 text-white dark:text-black rounded-full shadow-md transition-all duration-200">
                  <ChevronDown className="w-4 h-4 rotate-90" />
                  <span className="text-xs font-bold uppercase tracking-widest">
                    Back
                  </span>
                </Button>
              </DialogClose>
            </div>

            {/* Visual Column */}
            <div className="relative w-full min-h-[40vh] sm:min-h-0 sm:h-full sm:col-span-7 lg:col-span-8 bg-foreground/5">
              {/* Desktop-only absolute back button */}
              <div className="absolute top-6 left-6 z-50 hidden sm:block">
                <DialogClose asChild>
                  <Button className="gap-2 px-5 py-2.5 focus-visible:ring-0 bg-black/80 hover:bg-black text-white backdrop-blur-md rounded-full border border-white/20 shadow-lg transition-all duration-200 hover:scale-105">
                    <ChevronDown className="w-4 h-4 rotate-90" />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Back
                    </span>
                  </Button>
                </DialogClose>
              </div>
              <div className="relative w-full h-full">
                {selectedProject && (
                  <Image
                    src={selectedProject.image || "/placeholder.svg"}
                    alt={selectedProject.title}
                    fill
                    sizes="100vw"
                    className="object-cover"
                    draggable={false}
                  />
                )}
              </div>
            </div>

            {/* Content Column */}
            <div className="p-8 sm:p-12 flex flex-col sm:overflow-y-auto h-auto sm:h-full sm:col-span-5 lg:col-span-4 bg-[#fcfcfc] dark:bg-[#0a0a0a] border-l border-foreground/5 no-scrollbar">
              <DialogHeader className="text-left mb-8 sm:mt-12">
                <DialogTitle className="text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight tracking-tight uppercase">
                  {selectedProject?.title}
                </DialogTitle>
                {selectedProject?.date && (
                  <p className="text-[10px] sm:text-xs text-brand font-bold uppercase tracking-[0.2em]">
                    {selectedProject.date}
                  </p>
                )}
              </DialogHeader>

              <div className="mb-12">
                <p className="text-foreground/60 leading-relaxed text-sm md:text-base font-medium">
                  {selectedProject?.description}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-foreground/10 flex flex-col gap-8">
                <div className="flex flex-wrap gap-2">
                  {selectedProject?.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 sm:px-3 py-1 sm:py-1.5 bg-foreground/5 text-foreground/70 text-[9px] sm:text-[10px] md:text-xs uppercase tracking-widest font-bold rounded-full border border-foreground/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {selectedProject?.links?.map((link, i) => (
                    <Button
                      key={i}
                      asChild
                      variant={i === 0 ? "default" : "outline"}
                      className={`w-full rounded-full uppercase tracking-[0.2em] text-[10px] sm:text-xs font-bold gap-2 sm:gap-3 py-3 sm:py-6 ${i === 0 ? "bg-brand hover:bg-brand/90 text-white" : "bg-transparent border-foreground/10 hover:bg-foreground/5 text-foreground"}`}
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        {link.text}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
