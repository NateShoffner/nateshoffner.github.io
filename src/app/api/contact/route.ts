import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { verifyTurnstile } from '@lib/turnstile'

export async function POST(req: NextRequest) {
  const { name, email, message, turnstileToken } = await req.json()

  if (!name || !email || !message || !turnstileToken) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const turnstileOk = await verifyTurnstile(turnstileToken, 'contact')
  if (!turnstileOk) {
    return NextResponse.json({ error: 'captcha' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const to = process.env.RESEND_TO
  const from = process.env.RESEND_FROM

  if (!apiKey || !to || !from) {
    console.error('[contact] Missing Resend env vars')
    return NextResponse.json({ error: 'send' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.emails.send({
    from,
    replyTo: `${name} <${email}>`,
    to,
    subject: `Contact form message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
  })

  if (error) {
    console.error('[contact] Resend error:', error)
    return NextResponse.json({ error: 'send' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
