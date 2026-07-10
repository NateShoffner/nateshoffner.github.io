// Signed session cookie for the self-managed password backend.
//
// Uses jose (HS256) so it works in the edge middleware runtime as well as in
// Node route handlers. The cookie is a short JWT: httpOnly, session-scoped
// (no maxAge/expires, so the browser drops it when it closes), and signed with
// AUTH_SESSION_SECRET.

import { SignJWT, jwtVerify } from 'jose'

const SESSION_JWT_SUBJECT = 'work-access'

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SESSION_SECRET
  if (!secret) {
    throw new Error('AUTH_SESSION_SECRET is not set')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Mint a signed session token. `credentialId` records which credential unlocked
 * the session — today it's always the shared env password, but the field is
 * here so a future credential store can attribute sessions per-credential.
 */
export async function createSessionToken(credentialId = 'shared'): Promise<string> {
  return new SignJWT({ cid: credentialId })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(SESSION_JWT_SUBJECT)
    .setIssuedAt()
    .sign(getSecret())
}

/** Verify a session token; returns true only for a valid, correctly-scoped JWT. */
export async function verifySessionToken(token: string): Promise<boolean> {
  try {
    await jwtVerify(token, getSecret(), { subject: SESSION_JWT_SUBJECT })
    return true
  } catch {
    return false
  }
}
