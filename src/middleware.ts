import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify, createRemoteJWKSet } from 'jose'
import {
  SESSION_COOKIE,
  UNLOCK_PATH,
  isCloudflareAccessEnabled,
} from '@lib/auth/config'
import { verifySessionToken } from '@lib/auth/session'
import { workSectionEnabled } from '@/src/config'

const JWKS = (() => {
  const domain = process.env.CF_ACCESS_TEAM_DOMAIN
  return domain
    ? createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`))
    : null
})()

async function cloudflareAccess(req: NextRequest): Promise<NextResponse> {
  if (process.env.CF_ACCESS_BYPASS === 'true') return NextResponse.next()

  const aud = process.env.CF_ACCESS_AUD
  if (!JWKS || !aud) {
    return new NextResponse('Auth misconfigured', { status: 500 })
  }

  const token = req.headers.get('CF-Access-JWT-Assertion')
  if (!token) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  try {
    await jwtVerify(token, JWKS, { audience: aud })
    return NextResponse.next()
  } catch {
    return new NextResponse('Unauthorized', { status: 401 })
  }
}

async function passwordGate(req: NextRequest): Promise<NextResponse> {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (token && (await verifySessionToken(token))) {
    return NextResponse.next()
  }

  // Send the visitor to the unlock page, remembering where they were headed.
  const url = req.nextUrl.clone()
  url.pathname = UNLOCK_PATH
  url.search = ''
  url.searchParams.set('next', req.nextUrl.pathname)
  return NextResponse.redirect(url)
}

export async function middleware(req: NextRequest) {
  // When the work section is hidden, skip auth so the route layer can 404
  // instead of redirecting to the unlock page first.
  if (!workSectionEnabled) return NextResponse.next()

  return isCloudflareAccessEnabled()
    ? cloudflareAccess(req)
    : passwordGate(req)
}

export const config = {
  matcher: ['/work/resume/:path*', '/work/certifications/:path*'],
}
