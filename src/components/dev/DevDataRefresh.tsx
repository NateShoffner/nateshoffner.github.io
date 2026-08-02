'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

// Dev-only: _data/*.yml is read with fs at request time, so it isn't part of
// the module graph and edits don't trigger Fast Refresh. Poll the file mtime
// and refresh the route when it changes.
export default function DevDataRefresh() {
  const router = useRouter()
  const version = useRef<number | null>(null)

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/dev/data-version')
        if (!res.ok) return
        const data = (await res.json()) as { version: number }
        if (version.current !== null && data.version !== version.current) router.refresh()
        version.current = data.version
      } catch {
        // dev server restarting or offline; try again next tick
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [router])

  return null
}
