import { env } from "cloudflare:workers";
import { NextResponse } from "next/server";
import { createSession, hasSameOrigin, sessionCookie, verifyGoogleCredential } from "../../../lib/auth";

const GOOGLE_CLIENT_ID = "584073661196-dbqod8vr2743gsq58s0qkqbg64podmb5.apps.googleusercontent.com";

export async function POST(request: Request) {
  try {
    if (!hasSameOrigin(request)) {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
    const { credential } = await request.json() as { credential?: string };
    if (!credential) return NextResponse.json({ error: "Missing credential" }, { status: 400 });
    const claims = await verifyGoogleCredential(credential, GOOGLE_CLIENT_ID);
    const now = Math.floor(Date.now() / 1000);
    const existing = await env.DB.prepare("SELECT id FROM users WHERE google_sub = ?1")
      .bind(claims.sub).first<{ id: string }>();
    const userId = existing?.id ?? crypto.randomUUID();
    await env.DB.prepare(
      `INSERT INTO users (id, google_sub, email, display_name, picture_url, created_at, updated_at)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?6)
       ON CONFLICT(google_sub) DO UPDATE SET
         email = excluded.email,
         display_name = excluded.display_name,
         picture_url = excluded.picture_url,
         updated_at = excluded.updated_at`
    ).bind(userId, claims.sub, claims.email, claims.name ?? claims.email.split("@")[0], claims.picture ?? null, now).run();
    const session = await createSession(userId);
    const response = NextResponse.json({
      user: { id: userId, email: claims.email, displayName: claims.name ?? claims.email.split("@")[0], pictureUrl: claims.picture ?? null },
    });
    response.headers.set("Set-Cookie", sessionCookie(session.token, session.expiresAt));
    return response;
  } catch (error) {
    console.error("Google login failed", error);
    return NextResponse.json({ error: "Google登入驗證失敗，請稍後重試。" }, { status: 401 });
  }
}
