"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating button that appears after scrolling down and returns to the top. */
export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Scroll to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 right-5 z-[100] flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-hover sm:bottom-8 sm:right-8 sm:h-11 sm:w-11 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <ArrowUp size={18} />
    </button>
  );
}
