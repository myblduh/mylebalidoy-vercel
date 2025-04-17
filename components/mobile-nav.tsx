"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

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
      id="hamburger-nav"
      className={`md:hidden flex justify-between items-center px-6 py-4 w-full z-50 transition-all duration-300 fixed top-0 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95"
      }`}
    >
      <div className="logo">
        <Image
          src="/assets/logo.png"
          alt="Logo"
          width={80}
          height={40}
          className="transition-transform duration-300 hover:scale-110"
        />
      </div>
      <div className="hamburger-menu relative">
        <div
          className={`hamburger-icon flex flex-col justify-between h-6 w-8 cursor-pointer ${isOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span
            className={`w-full h-0.5 bg-black transition-all duration-300 ${isOpen ? "rotate-45 translate-y-2.5" : ""}`}
          ></span>
          <span className={`w-full h-0.5 bg-black transition-all duration-300 ${isOpen ? "opacity-0" : ""}`}></span>
          <span
            className={`w-full h-0.5 bg-black transition-all duration-300 ${isOpen ? "-rotate-45 -translate-y-2.5" : ""}`}
          ></span>
        </div>
        <div
          className={`menu-links absolute top-full right-0 bg-white w-56 rounded-lg shadow-md transition-all duration-300 ${
            isOpen
              ? "max-h-96 opacity-100 visible transform translate-y-0"
              : "max-h-0 opacity-0 invisible transform -translate-y-2"
          }`}
        >
          <ul className="py-2">
            <li className="py-1">
              <Link
                href="#about"
                className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                About
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="#skills"
                className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                Skills
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="#projects"
                className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                Projects
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="#designs"
                className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                Designs
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="#certifications"
                className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                Certifications
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="#contact"
                className="block px-4 py-2 text-black hover:bg-gray-100 rounded-md"
                onClick={toggleMenu}
              >
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}
