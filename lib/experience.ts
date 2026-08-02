// Pure helpers shared by the resume views. Kept separate from lib/resume.ts
// (which uses fs/child_process) so client components can import them.

import type { ResumeExperience } from './resume'

export interface ExperienceGroup {
  company: string
  homepage?: string
  roles: ResumeExperience[]
}

// Group consecutive entries from the same company so the views can render
// LinkedIn-style stacked roles under a single company header.
export function groupExperience(experience: ResumeExperience[]): ExperienceGroup[] {
  const groups: ExperienceGroup[] = []
  for (const exp of experience) {
    const last = groups[groups.length - 1]
    if (last && last.company === exp.company) {
      last.roles.push(exp)
    } else {
      groups.push({ company: exp.company, homepage: exp.homepage, roles: [exp] })
    }
  }
  return groups
}
