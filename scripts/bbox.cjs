// Prints the opaque bounding box of images (default: pumpkin spice). Usage: node scripts/bbox.cjs [prefix]
const sharp = require("sharp");
const fs = require("fs");
const prefix = process.argv[2] || "digital-pumpkin-spice";
(async () => {
  for (const f of fs.readdirSync("private/gallery").filter((x) => x.startsWith(prefix))) {
    const { data, info } = await sharp("private/gallery/" + f).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    let x0 = info.width, y0 = info.height, x1 = -1, y1 = -1;
    for (let y = 0; y < info.height; y++)
      for (let x = 0; x < info.width; x++) {
        if (data[(y * info.width + x) * 4 + 3] >= 250) {
          if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y;
        }
      }
    console.log(f, info.width + "x" + info.height, "opaque box", x0, y0, x1, y1, "->", x1 - x0 + 1, "x", y1 - y0 + 1);
  }
})();
