import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Navbar from "@/components/navbar";
import PrototypeFrame from "@/components/prototype-frame";
import { Reveal, Eyebrow } from "@/components/reveal";
import {
  designs,
  getDesign,
  getNeighbors,
  getPrototypeLink,
  figmaEmbedUrl,
  splitTitle,
} from "@/lib/designs";

export function generateStaticParams() {
  return designs.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDesign(slug);
  if (!d) return {};
  if (d.confidential) {
    // Client work: reachable by link, but kept out of search and social previews.
    return {
      title: splitTitle(d.title).name,
      robots: { index: false, follow: false, nocache: true },
    };
  }
  return {
    title: splitTitle(d.title).name,
    description: d.description.slice(0, 160),
    alternates: { canonical: `/designs/${d.slug}` },
    openGraph: { images: [{ url: d.image }] },
  };
}

export default async function DesignPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const d = getDesign(slug);
  if (!d) notFound();

  const { name, tagline } = splitTitle(d.title);
  const proto = getPrototypeLink(d);
  const embed = proto ? figmaEmbedUrl(proto.url, d.platform === "mobile") : null;
  const { prev, next } = getNeighbors(d.slug);
  const mobile = d.platform === "mobile";
  const otherLinks = d.links.filter((l) => l !== proto);

  // small images (under 700px wide) sit side by side so they are never stretched past their native size
  const figureRows: NonNullable<typeof d.figures>[] = [];
  for (const fig of d.figures ?? []) {
    const last = figureRows[figureRows.length - 1];
    if (fig.width < 700 && last && last[0].width < 700 && last.length < 3) last.push(fig);
    else figureRows.push([fig]);
  }

  const details = (
    <>
      <Reveal>
        <p className="text-lg leading-relaxed text-foreground/80 md:text-xl">
          {d.description}
        </p>
      </Reveal>

      <Reveal className="mt-14">
        <Eyebrow n="01" label="Overview" />
        <div className="space-y-5 text-[15px] leading-[1.8] text-foreground/65">
          {d.overview.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </Reveal>

      {d.challenge && (
        <Reveal className="mt-10">
          <p className="rounded-3xl border border-brand/30 bg-brand/5 p-6 font-display text-xl italic leading-snug text-foreground md:text-2xl">
            {d.challenge}
          </p>
        </Reveal>
      )}

      {d.figures && d.figures.length > 0 && (
        <div className="mt-16">
          <Reveal>
            <Eyebrow n="02" label="Design assets" />
          </Reveal>
          <div className="space-y-6">
            {figureRows.map((row, ri) => (
              <div
                key={ri}
                className={row.length > 1 ? "grid grid-cols-1 gap-4 sm:grid-cols-3" : ""}
              >
                {row.map((f) => (
                  <Reveal key={f.src} y={24}>
                    <div className="overflow-hidden rounded-3xl border border-foreground/10 bg-white dark:bg-[#16161a]">
                      <Image
                        src={f.src}
                        alt={f.caption}
                        width={f.width}
                        height={f.height}
                        quality={100}
                        sizes={row.length > 1 ? "(max-width: 640px) 100vw, 260px" : "(max-width: 1024px) 100vw, 800px"}
                        className="h-auto w-full"
                        draggable={false}
                      />
                    </div>
                    <p className="mt-2 px-1 text-xs text-foreground/50">{f.caption}</p>
                  </Reveal>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-16">
        <Reveal>
          <Eyebrow n={d.figures?.length ? "03" : "02"} label="Behind the scenes" />
        </Reveal>
        <ol className="space-y-4">
          {d.behindTheScenes.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.05} x={-24} y={16}>
              <div className="flex gap-5 rounded-3xl border border-foreground/10 bg-foreground/[0.03] p-6">
                <span className="font-display text-4xl italic leading-none text-brand">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="mb-1.5 text-base font-semibold text-foreground">
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-foreground/60">
                    {s.text}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>

      {d.results && d.results.length > 0 && (
        <Reveal className="mt-16">
          <Eyebrow n={d.figures?.length ? "04" : "03"} label="Results" />
          <ul className="space-y-3 text-[15px] leading-[1.8] text-foreground/65">
            {d.results.map((r) => (
              <li key={r} className="flex gap-3">
                <span className="mt-[0.7em] h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                {r}
              </li>
            ))}
          </ul>
        </Reveal>
      )}

      {otherLinks.length > 0 && (
        <Reveal className="mt-14 flex flex-wrap gap-3">
          {otherLinks.map((l) => (
            <a
              key={l.url}
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-foreground/15 px-6 py-3 text-sm font-semibold transition-colors hover:border-brand hover:text-brand"
            >
              {l.text}
              <ArrowUpRight size={16} />
            </a>
          ))}
        </Reveal>
      )}
    </>
  );

  return (
    <main className="min-h-screen">
      <Navbar />

      <article className="mx-auto max-w-7xl px-6 pb-24 pt-28 md:px-12 md:pt-36 lg:px-20">
        <Reveal y={16}>
          <Link
            href="/#designs"
            className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-foreground/50 transition-colors hover:text-brand"
          >
            <ArrowLeft size={16} /> All designs
          </Link>
        </Reveal>

        {/* Title block */}
        <header className="mb-10 max-w-4xl md:mb-14">
          <Reveal>
            <div className="mb-5 flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-foreground/50">
              <span>{d.date}</span>
              <span className="h-1 w-1 rounded-full bg-brand" />
              <span>{d.role}</span>
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h1 className="text-4xl font-bold leading-[1.05] tracking-tighter md:text-6xl lg:text-7xl">
              <span className="hl">{name}</span>
            </h1>
          </Reveal>
          {tagline && (
            <Reveal delay={0.1}>
              <p className="mt-4 text-xl font-medium text-foreground/70 md:text-2xl">
                {tagline}
              </p>
            </Reveal>
          )}
          <Reveal delay={0.15} className="mt-6 flex flex-wrap items-center gap-2">
            {d.award && (
              <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-600 dark:text-amber-300">
                🏆 {d.award}
              </span>
            )}
            {d.skills.map((s) => (
              <span
                key={s}
                className="tag-purple rounded-full px-3 py-1 text-xs font-medium"
              >
                {s}
              </span>
            ))}
          </Reveal>
        </header>

        {/* Prototype first on small screens. On desktop: mobile-app prototypes
            sit in a sticky right column; web prototypes span the full width on top. */}
        {mobile ? (
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:order-2 lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <Reveal scale={0.96}>
                  <PrototypeFrame
                    embedUrl={embed}
                    poster={d.image}
                    title={name}
                    platform="mobile"
                  />
                </Reveal>
              </div>
            </div>
            <div className="lg:order-1 lg:col-span-7">{details}</div>
          </div>
        ) : (
          <>
            <Reveal scale={0.98}>
              <PrototypeFrame
                embedUrl={embed}
                poster={d.image}
                title={name}
                platform="web"
              />
            </Reveal>
            <div className="mx-auto mt-16 max-w-3xl">{details}</div>
          </>
        )}

        {/* Next / previous */}
        <nav className="mt-28 grid gap-4 border-t border-foreground/10 pt-10 md:grid-cols-2">
          {[
            { d: prev, label: "Previous", icon: <ArrowLeft size={18} /> },
            { d: next, label: "Next", icon: <ArrowRight size={18} /> },
          ].map(({ d: n, label, icon }) => (
            <Reveal key={label}>
              <Link
                href={`/designs/${n.slug}`}
                className="group flex items-center justify-between gap-4 rounded-3xl border border-foreground/10 p-6 transition-colors hover:border-brand"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-foreground/40">
                    {label}
                  </p>
                  <p className="mt-1 truncate font-display text-xl italic group-hover:text-brand">
                    {n.title}
                  </p>
                </div>
                <span className="text-brand">{icon}</span>
              </Link>
            </Reveal>
          ))}
        </nav>
      </article>
    </main>
  );
}
