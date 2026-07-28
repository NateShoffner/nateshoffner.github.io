export const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'https://nateshoffner.com'

// Feature flags. NEXT_PUBLIC_ vars are inlined at build time, so changing them
// requires a rebuild. Both default to enabled; set to "false" to disable.

// Decorative circuit-board traces (nav sidebar, profile circle, unlock page).
export const circuitTracesEnabled =
  process.env.NEXT_PUBLIC_CIRCUIT_TRACES !== 'false'

// Professional work section: home page section, nav item, and /work pages.
export const workSectionEnabled =
  process.env.NEXT_PUBLIC_WORK_SECTION !== 'false'
