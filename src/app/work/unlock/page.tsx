import type { Metadata } from 'next'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { isCloudflareAccessEnabled } from '@lib/auth/config'
import UnlockForm from './UnlockForm'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Unlock',
  robots: { index: false, follow: false },
}

export default function UnlockPage() {
  // With Cloudflare Access active there's no self-managed unlock flow.
  if (isCloudflareAccessEnabled()) {
    redirect('/work')
  }

  return (
    <Suspense>
      <UnlockForm />
    </Suspense>
  )
}
