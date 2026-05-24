"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredMobile, setIsHoveredMobile] = useState(false);
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);

  const designThinkingBubbles = [
    {
      id: 1,
      name: "Empathize",
      image: "/assets/icons/empathize_icon.png",
      note: "I understand the people behind the screen.",
    },
    {
      id: 2,
      name: "Define",
      image: "/assets/icons/backend_icon.png",
      note: "I turn human needs into clear problems.",
    },
    {
      id: 3,
      name: "Ideate",
      image: "/assets/icons/ideate_icon.png",
      note: "I explore ideas that benefit people.",
    },
    {
      id: 4,
      name: "Prototype",
      image: "/assets/icons/design_icon.png",
      note: "I build interfaces that will help them navigate.",
    },
    {
      id: 5,
      name: "Test",
      image: "/assets/icons/projects_icon.png",
      note: "I refine based on how people experience the design.",
    },
  ];

  const mobilePositions = [
    { class: "bottom-[5%] left-[15%]" },
    { class: "bottom-[45%] left-[30%]" },
    { class: "top-[5%] left-[50%]" },
    { class: "bottom-[45%] left-[70%]" },
    { class: "bottom-[5%] left-[85%]" },
  ];

  const renderBubble = (
    bubble: any,
    additionalClass: string,
    isAbsolute: boolean = true,
  ) => {
    const sizeClass =
      "w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20";
    const textClass = "text-[9px] sm:text-xs";
    const pingSize = "w-5 h-5 sm:w-6 sm:h-6";
    const key = `b-${bubble.id}-${isAbsolute ? "abs" : "rel"}`;

    return (
      <motion.div
        key={key}
        initial={{ opacity: 0, scale: 0.8, x: isAbsolute ? "-50%" : 0 }}
        animate={{ opacity: 1, scale: 1, x: isAbsolute ? "-50%" : 0 }}
        whileHover={{ scale: 1.1, zIndex: 50, x: isAbsolute ? "-50%" : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        onMouseEnter={() => setHoveredBubble(key)}
        onMouseLeave={() => setHoveredBubble(null)}
        className={`${isAbsolute ? "absolute" : "relative"} ${additionalClass} ${sizeClass} shrink-0 cursor-pointer flex items-center justify-center select-none z-20 pointer-events-auto`}
      >
        <div className="relative w-full h-full z-10 transition-all duration-300 hover:drop-shadow-[0_0_25px_rgba(139,92,246,0.7)]">
          <Image
            src={bubble.image}
            alt={bubble.name}
            fill
            sizes="120px"
            className="object-contain drop-shadow-md"
            draggable={false}
          />
        </div>
        <div
          className={`absolute -top-1 -left-1 md:-top-2 md:-left-2 ${pingSize} bg-red-500 rounded-full text-white ${textClass} font-bold flex justify-center items-center shadow-lg border-2 border-background z-20`}
        >
          {bubble.id}
        </div>
        <AnimatePresence>
          {hoveredBubble === key && (
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 10 }}
                className={`relative bg-black/85 dark:bg-white/95 text-white dark:text-black font-bold px-3 py-2 md:px-4 md:py-2.5 rounded-xl whitespace-nowrap shadow-xl border border-white/10 dark:border-black/10 flex flex-col items-center`}
              >
                <span className="text-[10px] md:text-xs uppercase tracking-widest text-brand mb-0.5">
                  {bubble.name}
                </span>
                <span className="text-[10px] md:text-xs font-medium">
                  {bubble.note}
                </span>
                <div
                  className={`absolute top-full -translate-y-1/2 left-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-black/85 dark:bg-white/95 rotate-45 border-r border-b border-white/10 dark:border-black/10`}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <section
      id="profile"
      className="min-h-[100dvh] flex flex-col justify-center pt-28 pb-20 px-4 overflow-hidden relative"
    >
      {/* Background Ambient Glows - Modern Aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative z-30 pt-4 sm:pt-12 md:pt-8">
        <div className="max-w-4xl relative w-full flex flex-col items-center">
          <p className="text-brand font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[9px] sm:text-[11px] md:text-sm mb-4 mt-2 md:mt-0 relative z-30">
            UX Design Portfolio
          </p>

          <div className="relative z-30">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tighter leading-[1.1] uppercase text-center">
              <span className="hover:text-brand transition-colors duration-300 cursor-default">
                Creating
              </span>{" "}
              <span className="hover:text-brand transition-colors duration-300 cursor-default">
                intuitive
              </span>{" "}
              <span className="hover:text-brand transition-colors duration-300 cursor-default">
                designs
              </span>{" "}
              <span className="hover:text-brand transition-colors duration-300 cursor-default">
                by
              </span>{" "}
              <br className="hidden md:block" />
              <span className="inline-block">
                <span className="hover:text-brand transition-colors duration-300 cursor-default">
                  Putting
                </span>
              </span>
              &nbsp;
              <span className="relative inline-block px-2 sm:px-3 md:px-4 py-0 sm:py-1 bg-white dark:bg-white/10 border sm:border-2 border-brand rounded-lg sm:rounded-xl text-black dark:text-white hover:text-brand dark:hover:text-brand transition-colors duration-300 cursor-default shadow-lg align-middle -translate-y-1">
                Users First.
                <motion.div
                  initial={{ opacity: 0, x: 10, y: 10 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ delay: 2, duration: 0.5 }}
                  className="absolute -right-4 sm:-right-6 md:-right-8 -bottom-4 sm:-bottom-5 md:-bottom-6 z-[100] flex items-center pointer-events-none select-none"
                >
                  <div className="relative flex flex-col items-start translate-x-[2px] translate-y-[2px]">
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-brand drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]"
                    >
                      <path
                        d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z"
                        fill="currentColor"
                        stroke="white"
                        strokeWidth="1.2"
                      />
                    </svg>
                    <div className="bg-brand text-white text-[8px] leading-none font-bold px-2 py-1 rounded-full whitespace-nowrap shadow-lg border border-white/20 -mt-0.5 ml-2 relative z-[110] tracking-widest uppercase">
                      Me
                    </div>
                  </div>
                </motion.div>
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8 mb-12 sm:mb-16 relative z-40">
            {/* Desktop Persona Image (Anchored to left of buttons) */}
            <div
              className="hidden md:block absolute bottom-0 right-[100%] mr-24 lg:mr-36 xl:mr-48 w-24 h-24 lg:w-32 lg:h-32 xl:w-36 xl:h-36 rotate-[-15deg] drop-shadow-2xl z-10 transition-transform hover:scale-110 hover:rotate-0 duration-500 cursor-pointer select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src="/assets/mylepersona.png"
                alt="Myle Persona"
                fill
                sizes="144px"
                priority
                className="object-contain"
              />
              <AnimatePresence>
                {isHovered && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      style={{ rotate: 10 }}
                      className="relative bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl border border-white/20"
                    >
                      Hello, I'm Myle!
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand rotate-45 border-r border-b border-white/20" />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/resume">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 sm:px-8 sm:py-3.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xl border border-white/10"
              >
                View Resume
              </motion.button>
            </Link>
            <button
              className="bg-white/5 border border-foreground/10 text-foreground px-6 py-3 sm:px-8 sm:py-3.5 rounded-full font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/15 hover:border-foreground/30 transition-all duration-300 backdrop-blur-md shadow-lg"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact Me
            </button>
          </div>

          {/* Bubbles Container Moved BELOW the buttons */}

          {/* Desktop Straight Line Container (Pure Flexbox) */}
          <div className="hidden md:flex flex-row justify-between items-center w-full max-w-[640px] lg:max-w-[800px] mb-8 pointer-events-none z-40 mx-auto relative">
            {designThinkingBubbles.map((bubble) =>
              renderBubble(bubble, "", false),
            )}
          </div>

          {/* Mobile Upwards Cone (/\) Container */}
          <div className="md:hidden relative w-full max-w-[340px] sm:max-w-[480px] h-[160px] sm:h-[200px] mb-8 pointer-events-none z-40 mx-auto flex justify-center items-end pb-2">
            {/* The Bubbles positioned in an upward V shape */}
            {designThinkingBubbles.map((bubble, idx) =>
              renderBubble(bubble, mobilePositions[idx].class, true),
            )}

            {/* Mobile Persona - nestled under the arch of the /\ */}
            <div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rotate-[-10deg] drop-shadow-2xl cursor-pointer select-none transition-transform duration-500 hover:scale-110 hover:rotate-0 z-50 pointer-events-auto"
              onMouseEnter={() => setIsHoveredMobile(true)}
              onMouseLeave={() => setIsHoveredMobile(false)}
              onClick={() => setIsHoveredMobile((prev) => !prev)}
            >
              <Image
                src="/assets/mylepersona.png"
                alt="Myle Persona"
                fill
                sizes="96px"
                priority
                className="object-contain"
              />
              <AnimatePresence>
                {isHoveredMobile && (
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-[100] pointer-events-none flex justify-center">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.8, y: 10 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                      }}
                      style={{ rotate: 10 }}
                      className="relative bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl border border-white/20"
                    >
                      Hello, I'm Myle!
                      <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand rotate-45 border-r border-b border-white/20" />
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Flickering Scroll Down Mouse Indicator */}
      <div
        className="absolute bottom-6 left-1/2 -translate-x-1/2 cursor-pointer z-20 flex flex-col items-center gap-2 group"
        onClick={() =>
          document
            .getElementById("designs")
            ?.scrollIntoView({ behavior: "smooth" })
        }
      >
        <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-foreground/40 group-hover:text-brand transition-colors duration-300">
          Scroll
        </span>
        <div className="w-[18px] h-[28px] rounded-full border-2 border-foreground/20 group-hover:border-brand/40 transition-colors duration-300 flex justify-center pt-1.5 relative">
          <motion.div
            animate={{
              y: [0, 6, 0],
              opacity: [0.2, 1, 0.2, 1, 0.2],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="w-1 h-2 rounded-full bg-brand"
          />
        </div>
      </div>
    </section>
  );
}
