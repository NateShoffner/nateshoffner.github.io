import React from 'react'
import { NextResponse } from 'next/server'
import { renderToBuffer } from '@react-pdf/renderer'
import { getResume } from '@lib/resume'
import { ResumePDFDoc } from '@components/resume/ResumePDFDoc'
import { workSectionEnabled } from '@/src/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Route handlers bypass the work layout's notFound guard.
  if (!workSectionEnabled) return new NextResponse(null, { status: 404 })
  const resume = getResume()
  const buffer = await renderToBuffer(<ResumePDFDoc resume={resume} />)
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename="nate-shoffner-resume.pdf"',
    },
  })
}
