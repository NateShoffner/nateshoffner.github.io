import { notFound } from 'next/navigation'
import { workSectionEnabled } from '@/src/config'

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  if (!workSectionEnabled) notFound()
  return children
}
