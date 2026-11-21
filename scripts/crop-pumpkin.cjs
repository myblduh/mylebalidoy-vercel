// One-off: crop the transparent margin off the Pumpkin Spice images, in place, and sync the manifest.
// Boxes come from scripts/bbox.cjs (opaque design edges). Originals are backed up to /tmp/pumpkin-backup.
const sharp = require("sharp");
const fs = require("fs");
const LEFT = 77, TOP = 27, WIDTH = 639;
const HEIGHTS = { "digital-pumpkin-spice-1": 1417, "digital-pumpkin-spice-2": 1351, "digital-pumpkin-spice-3": 3955 };
(async () => {
  fs.mkdirSync("/tmp/pumpkin-backup", { recursive: true });
  const manifestPath = "data/gallery.generated.json";
  const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
  const groups = Array.isArray(manifest) ? manifest : manifest.groups;
  const grp = groups.find((g) => g.id === "digital-pumpkin-spice");
  for (const it of grp.items) {
    const height = HEIGHTS[it.id];
    for (const suffix of ["", "-t"]) {
      const p = `private/gallery/${it.id}${suffix}.webp`;
      fs.copyFileSync(p, `/tmp/pumpkin-backup/${it.id}${suffix}.webp`);
      const buf = await sharp(p).extract({ left: LEFT, top: TOP, width: WIDTH, height }).webp({ quality: 97, effort: 5, smartSubsample: true }).toBuffer();
      fs.writeFileSync(p, buf);
    }
    it.w = WIDTH;
    it.h = height;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  console.log("done");
})();
