import { NextResponse } from "next/server";
import { clearSessionCookie, deleteCurrentSession, hasSameOrigin } from "../../../lib/auth";

export async function POST(request: Request) {
  if (!hasSameOrigin(request)) return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
  await deleteCurrentSession(request);
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", clearSessionCookie());
  return response;
}
