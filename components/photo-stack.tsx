"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { playFlip } from "@/lib/sound";

const PHOTOS = [
  {
    src: "/assets/images/image0.jpg",
    alt: "Myle at an aquarium",
    caption: "Me, at the aquarium",
    pos: "object-center",
  },
  {
    src: "/assets/images/image3.png",
    alt: "Myle holding the Trackify laptop at Protothon 2026",
    caption: "Protothon 2026",
    pos: "object-top",
  },
  {
    src: "/assets/images/image1.jpg",
    alt: "Myle at the KMC Solutions office",
    caption: "At KMC Solutions",
    pos: "object-[22%_28%]",
  },
];

// Where each card sits in the stack: 0 is the one on top.
const SLOTS = [
  { x: 0, y: 0, rotate: -3, scale: 1 },
  { x: 30, y: -16, rotate: 5, scale: 0.96 },
  { x: -28, y: -30, rotate: -9, scale: 0.92 },
];

/** A little pile of polaroids. Tap the top one and it slides to the back. */
export default function PhotoStack() {
  // order[0] is the index of the photo currently on top
  const [order, setOrder] = useState([0, 1, 2]);
  const flip = () => {
    playFlip();
    setOrder(([first, ...rest]) => [...rest, first]);
  };

  return (
    <div className="mx-auto w-[74%] max-w-[290px]">
      <div className="relative">
      {/* Invisible polaroid that gives the stack its size */}
      <div aria-hidden className="invisible rounded-md p-2.5 pb-11">
        <div className="aspect-[4/5] w-full" />
      </div>

      {PHOTOS.map((p, i) => {
        const slot = order.indexOf(i);
        const top = slot === 0;
        return (
          <motion.button
            key={p.src}
            type="button"
            onClick={top ? flip : undefined}
            tabIndex={top ? 0 : -1}
            aria-label={top ? `${p.caption}. Show the next photo` : p.caption}
            animate={SLOTS[slot]}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            style={{ zIndex: 30 - slot }}
            className={`absolute inset-0 rounded-md bg-white p-2.5 pb-11 text-left shadow-2xl dark:bg-[#f4f1ea] ${
              top ? "cursor-pointer" : "cursor-default"
            }`}
          >
            <span className="relative block aspect-[4/5] w-full overflow-hidden">
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="(max-width: 1024px) 80vw, 380px"
                className={`object-cover ${p.pos}`}
                draggable={false}
              />
            </span>
            <span className="absolute inset-x-0 bottom-3 text-center font-display text-lg italic text-black/70">
              {p.caption}
            </span>
            {top && (
              <span className="pointer-events-none absolute -top-3 left-1/2 h-6 w-24 -translate-x-1/2 rotate-2 bg-brand/30 backdrop-blur-sm" />
            )}
          </motion.button>
        );
      })}
      </div>

      <p className="relative z-0 mt-9 text-center text-xs font-medium text-foreground/45">
        Tap the photo to flip through
      </p>
    </div>
  );
}
