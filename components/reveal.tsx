"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Hydration-safe: always false on the server and first client render, then reads the OS setting after mount. */
function usePrefersReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const on = () => setReduce(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/**
 * Scroll-linked reveal. Unlike a one-shot reveal this re-plays in BOTH
 * directions: elements fade/slide in as they enter the viewport and ease
 * back out when they leave it (scroll up or down).
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 40,
  x = 0,
  scale = 1,
  once = true,
  amount = 0.2,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  x?: number;
  scale?: number;
  once?: boolean;
  amount?: number;
  as?: "div" | "li" | "section" | "article" | "p" | "span";
}) {
  const reduce = usePrefersReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  // Same element tree for everyone (SSR-safe). Reduced-motion users get the
  // same reveal but instantly, never a swapped-out element that stays hidden.
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y, x, scale }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once, amount: Math.min(amount, 0.15) }}
      // reduced motion keeps the fade but drops the movement
      transition={
        reduce
          ? { duration: 0.7, delay, ease: EASE, y: { duration: 0 }, x: { duration: 0 }, scale: { duration: 0 } }
          : { duration: 0.8, delay, ease: EASE }
      }
    >
      {children}
    </Comp>
  );
}

/** Splits a heading into words that rise in one after another. */
export function WordReveal({
  text,
  className,
  highlight = [],
  once = true,
}: {
  text: string;
  className?: string;
  /** words (exact match, punctuation ignored) rendered in the serif italic */
  highlight?: string[];
  once?: boolean;
}) {
  const reduce = usePrefersReducedMotion();
  const words = text.split(" ");
  const hl = new Set(highlight.map((w) => w.toLowerCase().replace(/[^a-z0-9&]/g, "")));
  // The viewport observer sits on the (unclipped) outer element. Observing the
  // clipped inner words never reports them as visible, which left headings blank.
  return (
    <motion.span
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.3 }}
      transition={{ staggerChildren: reduce ? 0.03 : 0.06 }}
    >
      {words.map((w, i) => {
        const isHl = hl.has(w.toLowerCase().replace(/[^a-z0-9&]/g, ""));
        const inner = isHl ? <span className="hl">{w}</span> : w;
        return (
          <span
            key={i}
            aria-hidden
            className="inline-block overflow-hidden align-bottom px-[0.12em] -mx-[0.12em] pt-[0.1em] -mt-[0.1em] pb-[0.25em] -mb-[0.25em]"
          >
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "110%", opacity: 0 },
                show: {
                  y: 0,
                  opacity: 1,
                  transition: reduce
                    ? { duration: 0.6, ease: EASE, y: { duration: 0 } }
                    : { duration: 0.7, ease: EASE },
                },
              }}
            >
              {inner}
            </motion.span>
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </motion.span>
  );
}

/** Subtle vertical parallax tied to scroll position. */
export function Parallax({
  children,
  className,
  distance = 40,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = usePrefersReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [distance, -distance]);
  return (
    <div ref={ref} className={className}>
      <motion.div style={reduce ? undefined : { y }}>{children}</motion.div>
    </div>
  );
}

/** Thin brand-colored reading progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[120] h-[3px] w-full origin-left bg-brand pointer-events-none"
    />
  );
}

/** Section eyebrow: serif numeral + Inter label. */
export function Eyebrow({ n, label }: { n: string; label: string }) {
  return (
    <div className="mb-4 flex items-baseline gap-1.5">
      <span className="font-display text-brand text-lg italic">{n}</span>
      <span className="h-px w-3 self-center bg-brand/40" />
      <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-foreground/50">
        {label}
      </span>
    </div>
  );
}
