"use client";

import Link from "next/link";
import { Github, Linkedin, Mail, ArrowUpRight, Palette } from "lucide-react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";

const ShaderGradientCanvas = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradientCanvas),
  { ssr: false },
);

const ShaderGradient = dynamic(
  () => import("@shadergradient/react").then((mod) => mod.ShaderGradient),
  { ssr: false },
);
import { useInView } from "framer-motion";

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px 500px 0px" });
  const currentYear = new Date().getFullYear();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section
      ref={ref}
      id="contact"
      className="relative flex flex-col justify-between px-6 md:px-20 min-h-screen overflow-hidden bg-gradient-to-b from-zinc-950 via-[#000d1a] to-[#00050d] text-white pt-32 pb-12"
    >
      {/* Background Gradient */}
      <div
        className="absolute top-0 left-0 w-full h-full z-0 opacity-40 mix-blend-screen"
        style={{ pointerEvents: "none" }}
      >
        {mounted && (
          <ShaderGradientCanvas
            style={{ pointerEvents: "none" }}
            pointerEvents="none"
            lazyLoad={false}
            pixelDensity={0.5}
          >
            <ShaderGradient
              animate={isInView ? "on" : "off"}
              enableTransition={false}
              brightness={1.1}
              color1="#5606ff" // Purple
              color2="#fe8989" // Peach/Pink
              color3="#000000" // Black background
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
        )}
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 grid lg:grid-cols-2 gap-12 sm:gap-20 items-center w-full max-w-7xl mx-auto my-auto pt-10 md:pt-0">
        {/* Left Column - Large Typography Title */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="w-full text-center lg:text-left"
        >
          <span className="text-[10px] md:text-sm uppercase tracking-[0.4em] text-brand mb-6 block font-bold">
            Open to opportunities
          </span>
          <h2 className="text-5xl md:text-6xl lg:text-[6vw] font-bold leading-[0.85] tracking-tighter text-white">
            TURNING <br className="hidden lg:block" />
            <span className="text-purple-500">IDEAS</span> INTO{" "}
            <br className="hidden lg:block" />
            <span className="text-purple-500">SOLUTIONS.</span>
          </h2>
        </motion.div>

        {/* Right Column - Premium Link Cards (with inline styles matching Myle's theme) */}
        <motion.div
          className="flex flex-col gap-3 md:gap-4 w-full"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
        >
          <Link
            href="https://www.behance.net/mylebalidoy/"
            className="group flex items-center justify-between p-4 md:p-6 rounded-2xl bg-white/5 hover:bg-brand/20 border border-white/10 hover:border-brand/50 transition-all duration-300 backdrop-blur-md"
          >
            <div>
              <p className="text-[10px] md:text-xs text-brand font-semibold mb-0.5 md:mb-1 uppercase tracking-widest">
                Behance
              </p>
              <p className="text-sm sm:text-base md:text-xl text-white font-medium group-hover:text-purple-300 transition-colors">
                behance.net/mylebalidoy
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </Link>

          <a
            href="https://www.linkedin.com/in/mylebalidoy/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 md:p-6 rounded-2xl bg-white/5 hover:bg-brand/20 border border-white/10 hover:border-brand/50 transition-all duration-300 backdrop-blur-md"
          >
            <div>
              <p className="text-[10px] md:text-xs text-brand font-semibold mb-0.5 md:mb-1 uppercase tracking-widest">
                LinkedIn
              </p>
              <p className="text-sm sm:text-base md:text-xl text-white font-medium group-hover:text-purple-300 transition-colors">
                linkedin.com/in/mylebalidoy
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>

          <a
            href="https://github.com/myblduh"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between p-4 md:p-6 rounded-2xl bg-white/5 hover:bg-brand/20 border border-white/10 hover:border-brand/50 transition-all duration-300 backdrop-blur-md"
          >
            <div>
              <p className="text-[10px] md:text-xs text-brand font-semibold mb-0.5 md:mb-1 uppercase tracking-widest">
                GitHub
              </p>
              <p className="text-sm sm:text-base md:text-xl text-white font-medium group-hover:text-purple-300 transition-colors">
                github.com/myblduh
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>

          <a
            href="mailto:mylebalidoy@gmail.com"
            className="group flex items-center justify-between p-4 md:p-6 rounded-2xl bg-white/5 hover:bg-brand/20 border border-white/10 hover:border-brand/50 transition-all duration-300 backdrop-blur-md"
          >
            <div>
              <p className="text-[10px] md:text-xs text-brand font-semibold mb-0.5 md:mb-1 uppercase tracking-widest">
                Email
              </p>
              <p className="text-sm sm:text-base md:text-xl text-white font-medium group-hover:text-purple-300 transition-colors">
                mylebalidoy@gmail.com
              </p>
            </div>
            <ArrowUpRight className="w-5 h-5 md:w-6 md:h-6 text-white/50 group-hover:text-brand group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </a>
        </motion.div>
      </div>

      {/* Integrated Footer Bottom Line */}
      <div className="relative z-10 max-w-7xl w-full mx-auto border-t border-white/10 pt-8 mt-20 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex-1 flex justify-start order-2 md:order-1">
          <div className="relative h-8 w-24">
            {mounted && (
              <Image
                src="/assets/light.png"
                alt="Myle Balidoy Logo"
                fill
                sizes="96px"
                className="object-contain"
              />
            )}
          </div>
        </div>

        {/* Center - Social Icons */}
        <div className="flex flex-1 justify-center items-center gap-6 order-1 md:order-2">
          <a
            href="https://github.com/myblduh"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors hover:scale-110 duration-300"
          >
            <Github className="w-6 h-6" />
          </a>
          <a
            href="https://www.linkedin.com/in/mylebalidoy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors hover:scale-110 duration-300"
          >
            <Linkedin className="w-6 h-6" />
          </a>
          <a
            href="https://www.behance.net/mylebalidoy/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white transition-colors hover:scale-110 duration-300 flex items-center justify-center"
          >
            <Palette className="w-6 h-6" />
          </a>
          <a
            href="mailto:mylebalidoy@gmail.com"
            className="text-white/50 hover:text-white transition-colors hover:scale-110 duration-300"
          >
            <Mail className="w-6 h-6" />
          </a>
        </div>

        {/* Right - Copyright Info */}
        <div className="flex-1 flex justify-end text-right order-3">
          <p className="text-[10px] md:text-xs text-white/30 uppercase tracking-[0.2em] font-medium">
            © {currentYear}
          </p>
        </div>
      </div>
    </section>
  );
}
