import { readFile } from "node:fs/promises";
import path from "node:path";

/** Browsers ask for /favicon.ico on their own; answer with the site icon instead of a 404. */
export async function GET() {
  const png = await readFile(path.join(process.cwd(), "public", "assets", "mylepersona.png"));
  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
