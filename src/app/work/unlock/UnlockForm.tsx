'use client'

import { useState, useRef, useEffect } from 'react'
import Script from 'next/script'
import { useSearchParams } from 'next/navigation'
import { isProtectedPath } from '@lib/auth/config'
import CircuitTraces from '@components/CircuitTraces'
import styles from './UnlockPage.module.scss'

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id: string) => void
      remove: (id: string) => void
    }
  }
}

type Status = 'idle' | 'submitting' | 'error-password' | 'error-captcha' | 'error'

const DEFAULT_NEXT = '/work'

export default function UnlockForm() {
  const params = useSearchParams()
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [captchaReady, setCaptchaReady] = useState(false)
  const turnstileRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | null>(null)
  const tokenRef = useRef<string | null>(null)

  // Only allow redirecting back to a genuinely protected page (no open redirect).
  const rawNext = params.get('next') ?? ''
  const next = isProtectedPath(rawNext) ? rawNext : DEFAULT_NEXT

  function renderTurnstile() {
    if (!window.turnstile || !turnstileRef.current || widgetIdRef.current !== null) return
    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? '',
      callback: (token: string) => { tokenRef.current = token },
      'expired-callback': () => { tokenRef.current = null },
    })
    setCaptchaReady(true)
  }

  useEffect(() => {
    if (window.turnstile) renderTurnstile()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!tokenRef.current) {
      setStatus('error-captcha')
      return
    }
    setStatus('submitting')
    try {
      const res = await fetch('/api/auth/unlock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, turnstileToken: tokenRef.current }),
      })
      if (res.ok) {
        // Full navigation so the freshly-set session cookie flows through
        // middleware on a real request (and avoids a client-side layout
        // re-render of the root <script> theme-init).
        window.location.assign(next)
        return
      }
      const data = await res.json().catch(() => ({}))
      setStatus(
        data.error === 'captcha' ? 'error-captcha' :
        data.error === 'password' ? 'error-password' :
        'error'
      )
      tokenRef.current = null
      if (widgetIdRef.current !== null && window.turnstile) {
        window.turnstile.reset(widgetIdRef.current)
      }
    } catch {
      setStatus('error')
    }
  }

  const errorMessage =
    status === 'error-password' ? 'Incorrect password. Please try again.' :
    status === 'error-captcha' ? 'Please complete the verification challenge.' :
    status === 'error' ? 'Something went wrong. Please try again.' :
    null

  return (
    <div className={styles.wrapper}>
      <CircuitTraces />
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js"
        strategy="afterInteractive"
        onLoad={renderTurnstile}
      />
      <form className={styles.card} onSubmit={handleSubmit}>
        <div className={styles.lock} aria-hidden="true">
          <i className="fa fa-lock" />
        </div>
        <h1 className={styles.title}>Protected</h1>
        <div className={styles.divider} />
        <p className={styles.subtitle}>
          This section is locked. Enter the password to continue.
        </p>

        {errorMessage && <div className={styles.error}>{errorMessage}</div>}

        <div className={styles.field}>
          <label className={styles.label} htmlFor="unlock-password">Password</label>
          <input
            id="unlock-password"
            className={styles.input}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            autoFocus
          />
        </div>

        <div className={styles.captcha}>
          {!captchaReady && (
            <span className={styles.captchaLoading}>
              <i className="fa fa-circle-o-notch fa-spin" aria-hidden="true" />
              Loading verification…
            </span>
          )}
          <div ref={turnstileRef} />
        </div>

        <button
          className={styles.button}
          type="submit"
          disabled={status === 'submitting' || password.length === 0}
        >
          {status === 'submitting' ? 'Unlocking…' : 'Unlock'}
        </button>
      </form>
    </div>
  )
}
