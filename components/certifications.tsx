"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Award,
  ArrowUpRight,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import certificationsData from "@/data/certifications.json";

interface CertificationLink {
  text: string;
  url: string;
}

interface Certification {
  title: string;
  image: string;
  description: string;
  issuer: string;
  date: string;
  skills: string[];
  links?: CertificationLink[];
}

export default function Certifications() {
  const [selectedCertification, setSelectedCertification] =
    useState<Certification | null>(null);
  const [showAll, setShowAll] = useState(false);

  const certifications: Certification[] = certificationsData;

  const visibleCertifications = showAll
    ? certifications
    : certifications.slice(0, 6);
  const hasMoreToShow = certifications.length > 6;

  return (
    <section id="certifications" className="py-16 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 max-w-3xl">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-foreground mb-4">
            Certifications
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-xs md:text-sm leading-relaxed max-w-2xl">
            Industry-recognized credentials that validate my expertise in
            various technical domains.
          </p>
        </div>

        {/* 2-Column Grid List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          {visibleCertifications.map((cert, index) => (
            <motion.div
              key={cert.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.01 }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
              viewport={{ once: true }}
              onClick={() => setSelectedCertification(cert)}
              className="project-card group cursor-pointer p-6 flex justify-between items-center gap-6"
            >
              <div className="flex-1">
                <span className="text-[9px] uppercase tracking-widest text-brand font-bold px-3 py-1 bg-brand/5 dark:bg-brand/10 rounded-full border border-brand/10 w-fit mb-3 inline-block">
                  {cert.issuer}
                </span>
                <h3 className="text-lg md:text-xl font-bold text-foreground group-hover:text-brand transition-colors duration-300 tracking-tight leading-tight line-clamp-2">
                  {cert.title}
                </h3>
                <span className="text-xs text-foreground/50 font-medium mt-3 block">
                  {cert.date}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-brand opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:block">
                  View Certificate
                </span>
                <div className="w-10 h-10 rounded-full border border-foreground/10 group-hover:border-brand flex items-center justify-center text-foreground/50 group-hover:text-brand group-hover:bg-brand/5 transition-all duration-300 shrink-0">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All Button */}
        {hasMoreToShow && (
          <div className="flex justify-center mt-12">
            <button
              onClick={() => setShowAll(!showAll)}
              className="pill-button px-10 py-4 flex items-center gap-3"
            >
              <span className="text-xs font-bold uppercase tracking-widest">
                {showAll ? "Show Less" : "View All Certifications"}
              </span>
              {showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        )}
      </div>

      {/* Certification Details Dialog */}
      <Dialog
        open={!!selectedCertification}
        onOpenChange={(open) => !open && setSelectedCertification(null)}
      >
        <DialogContent aria-describedby={undefined} className="w-[95vw] max-w-[1400px] bg-background dark:bg-[#0a0a0a] border border-foreground/10 rounded-3xl h-auto max-h-[90dvh] md:h-[90dvh] overflow-hidden p-0 [&>button]:hidden shadow-2xl flex flex-col">
          {/* Custom Close Button */}
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50">
            <DialogClose asChild>
              <Button className="w-10 h-10 p-0 focus-visible:ring-0 bg-black/80 hover:bg-black text-white backdrop-blur-md rounded-full border border-white/10 shadow-lg transition-all duration-200 hover:scale-105 flex items-center justify-center">
                <X className="w-4 h-4" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>

          <div className="flex flex-col sm:grid sm:grid-cols-12 h-full w-full overflow-y-auto sm:overflow-hidden no-scrollbar">
            {/* Visual Column */}
            <div className="w-full h-full sm:col-span-7 lg:col-span-8 bg-white flex flex-col items-center justify-center p-4 sm:p-8">
              {selectedCertification && (
                <div className="relative w-full h-full min-h-[300px] flex items-center justify-center drop-shadow-2xl">
                  <Image
                    src={selectedCertification.image || "/placeholder.svg"}
                    alt={selectedCertification.title}
                    width={1200}
                    height={800}
                    quality={100}
                    unoptimized
                    className="w-full h-full object-contain"
                    draggable={false}
                  />
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="p-8 sm:p-12 flex flex-col sm:overflow-y-auto h-auto sm:h-full sm:col-span-5 lg:col-span-4 bg-[#fcfcfc] dark:bg-[#0a0a0a] border-l border-foreground/5 no-scrollbar">
              <DialogHeader className="text-left mb-8 mt-4 sm:mt-12">
                <DialogTitle className="text-2xl lg:text-3xl font-bold text-foreground mb-4 leading-tight tracking-tight uppercase">
                  {selectedCertification?.title}
                </DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className="px-3 py-1 bg-brand/10 text-brand text-[9px] uppercase font-bold tracking-widest rounded-full border border-brand/20">
                    {selectedCertification?.issuer}
                  </span>
                  <span className="px-3 py-1 bg-foreground/5 text-foreground/60 text-[9px] uppercase font-bold tracking-widest rounded-full border border-foreground/5">
                    {selectedCertification?.date}
                  </span>
                </div>
              </DialogHeader>

              <div className="mb-12">
                <p className="text-foreground/60 leading-relaxed text-sm md:text-base font-medium">
                  {selectedCertification?.description}
                </p>
              </div>

              <div className="mt-auto pt-8 border-t border-foreground/10 flex flex-col gap-8">
                <div className="flex flex-wrap gap-2">
                  {selectedCertification?.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 bg-foreground/5 text-foreground/70 text-[10px] uppercase tracking-widest font-bold rounded-full border border-foreground/5"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3">
                  {selectedCertification?.links?.map((link, i) => (
                    <Button
                      key={i}
                      asChild
                      variant="default"
                      className="w-full rounded-full uppercase tracking-[0.2em] text-[10px] font-bold gap-3 py-6 bg-brand hover:bg-brand/90 text-white"
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
