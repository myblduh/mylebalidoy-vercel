// Builds the confidential gallery from the raw source folder.
//   node scripts/process-gallery.mjs "/mnt/c/Users/brtan/Downloads/For Myle's Portfolio"
// Output (NOT in /public, so nothing is reachable by a plain URL):
//   private/gallery/<id>.webp     full view, native size (max 3200px wide), quality 97
//   private/gallery/<id>-t.webp   grid thumbnail, 900px wide, quality 90
//   data/gallery.generated.json   manifest (groups + variations)
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = process.argv[2];
if (!SRC) throw new Error("Pass the source folder as the first argument");
const OUT = path.resolve("private/gallery");
fs.mkdirSync(OUT, { recursive: true });

const CATEGORIES = [
  { dir: "Digital Designs", key: "digital" },
  { dir: "Social Media Graphics", key: "social" },
  { dir: "Social Media Banners", key: "banners" },
  // Huge phone-screen exports (3881x8400): 1800px wide is plenty for the viewer.
  { dir: "App Store Previews", key: "appstore", max: 1800 },
];

// ONLY=appstore processes just that category and merges it into the existing manifest.
const ONLY = process.env.ONLY;

const slug = (s) =>
  s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function watermark(w, h) {
  // Subtle diagonal tiled mark. Survives screenshots/crops far better than a corner logo.
  const step = Math.max(260, Math.round(w / 3.2));
  const size = Math.round(step / 11);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><pattern id="p" width="${step}" height="${step}" patternUnits="userSpaceOnUse" patternTransform="rotate(-28)">
      <text x="0" y="${step / 2}" font-family="Arial, Helvetica, sans-serif" font-size="${size}" font-weight="700"
        fill="#ffffff" fill-opacity="0.2" stroke="#000000" stroke-opacity="0.12" stroke-width="${size / 18}">© Myle Balidoy · Confidential</text>
    </pattern></defs>
    <rect width="100%" height="100%" fill="url(#p)"/></svg>`;
  return Buffer.from(svg);
}

async function render(file, outPath, width, quality) {
  const base = sharp(file).rotate();
  const meta = await base.metadata();
  // Small sources (phone-width exports, 320-462px) get a proper 2x Lanczos upscale plus a
  // light sharpen, so they stay crisp on retina screens instead of being blurred by the browser.
  const small = meta.width < 700;
  const w = small ? meta.width * 2 : Math.min(width, meta.width);
  const h = Math.round((meta.height * w) / meta.width);
  let pipe = base.resize({ width: w, kernel: "lanczos3" });
  if (small) pipe = pipe.sharpen({ sigma: 0.7, m1: 0.8, m2: 2 });
  const resized = await pipe.toBuffer();
  await sharp(resized)
    .webp({ quality, effort: 5, smartSubsample: true })
    .toFile(outPath);
  return { w, h };
}

const parse = (name) => {
  const stem = name.replace(/\.[^.]+$/, "");
  // "Ice Pops Mobile" / "Ice Pops Web" are variants of one design
  const dev = stem.match(/^(.*?)\s+(Mobile|Web)$/i);
  if (dev) return { title: dev[1].trim(), variant: dev[2] };
  const num = stem.match(/^(.*?)\s+(\d+)$/);
  if (num) return { title: num[1].trim(), variant: Number(num[2]) };
  return { title: stem.trim(), variant: 1 };
};

const manifest = ONLY
  ? JSON.parse(fs.readFileSync("data/gallery.generated.json", "utf8")).filter((g) => g.category !== ONLY)
  : [];
for (const cat of CATEGORIES) {
  if (ONLY && cat.key !== ONLY) continue;
  const dir = path.join(SRC, cat.dir);
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g|webp)$/i.test(f))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  const groups = new Map();
  for (const f of files) {
    const { title, variant } = parse(f);
    const gid = `${cat.key}-${slug(title)}`;
    if (!groups.has(gid)) groups.set(gid, { id: gid, category: cat.key, title, items: [] });
    const idx = groups.get(gid).items.length + 1;
    const id = `${gid}-${idx}`;
    const full = await render(path.join(dir, f), path.join(OUT, `${id}.webp`), cat.max ?? 3200, 97);
    await render(path.join(dir, f), path.join(OUT, `${id}-t.webp`), 900, 90);
    groups.get(gid).items.push({ id, variant: String(variant), w: full.w, h: full.h });
    process.stdout.write(".");
  }
  manifest.push(...groups.values());
}
fs.writeFileSync("data/gallery.generated.json", JSON.stringify(manifest, null, 1));
const bytes = fs.readdirSync(OUT).reduce((n, f) => n + fs.statSync(path.join(OUT, f)).size, 0);
console.log(
  `\n${manifest.length} groups, ${manifest.reduce((n, g) => n + g.items.length, 0)} images, ${(bytes / 1e6).toFixed(1)} MB`,
);
