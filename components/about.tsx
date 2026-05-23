"use client";
import { useState } from "react";
import Image from "next/image";
import {
  User,
  GraduationCap,
  Trophy,
  Layout,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import aboutData from "@/data/about.json";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Trophy,
  Layout,
};

export default function About() {
  const [hoveredBadge, setHoveredBadge] = useState<string | null>(null);

  const floatingBadges = [
    {
      name: "Google Agile Essentials",
      image: "/assets/certs/badge1.png",
      positionClass:
        "top-[16%] left-[10%] sm:top-[18%] sm:left-[12%] md:top-[22%] md:left-[12%]",
      rotate: "12deg",
    },
    {
      name: "Google Prompting Essentials",
      image: "/assets/certs/badge2.png",
      positionClass:
        "top-[16%] right-[10%] sm:top-[18%] sm:right-[12%] md:top-[22%] md:right-[12%]",
      rotate: "-12deg",
    },
    {
      name: "Microsoft UX Design",
      image: "/assets/certs/badge3.png",
      positionClass:
        "top-[36%] left-[10%] sm:top-[38%] sm:left-[20%] md:top-[44%] md:left-[12%]",
      rotate: "-8deg",
    },
    {
      name: "Microsoft IT Support Specialist",
      image: "/assets/certs/badge4.png",
      positionClass:
        "top-[36%] right-[10%] sm:top-[38%] sm:right-[12%] md:top-[44%] md:right-[12%]",
      rotate: "8deg",
    },
  ];

  return (
    <section id="about" className="py-20 px-6 md:px-12 lg:px-20 relative">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            About Me
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl">
            A brief look into my background, my journey as a student, and my
            aspirations in the tech industry.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Left Column (span 2) */}
          <div className="lg:col-span-2 flex flex-col w-full">
            {/* My Journey — Image Card with black gradient overlay */}
            <div className="relative overflow-hidden rounded-[40px] min-h-[420px] md:min-h-[500px] lg:h-full lg:min-h-0 w-full flex-1">
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
                  className={`absolute ${badge.positionClass} w-12 h-12 sm:w-14 sm:h-14 md:w-20 md:h-20 cursor-pointer flex items-center justify-center select-none z-20`}
                >
                  {/* Bubble Background */}
                  <Image
                    src="/assets/bubble.webp"
                    alt="Bubble"
                    fill
                    sizes="80px"
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
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 10 }}
                        className="absolute bottom-full mb-3 bg-black/85 dark:bg-white/95 text-white dark:text-black text-[9px] sm:text-[10px] font-bold px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-white/10 dark:border-black/10 pointer-events-none z-[100]"
                      >
                        {badge.name}
                        {/* Little tooltip arrow pointing down */}
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-black/85 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-black/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}

              {/* Journey text on top of gradient */}
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
                <div className="space-y-4">
                  {aboutData.journey.map((paragraph, idx) => (
                    <p
                      key={idx}
                      className="text-white/80 leading-relaxed text-xs sm:text-sm font-medium"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:top-28 h-fit flex flex-col gap-8">
            {aboutData.cards.map((card, idx) => {
              const IconComponent = iconMap[card.icon] || GraduationCap;
              const isAward = card.icon === "Trophy";
              return (
                <div
                  key={idx}
                  className="project-card p-8 flex items-start gap-5"
                >
                  <div
                    className={
                      isAward
                        ? "bg-amber-500/10 dark:bg-amber-500/15 p-4 rounded-2xl border border-amber-500/20 text-amber-500 dark:text-amber-400"
                        : "bg-brand/5 dark:bg-brand/10 p-4 rounded-2xl border border-brand/10 text-brand"
                    }
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <div>
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
    </section>
  );
}
