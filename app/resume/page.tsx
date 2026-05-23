"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useSpring, Variants } from "framer-motion";
import {
  Home,
  Briefcase,
  GraduationCap,
  Award,
  Code2,
  Download,
  BadgeCheck,
  FolderKanban,
  Wrench,
  ArrowUp,
  Linkedin,
  Github,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false }
);

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradient),
  { ssr: false }
);
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, X } from "lucide-react";
import "./styles.css";

import projectsData from "@/data/projects.json";
import designsData from "@/data/designs.json";
import certificationsData from "@/data/certifications.json";
import skillsData from "@/data/skills.json";
import aboutData from "@/data/about.json";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const InteractiveText = ({
  text,
  className,
}: {
  text: string;
  className?: string;
}) => {
  return (
    <span
      className={`inline-flex flex-wrap justify-center md:justify-start ${className}`}
    >
      {text.split(" ").map((word, wordIndex) => (
        <span
          key={wordIndex}
          className="inline-block whitespace-nowrap mr-[0.25em] last:mr-0"
        >
          {word.split("").map((char, charIndex) => (
            <span
              key={charIndex}
              className="transition-all duration-300 hover:text-brand hover:-translate-y-1 hover:scale-105 cursor-default inline-block"
            >
              {char}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
};

export default function DigitalResumePage() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showTopBtn, setShowTopBtn] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
  } | null>(null);

  const featuredProjects = [
    designsData.find((p) => p.title.includes("Trackify")),
    designsData.find((p) => p.title.includes("Payonnect")),
    projectsData.find((p) => p.title.includes("Lakbay Calamba")),
    designsData.find((p) => p.title.includes("CosMarket")),
    projectsData.find((p) => p.title.includes("RFID-Based")),
    designsData.find((p) => p.title.includes("HealthMate")),
  ].filter(Boolean) as any[];

  // Smooth springs for the comet cursor
  const springX = useSpring(0, { stiffness: 800, damping: 40 });
  const springY = useSpring(0, { stiffness: 800, damping: 40 });

  useEffect(() => {
    setIsMounted(true);
    const updateMousePosition = (ev: MouseEvent) => {
      springX.set(ev.clientX);
      springY.set(ev.clientY);

      if (cursorRef.current) {
        cursorRef.current.style.opacity = "1";
      }

      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
      idleTimeoutRef.current = setTimeout(() => {
        if (cursorRef.current) cursorRef.current.style.opacity = "0";
      }, 3000);
    };
    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [springX, springY]);

  useEffect(() => {
    const handleScroll = () => setShowTopBtn(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start center", "end 90%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 25,
    restDelta: 0.001,
  });

  return (
    <main className="min-h-screen bg-black text-white selection:bg-white/30 selection:text-white overflow-hidden pb-12">
      {/* Comet Cursor Effect */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed top-0 left-0 w-[240px] h-[240px] rounded-full z-[100] transition-opacity duration-1000 ease-in-out"
        style={{
          x: springX,
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: isMounted ? 1 : 0, // Ensure it mounts with correct opacity handling
          background:
            "radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, rgba(139, 92, 246, 0.08) 20%, rgba(0, 0, 0, 0) 60%)",
        }}
      />

      {/* Dynamic Background Effect */}
      <div className="fixed top-0 left-0 w-full h-[120vh] z-0 opacity-20 pointer-events-none">
        <ShaderGradientCanvas
          style={{ pointerEvents: "none" }}
          pointerEvents="none"
          lazyLoad={false}
          pixelDensity={0.5}
        >
          <ShaderGradient
            animate={"on"}
            enableTransition={false}
            brightness={1.1}
            color1="#5606ff"
            color2="#fe8989"
            color3="#000000"
            cAzimuthAngle={180}
            cDistance={3.9}
            cPolarAngle={115}
            cameraZoom={1}
            positionX={-0.5}
            positionY={0.1}
            positionZ={0}
            rotationZ={235}
            shader="defaults"
            type="waterPlane"
            uDensity={1.1}
            uFrequency={5.5}
            uSpeed={0.1}
            uStrength={2.4}
            uTime={0.2}
            wireframe={false}
            // @ts-ignore
            pixelDensity={1}
          />
        </ShaderGradientCanvas>
      </div>

      {/* Home Button (Top Left) */}
      <nav className="fixed top-0 left-0 w-full p-6 md:px-12 z-[60] flex items-center justify-start pointer-events-none">
        <Link
          href="/"
          className="group pointer-events-auto flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/10 text-white rounded-full px-5 py-2.5 hover:bg-white/20 transition-all shadow-lg active:scale-95"
        >
          <Home
            size={18}
            className="group-hover:scale-110 transition-transform"
          />
          <span className="text-sm font-semibold uppercase tracking-widest hidden sm:inline">
            Home
          </span>
        </Link>
      </nav>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 md:px-12 pt-24">
        {/* Header Hero Card */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerVariants}
          className="resume-header-card"
        >
          <motion.div
            variants={itemVariants}
            className="flex flex-col items-center shrink-0 group/header scale-95 md:scale-100"
          >
            <div className="w-32 h-32 md:w-44 md:h-44 bg-white/5 border border-white/10 rounded-full md:rounded-[1.6rem] overflow-hidden shadow-2xl transition-all duration-500 hover:border-brand/30 hover:shadow-[0_0_50px_rgba(139,92,246,0.2)] flex flex-col backdrop-blur-md">
              <div className="flex-grow relative overflow-hidden bg-brand/5">
                <img
                  src="/assets/mylepersona.png"
                  alt="Myle Balidoy"
                  className="w-full h-full object-cover transition-all duration-700 group-hover/header:scale-105"
                  draggable={false}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col justify-center text-center md:text-left md:mt-2"
          >
            <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] text-white/50 mb-3 block font-medium">
              Digital Resume
            </span>
            <h1 className="text-3xl md:text-5xl font-bold tracking-tighter mb-4 shadow-sm text-shadow-sm pointer-events-auto">
              <InteractiveText text="Myle Balidoy" />
            </h1>
            <p className="text-base md:text-lg text-white/80 max-w-2xl font-light text-shadow-sm">
              {aboutData.journey[0]}
            </p>
            <div className="mt-8 flex justify-center md:justify-start">
              <a
                href={
                  aboutData.resumePath || "/assets/Myle_UXDesigner_Resume.pdf"
                }
                download
                className="download-btn"
              >
                <span>Download Resume</span>
                <Download
                  size={16}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
              </a>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <div className="flex flex-col space-y-12 mt-4">
          {/* Education Section */}
          <motion.div
            id="education"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="section-card scroll-mt-32"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mb-8"
            >
              <div className="icon-circle border-brand text-brand shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <GraduationCap className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Education
              </h2>
            </motion.div>

            <motion.div variants={itemVariants}>
              <div>
                <h3 className="text-white/90 font-bold mb-1 text-base md:text-lg tracking-tight">
                  Bachelor of Science in Information Technology
                </h3>
                <p className="text-white/80 font-medium mb-1 text-sm md:text-base">
                  National University - Laguna
                </p>
                <p className="text-brand/80 font-medium text-xs md:text-sm mb-4 tracking-wide uppercase">
                  2022 – 2026
                </p>
                <div className="relative mt-4 ml-1.5">
                  <div className="absolute left-[3px] top-2 bottom-0 w-[2px] bg-brand/20" />
                  <ul className="space-y-4 text-white/80 text-sm leading-relaxed font-light relative z-10">
                    <li className="relative pl-6">
                      <span className="education-dot bg-brand" />
                      <div>Specialization: Web and Mobile Development</div>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Timeline Wrapper for Projects & Certifications */}
          <div
            className="relative max-w-5xl w-full lg:col-span-12 pt-4"
            ref={timelineRef}
          >
            {/* The Glowing Animated Line mapped to scroll */}
            <motion.div
              className="absolute left-[27px] top-10 w-[2px] z-0 origin-top h-[calc(100%-100px)]"
              style={{
                scaleY: smoothProgress,
                backgroundImage:
                  "linear-gradient(to bottom, #8B5CF6 0%, #3B82F6 50%, #10B981 100%)",
                boxShadow: "0 0 15px rgba(255, 255, 255, 0.2)",
              }}
            />

            <div className="space-y-12 pb-8">
              {/* Experience */}
              <motion.div
                id="resume-experience"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="relative z-10 block scroll-mt-32"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-6 mb-8 ml-[8px]"
                >
                  <div className="icon-circle border-brand text-brand shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                    <Briefcase className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Experience
                  </h2>
                </motion.div>

                <div className="relative space-y-10 group">
                  <motion.div
                    variants={itemVariants}
                    className="relative pl-[56px] md:pl-[64px] py-2"
                  >
                    <div className="timeline-dot bg-brand shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                    <div className="timeline-card hover:border-brand/30 relative">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-white/90 tracking-tight">
                        UI/UX Designer Intern
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="badge bg-brand text-white border-transparent">
                          Jan. 2026 – May 2026
                        </span>
                        <span className="badge-outline">
                          KMC Solutions (Internship)
                        </span>
                      </div>
                      <ul className="space-y-3 text-white/70 leading-relaxed font-light text-sm md:text-base">
                        <li className="flex items-start">
                          <span className="mr-3 text-brand mt-1">•</span>
                          Design responsive web and mobile interfaces, improving
                          layout, usability, and overall user experience.
                        </li>
                        <li className="flex items-start">
                          <span className="mr-3 text-brand mt-1">•</span>
                          Support end-to-end design processes, from concepts and
                          user flow implementation to final prototypes.
                        </li>
                      </ul>
                    </div>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="relative pl-[56px] md:pl-[64px] py-2"
                  >
                    <div className="timeline-dot bg-brand shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                    <div className="timeline-card hover:border-brand/30 relative">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-white/90 tracking-tight">
                        Data Entry & Design Assistant
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="badge bg-brand text-white border-transparent">
                          Sep. 2025 – Mar. 2026
                        </span>
                        <span className="badge-outline">
                          Improbable Labs (Part-Time, Remote)
                        </span>
                      </div>
                      <ul className="space-y-3 text-white/70 leading-relaxed font-light text-sm md:text-base">
                        <li className="flex items-start">
                          <span className="mr-3 text-brand mt-1">•</span>
                          Conducted keyword research, managed data entry, and
                          designed app store previews to streamline the
                          development workflow and boost user engagement.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              {/* Awards */}
              <motion.div
                id="resume-awards"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="relative z-10 block scroll-mt-32"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-6 mb-8 ml-[8px]"
                >
                  <div className="icon-circle border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                    <Award className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Awards
                  </h2>
                </motion.div>

                <div className="relative space-y-10 group">
                  <motion.div
                    variants={itemVariants}
                    className="relative pl-[56px] md:pl-[64px] py-2"
                  >
                    <div className="timeline-dot bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
                    <div className="timeline-card hover:border-amber-500/30 relative">
                      <h3 className="text-xl md:text-2xl font-bold mb-3 text-white/90 tracking-tight">
                        1st Runner Up - Enterprise Track
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 mb-5">
                        <span className="badge bg-[rgba(245,158,11,0.1)] text-amber-500 border-[rgba(245,158,11,0.2)]">
                          May 2026
                        </span>
                        <span className="badge-outline border-amber-500/20 text-amber-500/80">
                          Protothon 2026: The Online UX Hackathon
                        </span>
                      </div>
                      <ul className="space-y-3 text-white/70 leading-relaxed font-light text-sm md:text-base">
                        <li className="flex items-start">
                          <span className="mr-3 text-amber-500 mt-1">•</span>
                          Designed Trackify, an enterprise inventory system
                          featuring real-time tracking, barcode integration, and
                          analytics. The design placed 2nd out of 35 teams in
                          the Enterprise track.
                        </li>
                      </ul>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              {/* Projects */}
              <motion.div
                id="resume-projects"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="relative z-10 block scroll-mt-32"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-6 mb-8 ml-[8px]"
                >
                  <div className="icon-circle border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                    <FolderKanban className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Featured Projects
                  </h2>
                </motion.div>

                <div className="relative space-y-10 group">
                  {featuredProjects.map((project, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative pl-[56px] md:pl-[64px] py-2"
                    >
                      <div className="timeline-dot bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                      <div className="timeline-card hover:border-blue-500/30 relative">
                        {project.image && (
                          <div className="story-box story-box-blue">
                            <img
                              src={project.image}
                              alt={project.title}
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        )}
                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-white/90 tracking-tight md:pr-24">
                          {project.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          {project.date && (
                            <span className="badge bg-[rgba(59,130,246,0.1)] text-blue-400 border-[rgba(59,130,246,0.2)]">
                              {project.date}
                            </span>
                          )}
                          <div className="flex flex-wrap gap-2">
                            {project.skills?.slice(0, 3).map((skill) => (
                              <span
                                key={skill}
                                className="badge-outline text-[9px] py-0.5"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <ul className="space-y-3 text-white/70 leading-relaxed font-light text-sm md:text-base">
                          <li className="flex items-start">
                            <span className="mr-3 text-blue-500 mt-1">•</span>
                            {project.description}
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Certifications */}
              <motion.div
                id="resume-certifications"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={containerVariants}
                className="relative z-10 block scroll-mt-32"
              >
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-6 mb-8 ml-[8px]"
                >
                  <div className="icon-circle border-emerald-500 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
                    <BadgeCheck className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                    Certifications
                  </h2>
                </motion.div>

                <div className="relative space-y-12">
                  {certificationsData.slice(0, 5).map((cert, index) => (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="relative pl-[56px] md:pl-[64px] py-2"
                    >
                      <div className="timeline-dot bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                      <div className="timeline-card hover:border-emerald-500/30 relative">
                        {cert.image && (
                          <div className="story-box story-box-emerald">
                            <img
                              src={cert.image}
                              alt={cert.title}
                              draggable={false}
                              onContextMenu={(e) => e.preventDefault()}
                            />
                          </div>
                        )}
                        <h3 className="text-xl md:text-2xl font-bold mb-3 text-white/90 tracking-tight md:pr-24">
                          {cert.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 mb-5">
                          <span className="badge bg-[rgba(16,185,129,0.1)] text-emerald-400 border-[rgba(16,185,129,0.2)]">
                            {cert.date}
                          </span>
                          <span className="badge-outline border-emerald-500/20 text-emerald-400/80">
                            {cert.issuer}
                          </span>
                        </div>
                        <ul className="space-y-3 text-white/70 leading-relaxed font-light text-sm md:text-base">
                          <li className="flex items-start">
                            <span className="mr-3 text-emerald-500 mt-1">
                              •
                            </span>
                            {cert.description}
                          </li>
                        </ul>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* Technical Toolbox */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="section-card"
          >
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-4 mb-8"
            >
              <div className="icon-circle border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]">
                <Wrench className="w-5 h-5" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Technical Toolbox
              </h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {skillsData.map((category, index) => (
                <div key={index} className="flex flex-col mb-4">
                  <h3 className="text-lg font-bold text-white/90 mb-4 tracking-tight">
                    {category.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.1)] text-[rgba(255,255,255,0.7)] text-[10px] sm:text-xs uppercase tracking-widest font-bold rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Social Links */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col md:flex-row items-center justify-center gap-4 pt-12 pb-8 border-t border-white/10"
          >
            <a
              href="https://www.linkedin.com/in/mylebalidoy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full md:w-auto gap-3 px-8 py-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-brand/50 rounded-full transition-all duration-300 text-white group backdrop-blur-md"
            >
              <Linkedin className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">
                LinkedIn
              </span>
            </a>
            <a
              href="https://github.com/myblduh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full md:w-auto gap-3 px-8 py-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-brand/50 rounded-full transition-all duration-300 text-white group backdrop-blur-md"
            >
              <Github className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">
                GitHub
              </span>
            </a>
            <a
              href="https://www.behance.net/mylebalidoy"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full md:w-auto gap-3 px-8 py-4 bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] border border-[rgba(255,255,255,0.1)] hover:border-brand/50 rounded-full transition-all duration-300 text-white group backdrop-blur-md"
            >
              <ExternalLink className="w-5 h-5 text-brand group-hover:scale-110 transition-transform" />
              <span className="text-sm font-bold uppercase tracking-widest">
                Behance
              </span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Floating Back to Top Button */}
      {showTopBtn && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-[100] w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-white/20 transition-all hover:scale-110 active:scale-95"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}

      {/* Image Lightbox Dialog */}
      <Dialog
        open={!!selectedImage}
        onOpenChange={(open) => !open && setSelectedImage(null)}
      >
        <DialogContent className="max-w-[90vw] md:max-w-5xl bg-black/90 border-white/10 p-2 md:p-6 shadow-2xl rounded-2xl sm:rounded-3xl z-[200]">
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
          <div className="relative w-full h-[80vh] flex items-center justify-center rounded-xl md:rounded-2xl overflow-hidden bg-black/50">
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
    </main>
  );
}
