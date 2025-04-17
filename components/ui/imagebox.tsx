"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X } from "lucide-react"

interface ImageboxProps {
  src: string
  alt: string
  isOpen: boolean
  onClose: () => void
}

export default function Imagebox({ src, alt, isOpen, onClose }: ImageboxProps) {
  // Close on escape key press
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1 text-white transition-colors hover:bg-black/70"
          onClick={onClose}
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="relative h-auto max-h-[85vh] w-auto max-w-[85vw]">
          <Image
            src={src || "/placeholder.svg"}
            alt={alt}
            width={1200}
            height={800}
            className="h-auto max-h-[85vh] w-auto max-w-[85vw] object-contain"
            priority
          />
        </div>
      </div>
    </div>
  )
}
