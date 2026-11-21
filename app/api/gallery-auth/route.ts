import { cookies } from "next/headers";
import { timingSafeEqual } from "node:crypto";
import {
  ACCESS_COOKIE,
  ACCESS_MAX_AGE,
  accessToken,
  galleryPin,
  hasAccess,
} from "@/lib/gallery";

export const dynamic = "force-dynamic";

const HEADERS = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store",
  "X-Robots-Tag": "noindex",
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: HEADERS });

/* ---- brute-force protection: 5 wrong tries, then a growing lockout, per IP ---- */
const MAX_TRIES = 5;
const attempts = new Map<string, { n: number; until: number; strikes: number }>();
const ipOf = (req: Request) =>
  (req.headers.get("x-forwarded-for") ?? "local").split(",")[0].trim();

async function setAccessCookie() {
  const jar = await cookies();
  jar.set(ACCESS_COOKIE, accessToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ACCESS_MAX_AGE,
  });
}

/** Check the code. */
export async function POST(req: Request) {
  const ip = ipOf(req);
  const now = Date.now();
  const rec = attempts.get(ip) ?? { n: 0, until: 0, strikes: 0 };

  if (rec.until > now) {
    return json({ ok: false, reason: "locked", retryAfter: Math.ceil((rec.until - now) / 1000) }, 429);
  }

  let code = "";
  try {
    const body = await req.json();
    code = typeof body?.code === "string" ? body.code : "";
  } catch {
    return json({ ok: false, reason: "bad-request" }, 400);
  }

  // A small, slightly random delay makes guessing slower and timing less useful.
  await new Promise((r) => setTimeout(r, 350 + Math.random() * 250));

  const pin = galleryPin();
  const a = Buffer.from(code);
  const b = Buffer.from(pin);
  const correct = a.length === b.length && timingSafeEqual(a, b);

  if (correct) {
    attempts.delete(ip);
    await setAccessCookie();
    return json({ ok: true });
  }

  rec.n += 1;
  if (rec.n >= MAX_TRIES) {
    rec.strikes += 1;
    rec.n = 0;
    // 30s, then 2 min, 10 min, 1 h ...
    const wait = [30, 120, 600, 3600][Math.min(rec.strikes - 1, 3)];
    rec.until = now + wait * 1000;
    attempts.set(ip, rec);
    return json({ ok: false, reason: "locked", retryAfter: wait }, 429);
  }
  attempts.set(ip, rec);
  return json({ ok: false, reason: "wrong", remaining: MAX_TRIES - rec.n }, 401);
}

/** Renew the cookie for an already-unlocked browser, so it stays unlocked indefinitely. */
export async function PUT() {
  const jar = await cookies();
  if (!hasAccess(jar.get(ACCESS_COOKIE)?.value)) return json({ ok: false }, 401);
  await setAccessCookie();
  return json({ ok: true });
}
