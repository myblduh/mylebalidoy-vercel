"use client"

import Link from "next/link"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrolled])

  return (
    <nav
      className={`hidden md:flex justify-around items-center h-20 w-full z-50 transition-all duration-300 fixed top-0 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95"
      }`}
    >
      <div className="logo">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={100}
          height={50}
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div>
        <ul className="nav-links flex gap-8 list-none text-lg">
          <li>
            <Link
              href="#about"
              className="text-black no-underline hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-300"
            >
              About
            </Link>
          </li>
          <li>
            <Link
              href="#skills"
              className="text-black no-underline hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-300"
            >
              Skills
            </Link>
          </li>
          <li>
            <Link
              href="#certifications"
              className="text-black no-underline hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-300"
            >
              Certifications
            </Link>
          </li>
          <li>
            <Link
              href="#projects"
              className="text-black no-underline hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-300"
            >
              Projects
            </Link>
          </li>
          <li>
            <Link
              href="#designs"
              className="text-black no-underline hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-300"
            >
              Designs
            </Link>
          </li>
          <li>
            <Link
              href="#contact"
              className="text-black no-underline hover:text-gray-500 hover:underline hover:underline-offset-4 hover:decoration-gray-300"
            >
              Contact
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}
