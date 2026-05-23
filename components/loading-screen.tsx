"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function LoadingScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  // Prevent scrolling while loading
  useEffect(() => {
    if (isLoading) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      window.scrollTo(0, 0); // Force scroll to top while loading
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [isLoading]);

  useEffect(() => {
    // The total animation duration is roughly 3s
    // We'll set the "loading state" to false after the exit animations finish
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Wait 3 seconds as requested

    return () => clearTimeout(timer);
  }, []);

  const [gridX, setGridX] = useState(20);
  const [gridY, setGridY] = useState(10);
  const [shuffledDelays, setShuffledDelays] = useState<number[]>([]);

  useEffect(() => {
    // Calculate precise grid so blocks form perfect squares
    // Target a larger block size to reduce the number of DOM elements rendered on low-end devices
    const blockSize = 150;
    const x = Math.ceil(window.innerWidth / blockSize);
    const y = Math.ceil(window.innerHeight / blockSize);
    setGridX(x);
    setGridY(y);

    const totalBlocks = x * y;
    const delays = Array.from({ length: totalBlocks }).map(
      () => 1.8 + Math.random() * 0.6,
    );
    setShuffledDelays(delays);
  }, []);

  const totalBlocks = gridX * gridY;

  return (
    <>
      <noscript>
        <style
          dangerouslySetInnerHTML={{
            __html: `#global-loader { display: none !important; }`,
          }}
        />
      </noscript>

      <AnimatePresence>
        {isLoading && (
          <motion.div
            id="global-loader"
            key="loading-container"
            className="fixed inset-0 z-[9999] flex w-full h-[100dvh] pointer-events-none overflow-hidden"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1, delay: 0.8 }} // Minimal container fade after blocks dissolve
          >
            {/* Grid wrapper */}
            <div
              className="absolute inset-0 grid w-full h-full"
              style={{
                gridTemplateColumns: `repeat(${gridX}, 1fr)`,
                gridTemplateRows: `repeat(${gridY}, 1fr)`,
              }}
            >
              {shuffledDelays.length > 0 &&
                Array.from({ length: totalBlocks }).map((_, i) => (
                  <motion.div
                    key={`block-${i}`}
                    className="w-full h-full bg-black origin-center"
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                      delay: shuffledDelays[i] - 1.8, // Starts exiting immediately based on staggered delay
                    }}
                  />
                ))}
            </div>

            {/* Logo and Name Centered Display */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10"
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32">
                <Image
                  src="/assets/light.png"
                  alt="Myle Balidoy Logo"
                  fill
                  sizes="128px"
                  priority
                  className="object-contain animate-pulse"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actual Page Content */}
      <div
        className={
          isLoading ? "hidden" : "block"
        }
      >
        {children}
      </div>
    </>
  );
}
