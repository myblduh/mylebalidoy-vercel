"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimationControls } from "framer-motion";
import { Check, Lock } from "lucide-react";

type Status =
  | { kind: "idle" }
  | { kind: "checking" }
  | { kind: "wrong"; remaining: number }
  | { kind: "locked"; seconds: number }
  | { kind: "error" }
  | { kind: "ok" };

const LEN = 4;

/**
 * The gallery's lock screen. This is all the server sends until the code is correct:
 * no gallery data and no image links are included in the page.
 */
export default function GalleryLock() {
  const router = useRouter();
  const [digits, setDigits] = useState<string[]>(Array(LEN).fill(""));
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const shake = useAnimationControls();

  useEffect(() => {
    refs.current[0]?.focus();
  }, []);

  // Count the lockout down
  useEffect(() => {
    if (status.kind !== "locked") return;
    if (status.seconds <= 0) {
      setStatus({ kind: "idle" });
      return;
    }
    const t = setTimeout(
      () => setStatus({ kind: "locked", seconds: status.seconds - 1 }),
      1000,
    );
    return () => clearTimeout(t);
  }, [status]);

  const locked = status.kind === "locked";
  const busy = status.kind === "checking" || status.kind === "ok";

  async function submit(code: string) {
    setStatus({ kind: "checking" });
    try {
      const res = await fetch("/api/gallery-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus({ kind: "ok" });
        // The server now sees the cookie, so this render includes the gallery.
        setTimeout(() => window.location.reload(), 600);
        return;
      }
      if (res.status === 429) {
        setStatus({ kind: "locked", seconds: data.retryAfter ?? 30 });
      } else if (res.status === 401) {
        setStatus({ kind: "wrong", remaining: data.remaining ?? 0 });
      } else {
        setStatus({ kind: "error" });
      }
    } catch {
      setStatus({ kind: "error" });
      return reset(false);
    }
    await shake.start({
      x: [0, -12, 12, -9, 9, -5, 5, 0],
      transition: { duration: 0.5 },
    });
    reset(true);
  }

  function reset(refocus: boolean) {
    setDigits(Array(LEN).fill(""));
    if (refocus) refs.current[0]?.focus();
  }

  function setAt(i: number, v: string) {
    const clean = v.replace(/\D/g, "");
    if (!clean) {
      setDigits((d) => d.map((x, k) => (k === i ? "" : x)));
      return;
    }
    // Typing or pasting several digits fills the boxes in order
    const next = [...digits];
    clean
      .slice(0, LEN - i)
      .split("")
      .forEach((c, k) => (next[i + k] = c));
    setDigits(next);
    const last = Math.min(i + clean.length, LEN - 1);
    refs.current[last]?.focus();
    if (next.every(Boolean)) submit(next.join(""));
  }

  const message =
    status.kind === "wrong"
      ? status.remaining > 0
        ? `That code isn't right. ${status.remaining} ${status.remaining === 1 ? "try" : "tries"} left.`
        : "That code isn't right."
      : status.kind === "locked"
        ? `Too many wrong tries. Try again in ${status.seconds}s.`
        : status.kind === "error"
          ? "Something went wrong. Please try again."
          : status.kind === "ok"
            ? "Unlocked"
            : "Enter the 4-digit code to continue.";

  const tone =
    status.kind === "wrong" || status.kind === "locked" || status.kind === "error"
      ? "text-rose-500"
      : status.kind === "ok"
        ? "text-emerald-500"
        : "text-foreground/55";

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm rounded-[32px] border border-foreground/10 bg-white p-8 text-center shadow-2xl dark:bg-[#16161a] sm:p-10"
      >
        <div
          className={`mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full transition-colors duration-500 ${
            status.kind === "ok" ? "bg-emerald-500/15 text-emerald-500" : "bg-brand/10 text-brand"
          }`}
        >
          {status.kind === "ok" ? <Check size={26} /> : <Lock size={24} />}
        </div>

        <h1 className="text-2xl font-bold tracking-tight">
          My <span className="hl">gallery</span>
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-foreground/55">
          This gallery is private. Enter the code to view it.
        </p>

        <motion.div animate={shake} className="mt-8 flex justify-center gap-3">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={d}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={LEN}
              type="password"
              aria-label={`Digit ${i + 1}`}
              disabled={locked || busy}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Backspace" && !digits[i] && i > 0) {
                  refs.current[i - 1]?.focus();
                  setDigits((x) => x.map((v, k) => (k === i - 1 ? "" : v)));
                }
                if (e.key === "ArrowLeft" && i > 0) refs.current[i - 1]?.focus();
                if (e.key === "ArrowRight" && i < LEN - 1) refs.current[i + 1]?.focus();
              }}
              className={`h-14 w-12 rounded-2xl border-2 bg-transparent text-center text-xl font-semibold outline-none transition-colors sm:h-16 sm:w-14 ${
                status.kind === "wrong" || status.kind === "locked"
                  ? "border-rose-500/60"
                  : status.kind === "ok"
                    ? "border-emerald-500"
                    : "border-foreground/15 focus:border-brand"
              } disabled:opacity-60`}
            />
          ))}
        </motion.div>

        <p className={`mt-5 min-h-[20px] text-sm font-medium ${tone}`} role="status" aria-live="polite">
          {status.kind === "checking" ? "Checking…" : message}
        </p>

        <a
          href="mailto:mylebalidoy@gmail.com?subject=Gallery%20access"
          className="mt-6 inline-block text-xs font-semibold text-foreground/45 transition-colors hover:text-brand"
        >
          Don&apos;t have the code? Ask me →
        </a>
      </motion.div>
    </div>
  );
}
