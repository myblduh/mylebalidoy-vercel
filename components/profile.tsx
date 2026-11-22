"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Persona from "@/components/persona";
import { ArrowDown } from "lucide-react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { designs } from "@/lib/designs";
import projectsData from "@/data/projects.json";

export default function Profile() {
  const [isHovered, setIsHovered] = useState(false);
  const [isHoveredMobile, setIsHoveredMobile] = useState(false);
  const [hoveredBubble, setHoveredBubble] = useState<string | null>(null);
  const [randomBubbles, setRandomBubbles] = useState<any[]>([]);
  const randomBubblesRef = useRef<any[]>([]);
  const physicsRef = useRef<{
    [key: string]: {
      y: number;
      vy: number;
      dir: number; // +1 sinking, -1 rising
      speed: number; // cruising speed (px/s)
      sway: number; // side-to-side speed (rad/s)
      amp: number; // side-to-side distance (px)
      phase: number;
    };
  }>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const bubbleElementsRef = useRef<Map<string, HTMLElement>>(new Map());
  const getRandomLeft = (forceLeft?: boolean) => {
    // Keep bubbles in two narrow strips along the screen edges so none drift into the middle
    // (the sway adds a few more pixels, and a bubble is up to 80px wide, hence the margins)
    const isLeft = forceLeft !== undefined ? forceLeft : Math.random() > 0.5;
    return isLeft ? 1 + Math.random() * 6 : 90 + Math.random() * 4;
  };

  useEffect(() => {
    const bubbles = Array.from({ length: 16 }).map((_, i) => ({
      id: `bg-bubble-${i}-${Date.now()}`,
      initialLeft: getRandomLeft(i % 2 === 0), // percentage
      initialTop: Math.random() * 80 + 10,      // 10% to 90%
      size: Math.random() * 40 + 40, // 40px to 80px
      // Guarantee mix of up and down: index % 4 < 2 splits the directions evenly across both left and right sides
      vy: (i % 4 < 2 ? 1 : -1) * (Math.random() * 20 + 10),
      delay: i * 0.2 + Math.random() * 0.2, // Stagger spawns rapidly
    }));
    setRandomBubbles(bubbles);
  }, []);

  const playPopSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.1);

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) {
      console.log("Audio playback failed", e);
    }
  };

  const handlePop = (id: string) => {
    playPopSound();
    setRandomBubbles((prev) => prev.filter((b) => b.id !== id));

    setTimeout(() => {
      setRandomBubbles((prev) => {
        if (prev.length >= 16) return prev;
        // Force exactly 8 on each side at all times
        const leftCount = prev.filter(b => b.initialLeft <= 50).length;
        const spawnOnLeft = leftCount < 8;

        return [
          ...prev,
          {
            id: `bg-bubble-${Date.now()}-${Math.random()}`,
            initialLeft: getRandomLeft(spawnOnLeft),
            initialTop: Math.random() * 80 + 10,
            size: Math.random() * 40 + 40,
            vy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 20 + 10),
            delay: 0,
          }
        ];
      });
    }, 1000 + Math.random() * 1500);
  };

  // Physics engine for perfectly smooth edge bouncing
  useEffect(() => {
    let animationFrameId = 0;
    let lastTime = performance.now();
    let visible = true;

    const updatePhysics = (time: number) => {
      // Stop the loop entirely while the hero is off screen
      if (!visible) {
        animationFrameId = 0;
        return;
      }
      // Limit dt to max 0.1s to avoid huge jumps on tab switch
      const dt = Math.min((time - lastTime) / 1000, 0.1); 
      lastTime = time;

      if (!containerRef.current || containerRef.current.offsetHeight === 0) {
        animationFrameId = requestAnimationFrame(updatePhysics);
        return;
      }

      const w = containerRef.current.offsetWidth;
      const h = containerRef.current.offsetHeight;

      randomBubblesRef.current.forEach(bubble => {
        let p = physicsRef.current[bubble.id];
        if (!p) {
          const dir = bubble.vy >= 0 ? 1 : -1;
          p = {
            y: (bubble.initialTop / 100) * h,
            vy: bubble.vy,
            dir,
            // each bubble gets its own pace and sway so they never move in lockstep
            speed: Math.abs(bubble.vy) * 1.5 + 12,
            sway: 0.5 + Math.random() * 0.9,
            amp: 8 + Math.random() * 16,
            phase: Math.random() * Math.PI * 2,
          };
          physicsRef.current[bubble.id] = p;
        }

        const actualSize = w < 768 ? bubble.size * 0.5 : bubble.size;

        // X tracks the window width, plus a gentle sway so bubbles drift instead of sliding on rails
        const currentX =
          (bubble.initialLeft / 100) * w +
          Math.sin((time / 1000) * p.sway + p.phase) * p.amp;

        // Ease toward the cruising velocity so direction changes are smooth, not a hard flip
        p.vy += (p.dir * p.speed - p.vy) * Math.min(1, dt * 2.5);
        p.y += p.vy * dt;

        if (p.y <= 0) {
          p.y = 0;
          p.dir = 1;
        } else if (p.y + actualSize >= h) {
          p.y = h - actualSize;
          p.dir = -1;
        }

        let el = bubbleElementsRef.current.get(bubble.id);
        if (!el || !el.isConnected) {
          const found = document.getElementById(`bubble-el-${bubble.id}`);
          if (found) {
            bubbleElementsRef.current.set(bubble.id, found);
            el = found;
          }
        }
        if (el) {
          el.style.transform = `translate3d(${currentX}px, ${p.y}px, 0)`;
        }
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);

    const target = containerRef.current;
    const io = target
      ? new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          if (visible && !animationFrameId) {
            lastTime = performance.now();
            animationFrameId = requestAnimationFrame(updatePhysics);
          }
        })
      : null;
    if (target && io) io.observe(target);

    return () => {
      io?.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  randomBubblesRef.current = randomBubbles;

  // Mouse position (-1..1) drives the depth layers of the design-canvas collage
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 18 });
  const sy = useSpring(my, { stiffness: 70, damping: 18 });

  const stats = [
    { n: String(designs.length), l: "case studies" },
    { n: String(projectsData.length), l: "software projects" },
    { n: "1st", l: "Runner Up, Protothon 2026" },
  ];

  return (
    <section
      id="profile"
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-5 pb-10 pt-24 md:px-12 lg:px-20"
      onMouseMove={(e) => {
        mx.set((e.clientX / window.innerWidth - 0.5) * 2);
        my.set((e.clientY / window.innerHeight - 0.5) * 2);
      }}
    >
      {/* Canvas: soft glow + dot grid, like an empty design file */}
      <div
        className="pointer-events-none absolute right-[-10%] top-[8%] -z-10 h-[820px] w-[820px] rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.2), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-30"
        style={{
          backgroundImage: "radial-gradient(rgba(139,92,246,0.32) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: "radial-gradient(ellipse 80% 70% at 55% 45%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 55% 45%, black, transparent)",
        }}
      />

      {/* Interactive background bubbles (pop them!) */}
      <div ref={containerRef} className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
        <AnimatePresence>
          {randomBubbles.map((bubble) => (
            <div key={bubble.id} id={`bubble-el-${bubble.id}`} className="absolute left-0 top-0">
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ scale: 1.2, transition: { duration: 0.05 } }}
                transition={{
                  opacity: { duration: 1.5, ease: "easeOut", delay: bubble.delay },
                  scale: { duration: 1.5, ease: "easeOut", delay: bubble.delay },
                }}
                onClick={() => handlePop(bubble.id)}
                className="pointer-events-auto flex h-[calc(var(--bubble-size)*0.5)] w-[calc(var(--bubble-size)*0.5)] cursor-pointer items-center justify-center transition-transform hover:scale-110 active:scale-90 md:h-[var(--bubble-size)] md:w-[var(--bubble-size)]"
                style={{ "--bubble-size": `${bubble.size}px` } as React.CSSProperties}
              >
                <div className="relative h-full w-full">
                  <Image
                    src="/assets/bubble-sm.webp"
                    alt="Poppable Bubble"
                    fill
                    unoptimized
                    sizes="50px"
                    className="pointer-events-none object-contain"
                    draggable={false}
                  />
                </div>
              </motion.div>
            </div>
          ))}
        </AnimatePresence>
      </div>

      <div className="pointer-events-none relative z-30 mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        {/* ---------------- Left: type ---------------- */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto text-[1.9rem] font-bold leading-[1.1] tracking-tighter min-[400px]:text-[2.2rem] sm:text-5xl md:text-6xl lg:text-[4.1rem] xl:text-[4.7rem]"
          >
            <HoverWords text="Creating intuitive designs by putting" />
            {/* "Users First." styled as a selected layer in Figma */}
            <span className="group/uf relative inline-block cursor-default whitespace-nowrap px-2 align-baseline text-brand transition-all duration-300 hover:[text-shadow:0_0_18px_rgba(139,92,246,0.85),0_0_36px_rgba(139,92,246,0.5)]">
              <span className="hl" style={{ fontSize: "1.08em" }}>Users First.</span>
              <span className="pointer-events-none absolute inset-0 border-[1.5px] border-brand transition-shadow duration-300 group-hover/uf:shadow-[0_0_22px_rgba(139,92,246,0.55),inset_0_0_14px_rgba(139,92,246,0.18)]" aria-hidden />
              {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => (
                <span key={p} className={`pointer-events-none absolute ${p} h-2 w-2 border-[1.5px] border-brand bg-white`} aria-hidden />
              ))}
              <motion.span
                initial={{ opacity: 0, x: 10, y: 10 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                transition={{ delay: 1.6, duration: 0.5 }}
                className="pointer-events-none absolute -bottom-9 -right-8 hidden select-none flex-col items-start sm:flex"
                aria-hidden
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-brand drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]">
                  <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="currentColor" stroke="white" strokeWidth="1.2" />
                </svg>
                <span className="-mt-0.5 ml-3 rounded-full border border-white/20 bg-brand px-2 py-1 text-[8px] font-bold uppercase leading-none tracking-widest text-white shadow-lg">
                  Me
                </span>
              </motion.span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="pointer-events-auto mt-5 max-w-lg text-[13px] leading-relaxed text-foreground/60 sm:mt-7 sm:text-sm md:text-base"
          >
            <HoverWords text="An all-around designer who turns ideas into polished visuals, from web and mobile interfaces to scroll-stopping social media graphics and app store previews, and everything in between." />
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 lg:justify-start"
          >
            <button
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-[13px] font-semibold sm:px-7 sm:py-3.5 sm:text-sm text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover"
              onClick={() => document.getElementById("designs")?.scrollIntoView({ behavior: "smooth" })}
            >
              See my work
              <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
            </button>
            <Link href="/resume" prefetch={false}>
              <button className="rounded-full border border-foreground/15 bg-white/60 px-5 py-2.5 text-[13px] font-semibold sm:px-7 sm:py-3.5 sm:text-sm text-foreground backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:border-brand hover:text-brand dark:bg-white/5">
                View Resume
              </button>
            </Link>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="pointer-events-auto mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 lg:justify-start"
          >
            {stats.map((s) => (
              <div key={s.l} className="flex items-baseline gap-2">
                <dt className="font-display text-3xl italic leading-none text-brand">{s.n}</dt>
                <dd className="cursor-default text-xs font-medium text-foreground/55 transition-colors duration-200 hover:text-brand">{s.l}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        {/* ---------------- Right: the design canvas ---------------- */}
        <div className="relative mx-auto h-[205px] w-[68%] max-w-[560px] sm:h-[460px] sm:w-full lg:h-[500px]">
          <Depth sx={sx} sy={sy} d={10} className="absolute right-0 top-0 w-[76%]" rotate={4}>
            <Artboard src="/assets/designs/trackify.png" name="Trackify — Desktop" priority />
          </Depth>
          <Depth sx={sx} sy={sy} d={22} className="absolute left-0 top-[27%] z-10 w-[64%]" rotate={-5}>
            <Artboard src="/assets/designs/cosmarket.png" name="CosMarket — Mobile" />
          </Depth>
          <Depth sx={sx} sy={sy} d={36} className="absolute bottom-0 right-[3%] z-20 w-[60%]" rotate={3}>
            <Artboard src="/assets/designs/payonnect.png" name="Payonnect — App" />
          </Depth>

          {/* The persona, shown in full */}
          <Depth sx={sx} sy={sy} d={60} className="absolute bottom-[1%] left-[-2%] z-40" rotate={-6}>
            <div
              className="group relative h-24 w-24 cursor-pointer sm:h-56 sm:w-56"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Persona className="absolute inset-0 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3" />
              <AnimatePresence>
                {isHovered && (
                  <motion.span
                    initial={{ opacity: 0, y: 8, scale: 0.85 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.85 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-xl border border-white/20 bg-brand px-3 py-1.5 text-xs font-bold text-white shadow-xl"
                  >
                    Hello, I&apos;m Myle!
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </Depth>

          {/* Designer details: type specimen + color swatches */}
          <Depth sx={sx} sy={sy} d={52} className="absolute left-[2%] top-[6%] z-30" rotate={-3}>
            <div className="origin-top-left scale-[0.7] rounded-2xl border border-foreground/10 bg-white/90 px-4 py-3 shadow-xl backdrop-blur dark:bg-[#16161a]/90 sm:scale-100">
              <p className="font-display text-4xl italic leading-none text-brand">Aa</p>
              <p className="mt-1 text-[10px] font-semibold text-foreground/55">Inter · Instrument Serif</p>
            </div>
          </Depth>
          <Depth sx={sx} sy={sy} d={46} className="absolute right-[-1%] top-[44%] z-30" rotate={5}>
            <div className="flex origin-right scale-[0.7] gap-1.5 rounded-2xl border border-foreground/10 bg-white/90 p-2.5 shadow-xl backdrop-blur dark:bg-[#16161a]/90 sm:scale-100">
              {[
                "bg-[#8B5CF6]",
                "bg-[#A78BFA]",
                "bg-[#C4B5FD]",
                "bg-[#1a1a1a] dark:bg-white", // the neutral flips to white in dark mode
              ].map((c) => (
                <span key={c} className={`h-7 w-7 rounded-full border border-black/10 dark:border-white/20 ${c}`} />
              ))}
            </div>
          </Depth>

          {/* Collaborator cursors */}
          <Cursor className="left-[47%] top-[21%]" label="Myle" color="#8B5CF6" path={[0, 14, -6, 0]} />
          <Cursor className="right-[10%] bottom-[16%]" label="Users" color="#10B981" path={[0, -12, 8, 0]} delay={1.4} />
        </div>
      </div>

    </section>
  );
}

/** A layer that drifts with the mouse; bigger `d` = closer to the viewer. */
function Depth({
  sx,
  sy,
  d,
  rotate = 0,
  className,
  children,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  d: number;
  rotate?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const x = useTransform(sx, (v) => v * -d);
  const y = useTransform(sy, (v) => v * -d);
  return (
    <motion.div
      style={{ x, y, rotate }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.3 + d / 120, ease: [0.22, 1, 0.36, 1] }}
      className={`pointer-events-auto ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

/** A design "frame": named like in Figma, with selection handles on hover. */
function Artboard({ src, name, priority }: { src: string; name: string; priority?: boolean }) {
  return (
    <div className="group relative">
      <span className="absolute -top-5 left-0 hidden text-[10px] font-semibold text-foreground/45 sm:block transition-colors group-hover:text-brand">
        {name}
      </span>
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-foreground/10 bg-white shadow-2xl transition-shadow duration-300 group-hover:shadow-[0_30px_60px_-20px_rgba(139,92,246,0.5)]">
        <Image
          src={src}
          alt={name}
          fill
          sizes="(max-width: 1024px) 70vw, 420px"
          priority={priority}
          className="object-cover"
          draggable={false}
        />
      </div>
      <span className="pointer-events-none absolute inset-0 -m-px rounded-xl border border-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
      {["-left-1 -top-1", "-right-1 -top-1", "-bottom-1 -left-1", "-bottom-1 -right-1"].map((p) => (
        <span
          key={p}
          className={`pointer-events-none absolute ${p} h-2 w-2 border-[1.5px] border-brand bg-white opacity-0 transition-opacity duration-200 group-hover:opacity-100`}
        />
      ))}
    </div>
  );
}

/** A named multiplayer-style cursor that drifts around the canvas. */
function Cursor({
  className,
  label,
  color,
  path,
  delay = 0,
}: {
  className: string;
  label: string;
  color: string;
  path: number[];
  delay?: number;
}) {
  return (
    <motion.div
      className={`pointer-events-none absolute z-40 hidden select-none sm:flex ${className}`}
      animate={{ x: path, y: [...path].reverse() }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
      aria-hidden
    >
      <div className="flex flex-col items-start">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ color }} className="drop-shadow-md">
          <path d="M5.65376 12.3673H5.46026L5.31717 12.4976L0.500002 16.8829L0.500002 1.19841L11.7841 12.3673H5.65376Z" fill="currentColor" stroke="white" strokeWidth="1.2" />
        </svg>
        <span className="-mt-0.5 ml-3 rounded-full px-2.5 py-1 text-[10px] font-bold leading-none text-white shadow-lg" style={{ background: color }}>
          {label}
        </span>
      </div>
    </motion.div>
  );
}

/** Splits text into words that each turn brand-purple on hover. */
function HoverWords({ text }: { text: string }) {
  return (
    <>
      {text.split(/\s+/).filter(Boolean).map((w, i) => (
        <span key={i}>
          <span className="cursor-default transition-colors duration-200 hover:text-brand">{w}</span>{" "}
        </span>
      ))}
    </>
  );
}
