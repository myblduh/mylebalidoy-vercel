import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[640px] w-[640px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: "radial-gradient(closest-side, rgba(139,92,246,0.2), transparent)" }}
      />

      <div className="relative z-10 text-center">
        <h1 className="font-display text-8xl italic leading-none text-brand md:text-9xl">404</h1>
        <p className="mt-5 text-xl font-semibold tracking-tight md:text-2xl">Page not found</p>
        <p className="mx-auto mt-2 max-w-sm text-sm text-foreground/60 md:text-base">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
          <Link href="/" className="pill-button !px-6 !py-3 !text-sm">
            Return to home
          </Link>
          <Link
            href="/resume"
            className="inline-flex items-center justify-center rounded-full border border-foreground/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
          >
            View resume
          </Link>
        </div>
      </div>
    </main>
  );
}
