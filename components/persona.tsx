"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const W = 381; // canvas of the persona artwork
const H = 396;

// Eye rest positions and sizes, in artwork pixels: where the 2D persona's eyes sit.
const EYES = [
  { cx: 195, cy: 146, r: 16 }, // left lens
  { cx: 281, cy: 140, r: 15 }, // right lens
];

/**
 * The persona with plain, solid-black round eyes that follow the pointer, and a head that
 * turns toward it. The artwork is the original drawing (hair, glasses, face); only the
 * pupils were replaced by round black circles. The glasses frame is drawn over the eyes, so an
 * eye can never leave its lens.
 */
export default function Persona({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const nx = useMotionValue(0); // -1..1, pointer offset from the persona
  const ny = useMotionValue(0);
  const sx = useSpring(nx, { stiffness: 160, damping: 17, mass: 0.6 });
  const sy = useSpring(ny, { stiffness: 160, damping: 17, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent | MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const range = Math.max(window.innerWidth, window.innerHeight) * 0.3;
      nx.set(Math.tanh(dx / range));
      ny.set(Math.tanh(dy / range));
    };
    const onLeave = () => {
      nx.set(0);
      ny.set(0);
    };
    // Track only while the pointer is inside the hero section; leaving it resets the eyes.
    const hero = ref.current?.closest("section") ?? null;
    if (!hero) return;
    hero.addEventListener("pointermove", onMove as EventListener, { passive: true });
    hero.addEventListener("pointerleave", onLeave);
    hero.addEventListener("mouseleave", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove as EventListener);
      hero.removeEventListener("pointerleave", onLeave);
      hero.removeEventListener("mouseleave", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [nx, ny]);

  // Eyes travel inside the lenses (percent of the artwork: ~13px across, ~6px up/down).
  const eyeX = useTransform(sx, (v) => `${v * 3.4}%`);
  const eyeY = useTransform(sy, (v) => `${v * 1.6}%`);

  // The head turns about the neck.
  const rotY = useTransform(sx, (v) => v * 14);
  const rotX = useTransform(sy, (v) => v * -9);
  const rotZ = useTransform(sx, (v) => v * 2.5);

  const layer = "pointer-events-none absolute inset-0 h-full w-full select-none object-contain";

  return (
    <div ref={ref} className={className} style={{ perspective: 1100 }} role="img" aria-label="Myle">
      {/* inset leaves room for the turn so the persona is never clipped */}
      <motion.div
        className="absolute inset-[7%] drop-shadow-2xl"
        style={{ rotateY: rotY, rotateX: rotX, rotate: rotZ, transformOrigin: "50% 92%" }}
      >
        {/* original drawing without its flat eyes */}
        <Image src="/assets/persona-face-v4.png" alt="" fill sizes="224px" priority className={layer} draggable={false} />

        {/* plain black round eyes */}
        {EYES.map((eye, i) => (
          <motion.div key={i} className="absolute inset-0" style={{ x: eyeX, y: eyeY }}>
            <motion.div
              className="absolute inset-0"
              style={{ transformOrigin: `${(eye.cx / W) * 100}% ${(eye.cy / H) * 100}%` }}
              animate={{ scaleY: [1, 0.08, 1] }}
              transition={{ duration: 0.18, repeat: Infinity, repeatDelay: 3.8, ease: "easeInOut" }}
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
                <circle cx={eye.cx} cy={eye.cy} r={eye.r} fill="#212121" />
              </svg>
            </motion.div>
          </motion.div>
        ))}

        {/* glasses frame on top, so the eyes always stay inside the lenses */}
        <Image src="/assets/persona-glasses-v4.png" alt="" fill sizes="224px" className={layer} draggable={false} />
      </motion.div>
    </div>
  );
}
