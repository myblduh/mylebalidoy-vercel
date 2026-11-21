// Crops the transparent margin off every image of a gallery group, in place, and syncs the manifest.
// Usage: node scripts/crop-transparent.cjs <group-id>   (originals are backed up to /tmp/crop-backup)
const sharp = require("sharp");
const fs = require("fs");
const id = process.argv[2];
if (!id) throw new Error("group id required");

async function opaqueBox(file) {
  const { data, info } = await sharp(file).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
  for (let y = 0; y < info.height; y++)
    for (let x = 0; x < info.width; x++)
      if (data[(y * info.width + x) * 4 + 3] >= 250) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1, W: info.width, H: info.height };
}

(async () => {
  fs.mkdirSync("/tmp/crop-backup", { recursive: true });
  const mp = "data/gallery.generated.json";
  const manifest = JSON.parse(fs.readFileSync(mp, "utf8"));
  const groups = Array.isArray(manifest) ? manifest : manifest.groups;
  const grp = groups.find((g) => g.id === id);
  if (!grp) throw new Error("no such group " + id);
  for (const it of grp.items) {
    const full = `private/gallery/${it.id}.webp`;
    const box = await opaqueBox(full);
    console.log(it.id, `${box.W}x${box.H}`, "->", `${box.width}x${box.height}`, `(trim L${box.left} T${box.top})`);
    for (const suffix of ["", "-t"]) {
      const p = `private/gallery/${it.id}${suffix}.webp`;
      fs.copyFileSync(p, `/tmp/crop-backup/${it.id}${suffix}.webp`);
      const m = await sharp(p).metadata();
      const sx = m.width / box.W, sy = m.height / box.H; // thumbs may be a different scale
      const r = { left: Math.round(box.left * sx), top: Math.round(box.top * sy), width: Math.round(box.width * sx), height: Math.round(box.height * sy) };
      r.width = Math.min(r.width, m.width - r.left);
      r.height = Math.min(r.height, m.height - r.top);
      const buf = await sharp(p).extract(r).webp({ quality: 97, effort: 5, smartSubsample: true }).toBuffer();
      fs.writeFileSync(p, buf);
    }
    it.w = box.width;
    it.h = box.height;
  }
  fs.writeFileSync(mp, JSON.stringify(manifest, null, 2) + "\n");
})();
