// Central config for the /work gated pages. Two backends are supported:
//   - Cloudflare Access (JWT validated at the edge) when CF_ACCESS_ENABLED=true
//   - Self-managed password unlock (signed session cookie) otherwise
//
// Keeping the toggle and shared constants here so middleware, the unlock API,
// and the unlock page all agree on the same values.

export const SESSION_COOKIE = 'work_session'

// Paths protected by whichever auth backend is active.
export const PROTECTED_PATHS = ['/work/resume', '/work/certifications']

// Where unauthenticated visitors are sent to enter the password.
export const UNLOCK_PATH = '/work/unlock'

export function isCloudflareAccessEnabled(): boolean {
  return process.env.CF_ACCESS_ENABLED === 'true'
}

/**
 * True when the given pathname is one of the gated pages (or a sub-path of one).
 * Used by the unlock flow to validate the `next` redirect target so it can only
 * ever point back at a protected page, never an open redirect.
 */
export function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATHS.some(
    (base) => pathname === base || pathname.startsWith(`${base}/`)
  )
}
