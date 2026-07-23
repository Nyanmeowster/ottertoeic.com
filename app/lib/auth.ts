import { env } from "cloudflare:workers";

export const SESSION_COOKIE = "otter_toeic_session";
const SESSION_AGE_SECONDS = 60 * 60 * 24 * 30;

type GoogleClaims = {
  sub: string;
  email: string;
  email_verified: boolean;
  name?: string;
  picture?: string;
  aud: string;
  iss: string;
  exp: number;
};

function base64UrlBytes(value: string) {
  const normalized = value.replaceAll("-", "+").replaceAll("_", "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

function base64UrlJson<T>(value: string): T {
  return JSON.parse(new TextDecoder().decode(base64UrlBytes(value))) as T;
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(new Uint8Array(digest));
}

export async function verifyGoogleCredential(credential: string, clientId: string): Promise<GoogleClaims> {
  const parts = credential.split(".");
  if (parts.length !== 3) throw new Error("Malformed Google credential");
  const header = base64UrlJson<{ alg: string; kid: string }>(parts[0]);
  if (header.alg !== "RS256" || !header.kid) throw new Error("Unsupported Google credential");

  const keysResponse = await fetch("https://www.googleapis.com/oauth2/v3/certs");
  if (!keysResponse.ok) throw new Error("Unable to retrieve Google signing keys");
  const { keys } = await keysResponse.json() as { keys: JsonWebKey[] };
  const jwk = keys.find((key) => key.kid === header.kid);
  if (!jwk) throw new Error("Unknown Google signing key");

  const publicKey = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const validSignature = await crypto.subtle.verify(
    "RSASSA-PKCS1-v1_5",
    publicKey,
    base64UrlBytes(parts[2]),
    new TextEncoder().encode(`${parts[0]}.${parts[1]}`),
  );
  if (!validSignature) throw new Error("Invalid Google signature");

  const claims = base64UrlJson<GoogleClaims>(parts[1]);
  const now = Math.floor(Date.now() / 1000);
  if (claims.aud !== clientId) throw new Error("Invalid Google audience");
  if (!["accounts.google.com", "https://accounts.google.com"].includes(claims.iss)) throw new Error("Invalid Google issuer");
  if (!claims.exp || claims.exp <= now) throw new Error("Expired Google credential");
  if (!claims.sub || !claims.email || !claims.email_verified) throw new Error("Unverified Google account");
  return claims;
}

export function readCookie(request: Request, name: string) {
  const cookie = request.headers.get("cookie") ?? "";
  for (const part of cookie.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

export function hasSameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}

export async function createSession(userId: string) {
  const tokenBytes = crypto.getRandomValues(new Uint8Array(32));
  const token = bytesToHex(tokenBytes);
  const tokenHash = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = now + SESSION_AGE_SECONDS;
  await env.DB.prepare("DELETE FROM sessions WHERE expires_at <= ?1").bind(now).run();
  await env.DB.prepare(
    "INSERT INTO sessions (token_hash, user_id, expires_at, created_at) VALUES (?1, ?2, ?3, ?4)"
  ).bind(tokenHash, userId, expiresAt, now).run();
  return { token, expiresAt };
}

export async function getSessionUser(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const tokenHash = await sha256(token);
  const now = Math.floor(Date.now() / 1000);
  return env.DB.prepare(
    `SELECT users.id, users.email, users.display_name AS displayName, users.picture_url AS pictureUrl
     FROM sessions JOIN users ON users.id = sessions.user_id
     WHERE sessions.token_hash = ?1 AND sessions.expires_at > ?2`
  ).bind(tokenHash, now).first<{ id: string; email: string; displayName: string; pictureUrl: string | null }>();
}

export async function deleteCurrentSession(request: Request) {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return;
  await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?1").bind(await sha256(token)).run();
}

export function sessionCookie(token: string, expiresAt: number) {
  return `${SESSION_COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${SESSION_AGE_SECONDS}; Expires=${new Date(expiresAt * 1000).toUTCString()}`;
}

export function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
