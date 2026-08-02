import { notFound } from 'next/navigation'
import { workSectionEnabled } from '@/src/config'
import DevDataRefresh from '@components/dev/DevDataRefresh'

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  if (!workSectionEnabled) notFound()
  return (
    <>
      {process.env.NODE_ENV === 'development' && <DevDataRefresh />}
      {children}
    </>
  )
}
