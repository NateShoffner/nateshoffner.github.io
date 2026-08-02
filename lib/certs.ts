import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import yaml from 'js-yaml'
import type { Certification } from '@/src/types/Certification'

export type { Certification }

const certsFile = path.resolve(process.cwd(), '_data/certs.yaml')

export function getAllCertifications(): Certification[] {
  const raw = fs.readFileSync(certsFile, 'utf-8')
  let parsed: { certifications: Certification[] }
  if (raw.includes('ENC[AES256_GCM') && process.env.AGE_SECRET_KEY) {
    const decrypted = execSync(`sops --decrypt "${certsFile}"`, {
      env: { ...process.env, SOPS_AGE_KEY: process.env.AGE_SECRET_KEY },
    }).toString()
    parsed = yaml.load(decrypted) as { certifications: Certification[] }
  } else {
    parsed = yaml.load(raw) as { certifications: Certification[] }
  }
  return parsed.certifications
}

// Entries flagged with `resume: true` in certs.yaml appear on the resume.
export function getResumeCertifications(): Certification[] {
  return getAllCertifications().filter(cert => cert.resume)
}
