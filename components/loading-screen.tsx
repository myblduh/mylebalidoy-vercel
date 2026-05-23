"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function LoadingScreen({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Lock scrolling on html and body when loader is active
    document.documentElement.style.overflow = "hidden"
    document.body.style.overflow = "hidden"

    const timer = setTimeout(() => {
      setLoading(false)
      document.documentElement.style.overflow = ""
      document.body.style.overflow = ""
    }, 600) // Made loading faster

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
      
      <AnimatePresence>
        {loading && (
          <motion.div
            id="global-loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative w-32 h-32"
            >
              <Image
                src="/assets/light.png"
                alt="Loading..."
                fill
                sizes="128px"
                className="object-contain animate-pulse"
                priority
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={loading ? "hidden" : "block"}>
        {children}
      </div>
    </>
  )
}
