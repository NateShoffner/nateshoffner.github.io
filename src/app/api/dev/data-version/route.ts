import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'

const watchedFiles = ['_data/resume.yml', '_data/certs.yaml']

export async function GET() {
  if (process.env.NODE_ENV === 'production') return NextResponse.json(null, { status: 404 })
  const version = watchedFiles.reduce((latest, file) => {
    try {
      return Math.max(latest, fs.statSync(path.resolve(process.cwd(), file)).mtimeMs)
    } catch {
      return latest
    }
  }, 0)
  return NextResponse.json({ version })
}
