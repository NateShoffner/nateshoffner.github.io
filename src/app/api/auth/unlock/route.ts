import { NextRequest, NextResponse } from 'next/server'
import { verifyTurnstile } from '@lib/turnstile'
import { verifyCredential } from '@lib/auth/credentials'
import { createSessionToken } from '@lib/auth/session'
import {
  SESSION_COOKIE,
  isCloudflareAccessEnabled,
} from '@lib/auth/config'

export async function POST(req: NextRequest) {
  // When Cloudflare Access is the active backend, the password gate is off.
  if (isCloudflareAccessEnabled()) {
    return NextResponse.json({ error: 'disabled' }, { status: 404 })
  }

  const { password, turnstileToken } = await req.json().catch(() => ({}))

  if (!turnstileToken) {
    return NextResponse.json({ error: 'captcha' }, { status: 400 })
  }
  const captchaOk = await verifyTurnstile(turnstileToken, 'unlock')
  if (!captchaOk) {
    return NextResponse.json({ error: 'captcha' }, { status: 400 })
  }

  const result = await verifyCredential(password)
  if (!result.ok) {
    return NextResponse.json({ error: 'password' }, { status: 401 })
  }

  const token = await createSessionToken(result.credentialId)
  const res = NextResponse.json({ ok: true })
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    // No maxAge/expires: session-scoped cookie, cleared when the browser closes.
  })
  return res
}
