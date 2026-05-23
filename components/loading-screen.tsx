"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Lock scrolling on html and body when loader is active
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setLoading(false)
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
      
      // Clear browser fail-safe timer if React shuts down the loader successfully
      if (typeof window !== "undefined" && (window as any).__loaderTimer) {
        clearTimeout((window as any).__loaderTimer)
      }
    }, 1500)

    return () => {
      clearTimeout(timer)
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }
  }, [])

  return (
    <>
      {/* Fallback if user has disabled javascript: hide loader immediately */}
      <noscript>
        <style dangerouslySetInnerHTML={{ __html: `#global-loader { display: none !important; }` }} />
      </noscript>
      
      {/* Fail-safe script to remove loader if hydration fails or hangs */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              var timer = setTimeout(function() {
                var loader = document.getElementById('global-loader');
                if (loader) {
                  loader.style.transition = 'opacity 0.8s ease-in-out';
                  loader.style.opacity = '0';
                  setTimeout(function() {
                    if (loader.parentNode) {
                      loader.parentNode.removeChild(loader);
                    }
                    document.documentElement.style.overflow = '';
                    document.body.style.overflow = '';
                  }, 800);
                }
              }, 3500);
              window.__loaderTimer = timer;
            })();
          `
        }}
      />
      
      <AnimatePresence>
        {loading && (
          <motion.div
            id="global-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative w-32 h-32"
            >
              <Image
                src="/assets/light.png"
                alt="Loading..."
                fill
                className="object-contain animate-pulse"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
