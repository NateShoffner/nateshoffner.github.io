// Credential verification for the self-managed password backend.
//
// This is deliberately the *only* place the password is checked, isolated so it
// can later grow into a real credential store — per-credential expiry, usage
// limits, and access logging — without touching the middleware or API routes.
// For now it validates against a single shared password in SITE_ACCESS_PASSWORD.

export type CredentialResult =
  | { ok: true; credentialId: string }
  | { ok: false }

/**
 * Constant-time-ish comparison to avoid leaking password length/prefix via
 * timing. Both sides are hashed to fixed length first so length differences
 * don't short-circuit. Runs in the edge runtime (Web Crypto only).
 */
async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder()
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest('SHA-256', enc.encode(a)),
    crypto.subtle.digest('SHA-256', enc.encode(b)),
  ])
  const va = new Uint8Array(ha)
  const vb = new Uint8Array(hb)
  let diff = 0
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i]
  return diff === 0
}

export async function verifyCredential(password: string): Promise<CredentialResult> {
  const expected = process.env.SITE_ACCESS_PASSWORD
  if (!expected) {
    console.error('[auth] SITE_ACCESS_PASSWORD is not set')
    return { ok: false }
  }
  if (typeof password !== 'string' || password.length === 0) {
    return { ok: false }
  }
  const match = await timingSafeEqual(password, expected)
  return match ? { ok: true, credentialId: 'shared' } : { ok: false }
}
