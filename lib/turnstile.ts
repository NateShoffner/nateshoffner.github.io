// Cloudflare Turnstile server-side verification, shared by the contact form and
// the /work unlock flow.

export async function verifyTurnstile(
  token: string,
  context = 'turnstile'
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) {
    console.error(`[${context}] TURNSTILE_SECRET_KEY is not set`)
    return false
  }

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ secret, response: token }),
  })
  const data = await res.json()
  if (!data.success) {
    console.error(`[${context}] Turnstile verification failed:`, data['error-codes'])
  }
  return data.success === true
}
