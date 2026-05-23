"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MousePointer2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Profile() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredMobile, setIsHoveredMobile] = useState(false);

  return (
    <section
      id="profile"
      className="min-h-[100dvh] flex flex-col justify-center pt-28 pb-20 px-4 overflow-hidden relative"
    >
      {/* Background Ambient Glows - Modern Aesthetic */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand/15 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto flex flex-col items-center text-center relative">
        <div className="max-w-4xl relative">
          {/* Centered Persona Image for Mobile */}
          <div
            className="md:hidden w-28 h-28 rotate-[-10deg] drop-shadow-2xl mx-auto mb-3 relative cursor-pointer select-none"
            onMouseEnter={() => setIsHoveredMobile(true)}
            onMouseLeave={() => setIsHoveredMobile(false)}
            onClick={() => setIsHoveredMobile((prev) => !prev)}
          >
            <Image
              src="/assets/mylepersona.png"
              alt="Myle Persona"
              fill
              className="object-contain"
            />
            <AnimatePresence>
              {isHoveredMobile && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 10 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  style={{ rotate: 10 }}
                  className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl border border-white/20 z-[100]"
                >
                  Hello, I'm Myle!
                  <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand rotate-45 border-r border-b border-white/20" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-brand font-bold tracking-[0.3em] md:tracking-[0.4em] uppercase text-[9px] sm:text-[11px] md:text-sm mb-4 mt-2 md:mt-0">
            UX Design Portfolio
          </p>

          <div className="relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tighter mb-6 sm:mb-8 leading-[1.1] uppercase text-center">
              Creating intuitive designs by <br className="hidden md:block" />
              <span className="inline-block">
                Putting&nbsp;
                <span className="relative inline-block px-[0.2em] py-[0.02em] bg-white dark:bg-white/10 border-[0.05em] border-brand rounded-[0.3em] text-black dark:text-white shadow-lg align-middle -translate-y-[0.05em]">
                  Users First.
                  <motion.div
                    initial={{ opacity: 0, x: 10, y: 10 }}
                    animate={{ opacity: 1, x: 0, y: 0 }}
                    transition={{ delay: 2, duration: 0.5 }}
                    className="absolute -right-8 -bottom-4 z-[100] flex items-center pointer-events-none select-none scale-75 md:scale-90"
                  >
                    <div className="relative flex flex-col items-start translate-x-[2px] translate-y-[2px]">
                      <svg
                        width="18"
                        height="18"
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
                      <div className="bg-brand text-white text-[9px] font-bold px-3 py-1 rounded-full whitespace-nowrap shadow-lg border border-white/20 -mt-1 ml-3 relative z-[110] tracking-widest uppercase">
                        Me
                      </div>
                    </div>
                  </motion.div>
                </span>
              </span>
            </h1>

            {/* Persona Image - Floating Sticker Style - Hidden on mobile, visible on desktop */}
            <div
              className="hidden md:block absolute -bottom-12 -left-20 w-36 h-36 rotate-[-10deg] drop-shadow-2xl z-10 transition-transform hover:scale-110 duration-500 cursor-pointer select-none"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Image
                src="/assets/mylepersona.png"
                alt="Myle Persona"
                fill
                className="object-contain"
              />
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    style={{ rotate: 10 }}
                    className="absolute -top-12 left-1/2 -translate-x-1/2 bg-brand text-white text-xs font-bold px-4 py-2 rounded-xl whitespace-nowrap shadow-xl border border-white/20 z-[100]"
                  >
                    Hello, I'm Myle!
                    <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-brand rotate-45 border-r border-b border-white/20" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mt-6 sm:mt-8">
            <Link href="/resume">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand hover:bg-brand-hover text-white px-6 py-3 sm:px-10 sm:py-4 rounded-full text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-widest transition-all duration-300 shadow-xl border border-white/10"
              >
                View Resume
              </motion.button>
            </Link>
            <button
              className="bg-white/5 border border-foreground/10 text-foreground px-6 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-[10px] sm:text-xs md:text-sm uppercase tracking-widest hover:bg-black/10 dark:hover:bg-white/15 hover:border-foreground/30 transition-all duration-300 backdrop-blur-md shadow-lg"
              onClick={() =>
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Contact Me
            </button>
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
