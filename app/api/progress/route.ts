import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { getSessionUser, hasSameOrigin } from "../../lib/auth";

const MAX_PROGRESS_BYTES = 1_500_000;

export async function GET(request: Request) {
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const row = await env.DB.prepare("SELECT payload, updated_at AS updatedAt FROM user_progress WHERE user_id = ?1")
    .bind(user.id).first<{ payload: string; updatedAt: number }>();
  return NextResponse.json({ progress: row ? JSON.parse(row.payload) : null, updatedAt: row?.updatedAt ?? null });
}

export async function PUT(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  const user = await getSessionUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const progress = await request.json();
  const payload = JSON.stringify(progress);
  if (new TextEncoder().encode(payload).length > MAX_PROGRESS_BYTES) {
    return NextResponse.json({ error: "Progress payload too large" }, { status: 413 });
  }
  const now = Math.floor(Date.now() / 1000);
  await env.DB.prepare(
    `INSERT INTO user_progress (user_id, payload, updated_at) VALUES (?1, ?2, ?3)
     ON CONFLICT(user_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at`
  ).bind(user.id, payload, now).run();
  return NextResponse.json({ ok: true, updatedAt: now });
}
