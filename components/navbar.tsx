"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./theme-toggle";
import { useTheme } from "next-themes";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 10);

      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setHidden(true);
      } else if (currentScrollY < lastScrollY) {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileMenuOpen]);

  const handleNavClick = () => setMobileMenuOpen(false);

  const navItems = [
    { name: "Designs", href: "#designs" },
    { name: "Projects", href: "#projects" },
    { name: "About", href: "#about" },
    { name: "Skills", href: "#skills" },
    { name: "Certifications", href: "#certifications" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <>
      <header
        className={`fixed left-0 top-0 w-full z-[110] transition-all duration-500 ease-in-out pointer-events-none ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "py-4 shadow-sm bg-background/70 dark:bg-[#0a0a0a]/70 backdrop-blur-lg"
            : "py-6 bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 md:px-12 w-full gap-4">
          <div className="flex items-center flex-1">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Toggle Menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden text-black hover:bg-black/5 dark:text-white dark:hover:bg-white/5 mr-4 transition-colors duration-300 pointer-events-auto"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {!mobileMenuOpen && (
              <Link aria-label="Logo" href="/" className="pointer-events-auto">
                <div className="relative h-12 w-12 transition-transform duration-300 hover:scale-110">
                  {/* Light theme logo */}
                  <Image
                    src="/assets/dark.png"
                    alt="Logo"
                    fill
                    sizes="48px"
                    priority
                    className="object-contain block dark:hidden"
                  />
                  <Image
                    src="/assets/light.png"
                    alt="Logo"
                    fill
                    sizes="48px"
                    priority
                    className="object-contain hidden dark:block"
                  />
                </div>
              </Link>
            )}
          </div>

          <div className="hidden lg:flex justify-center flex-none">
            <nav
              className={`header-nav pointer-events-auto ${
                scrolled
                  ? "bg-black/5 dark:bg-white/5 backdrop-blur-xl shadow-lg border-transparent dark:border dark:border-white/10"
                  : "bg-transparent border-transparent"
              }`}
            >
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  aria-label={item.name}
                  href={item.href}
                  className="nav-link text-black/70 hover:text-brand hover:bg-black/5 dark:text-white dark:hover:text-brand dark:hover:bg-white/10"
                >
                  {item.name}
                </Link>
              ))}
              <div className="ml-4 pl-4 border-l-0 dark:border-l dark:border-white/10 flex items-center">
                <ThemeToggle />
              </div>
            </nav>
          </div>

          <div className="flex justify-end flex-1 items-center gap-4">
            <div className="lg:hidden pointer-events-auto">
              <ThemeToggle />
            </div>
            <div className="relative group hidden md:block pointer-events-auto">
              <Link href="/resume">
                <Button className="font-bold tracking-widest uppercase text-xs rounded-full px-8 py-5 transition-all duration-300 overflow-hidden relative bg-black text-white hover:bg-black/90 shadow-xl dark:bg-brand dark:hover:bg-brand/90 dark:shadow-[0_0_20px_rgba(139,92,246,0.3)] dark:hover:shadow-[0_0_30px_rgba(139,92,246,0.5)]">
                  <span className="relative z-10">Resume</span>
                </Button>
              </Link>

              <div className="absolute top-full right-0 mt-6 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 w-[280px] backdrop-blur-xl border border-foreground/10 rounded-[24px] p-6 shadow-2xl translate-y-2 group-hover:translate-y-0 overflow-hidden bg-white/95 dark:bg-background/95">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center -space-x-3 hover:space-x-1 transition-all duration-300">
                    {[
                      { src: "/assets/mylepersona.png", alt: "Myle Persona" },
                      {
                        src: "/assets/certs/badge1.png",
                        alt: "Google Agile Essentials",
                      },
                      {
                        src: "/assets/certs/badge3.png",
                        alt: "Microsoft UX Design",
                      },
                      { src: "/assets/designs/trackify.png", alt: "Trackify" },
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-background bg-foreground/5 hover:z-20 hover:scale-[1.2] transition-all duration-300 shadow-[0_0_10px_rgba(139,92,246,0.2)]"
                        style={{ zIndex: 10 - i }}
                      >
                        <Image
                          src={item.src}
                          alt={item.alt}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center space-y-1 mb-2">
                  <p className="text-foreground text-sm font-bold tracking-tight">
                    My Digital Resume
                  </p>
                  <p className="text-foreground/50 text-[11px] leading-relaxed">
                    View my professional journey, skills, and certifications in
                    detail.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] md:hidden bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl">
          <div className="flex flex-col h-full pt-28 pb-8 px-8 overflow-y-auto">
            <ul className="flex flex-col gap-8">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    aria-label={item.name}
                    onClick={handleNavClick}
                    href={item.href}
                    className="mobile-nav-link text-foreground/80 hover:text-brand dark:text-white dark:hover:text-brand"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  aria-label="Resume"
                  onClick={handleNavClick}
                  href="/resume"
                  className="mobile-nav-link text-brand hover:text-brand/80"
                >
                  Resume
                </Link>
              </li>
            </ul>
          </div>
        </div>
      )}
    </>
  );
}
