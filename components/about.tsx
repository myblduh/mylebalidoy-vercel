"use client";
import { useState } from "react";
import Image from "next/image";
import { User, X, type LucideIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import aboutData from "@/data/about.json";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const iconMap: Record<string, string> = {
  GraduationCap: "/assets/icons/education_icon.png",
  Briefcase: "/assets/icons/experience_icon.png",
  Trophy: "/assets/events/protothon2026.png",
  Layout: "/assets/icons/projects_icon.png",
};

const companies = [
  {
    name: "Blueshift Energy",
    role: "UI/UX Designer",
    period: "July 2026 – Sep. 2026",
    logo: "/assets/logos/blueshift.jfif",
  },
  {
    name: "KMC Solutions",
    role: "UI/UX Designer Intern",
    period: "Jan. 2026 – May 2026",
    logo: "/assets/logos/kmc.jfif",
  },
];

export default function About() {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);
  const [hoveredCompany, setHoveredCompany] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const floatingBadges = [
    {
      name: "Google Agile Essentials",
      image: "/assets/certs/badge1.png",
      positionClass:
        "top-[18%] left-[10%] sm:top-[20%] sm:left-[12%] md:top-[22%] md:left-[12%]",
      rotate: "12deg",
    },
    {
      name: "Google Prompting Essentials",
      image: "/assets/certs/badge2.png",
      positionClass:
        "top-[18%] right-[10%] sm:top-[20%] sm:right-[12%] md:top-[22%] md:right-[12%]",
      rotate: "-12deg",
    },
    {
      name: "Microsoft UX Design",
      image: "/assets/certs/badge3.png",
      positionClass:
        "top-[38%] left-[10%] sm:top-[40%] sm:left-[18%] md:top-[44%] md:left-[12%]",
      rotate: "-8deg",
    },
    {
      name: "Microsoft IT Support Specialist",
      image: "/assets/certs/badge4.png",
      positionClass:
        "top-[38%] right-[15%] sm:top-[40%] sm:right-[12%] md:top-[44%] md:right-[12%]",
      rotate: "8deg",
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-16 md:py-20 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            About Me
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl">
            A brief look into my background and my journey as a student.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-stretch">
          {/* Left Column */}
          <div className="flex flex-col w-full">
            {/* My Journey — Image Card with black gradient overlay */}
            <div className="relative overflow-hidden rounded-[40px] min-h-[460px] md:min-h-[500px] lg:h-full lg:min-h-0 w-full flex-1">
              {/* Background image */}
              <Image
                src="/assets/images/image0.jpg"
                alt="Myle at an aquarium"
                fill
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="object-cover object-center"
                draggable={false}
              />
              {/* Black gradient — bottom to top */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/10" />

              {/* Floating Certification Badges */}
              {floatingBadges.map((badge, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.8, rotate: badge.rotate }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.2, rotate: "0deg", zIndex: 50 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  onMouseEnter={() => setHoveredBadge(badge.name)}
                  onMouseLeave={() => setHoveredBadge(null)}
                  className={`absolute ${badge.positionClass} w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 cursor-default flex items-center justify-center select-none z-20`}
                >
                  {/* Bubble Background */}
                  <Image
                    src="/assets/bubble.webp"
                    alt="Bubble"
                    fill
                    sizes="70px"
                    className="object-contain drop-shadow-md"
                    draggable={false}
                  />

                  {/* Badge Image inside the bubble */}
                  <div className="relative w-[55%] h-[55%] z-10">
                    <Image
                      src={badge.image}
                      alt={badge.name}
                      fill
                      sizes="40px"
                      className="object-contain"
                      draggable={false}
                    />
                  </div>

                  {/* Tooltip on hover */}
                  <AnimatePresence>
                    {hoveredBadge === badge.name && (
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex justify-center">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.8, y: 4 }}
                          transition={{ duration: 0.15 }}
                          className="relative bg-black/90 dark:bg-white/95 text-white dark:text-black text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md whitespace-nowrap shadow-xl border border-white/10 dark:border-black/10 flex items-center justify-center text-center tracking-tight"
                        >
                          {badge.name}
                          {/* Little tooltip arrow pointing down */}
                          <div className="absolute top-full -translate-y-1/2 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-black/90 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-black/10" />
                        </motion.div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Journey text on top of gradient */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12 z-30">
                <div className="space-y-4">
                  {aboutData.journey.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-white/80 leading-relaxed text-xs sm:text-sm font-medium"
                    >
                      {paragraph}
                    </p>
                  ))}

                  {/* Previously worked at + Company Tags */}
                  <div className="pt-2">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest font-semibold text-white/50 mb-2.5 block">
                      Previously worked at
                    </span>
                    <div className="flex flex-wrap items-center gap-2">
                      {companies.map((company) => (
                        <div
                          key={company.name}
                          className="relative"
                          onMouseEnter={() => setHoveredCompany(company.name)}
                          onMouseLeave={() => setHoveredCompany(null)}
                          onClick={() =>
                            setHoveredCompany(
                              hoveredCompany === company.name
                                ? null
                                : company.name,
                            )
                          }
                        >
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/20 hover:border-brand/70 backdrop-blur-md transition-all duration-300 cursor-pointer shadow-lg group select-none">
                            <div className="relative w-4 h-4 rounded-[3px] overflow-hidden shrink-0 border border-white/20">
                              <Image
                                src={company.logo}
                                alt={company.name}
                                fill
                                sizes="16px"
                                className="object-cover"
                              />
                            </div>
                            <span className="text-xs font-semibold text-white/90 group-hover:text-white transition-colors">
                              {company.name}
                            </span>
                          </div>

                          {/* Tooltip on hover/tap showing role and date */}
                          <AnimatePresence>
                            {hoveredCompany === company.name && (
                              <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 pointer-events-none flex justify-center">
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.8, y: 6 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.8, y: 6 }}
                                  transition={{ duration: 0.15 }}
                                  className="relative bg-black/95 dark:bg-zinc-950/95 text-white px-3.5 py-2 rounded-xl whitespace-nowrap shadow-2xl border border-white/15 backdrop-blur-md flex flex-col items-center text-center min-w-[130px]"
                                >
                                  <span className="text-xs font-bold text-white tracking-tight text-center">
                                    {company.role}
                                  </span>
                                  <span className="text-[10px] font-semibold text-brand tracking-wide mt-0.5 text-center">
                                    {company.period}
                                  </span>
                                  <div className="absolute top-full -translate-y-1/2 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/95 dark:bg-zinc-950/95 rotate-45 border-r border-b border-white/15" />
                                </motion.div>
                              </div>
                            )}
                          </AnimatePresence>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 h-fit flex flex-col justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {aboutData.cards.map((card, idx) => {
                const iconSrc = iconMap[card.icon] || iconMap.GraduationCap;
                const isAward = card.icon === "Trophy";
                return (
                  <div
                    key={idx}
                    className={`project-card p-5 sm:p-6 flex flex-row sm:flex-col items-start gap-5 sm:gap-6 ${isAward ? "cursor-pointer hover:bg-amber-500/5 transition-colors" : ""}`}
                    onClick={
                      isAward
                        ? () =>
                            setSelectedImage({
                              src: "/assets/awards/award_00.png",
                              alt: "1st Runner Up - Enterprise Track",
                            })
                        : undefined
                    }
                  >
                    <div className="flex-shrink-0 w-12 sm:w-16 flex items-center justify-center pt-1">
                      <div
                        className={`${isAward ? "w-12 h-12 sm:w-16 sm:h-16" : "w-10 h-10 sm:w-14 sm:h-14"} relative`}
                      >
                        <Image
                          src={iconSrc}
                          alt={`${card.title} Icon`}
                          fill
                          sizes="(max-width: 640px) 48px, 64px"
                          className="object-contain"
                          draggable={false}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl md:text-2xl font-bold text-foreground mb-1 tracking-tight">
                        {card.title}
                      </h3>
                      <p
                        className={
                          isAward
                            ? "text-amber-500 dark:text-amber-400 text-[10px] font-bold mb-2 uppercase tracking-[0.15em] md:tracking-widest"
                            : "text-brand text-[10px] font-bold mb-2 uppercase tracking-[0.15em] md:tracking-widest"
                        }
                      >
                        {card.subtitle}
                      </p>
                      <p
                        className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed opacity-80 font-medium"
                        dangerouslySetInnerHTML={{ __html: card.details }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Image Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent aria-describedby={undefined} className="max-w-[90vw] md:max-w-5xl bg-black/90 border-white/10 p-2 md:p-6 shadow-2xl rounded-2xl sm:rounded-3xl z-[200] [&>button]:hidden">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          <div className="absolute top-4 right-4 z-50">
            <DialogClose asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-md transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </Button>
            </DialogClose>
          </div>
          <div className="relative w-full flex items-center justify-center rounded-xl md:rounded-2xl overflow-hidden bg-black/50">
            {selectedImage && (
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="max-w-full max-h-full object-contain"
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
