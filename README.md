# nateshoffner.github.io

Personal website and blog. Built with Next.js (App Router), deployed on Vercel.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** Bootstrap 4 + SCSS
- **Blog:** Markdown files with gray-matter frontmatter, Disqus comments
- **Deployment:** Vercel
- **Contact form:** Resend + Cloudflare Turnstile
- **Gated pages:** Cloudflare Access *or* self-managed password gate (see [Work Section](#work-section-resume--certifications))

## Getting Started

```bash
npm install --legacy-peer-deps
cp .env.example .env.local
# fill in .env.local values
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See `.env.example` for all required variables.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Cloudflare Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key |
| `RESEND_API_KEY` | Resend API key |
| `RESEND_FROM` | Sender address for contact form emails |
| `RESEND_TO` | Recipient address for contact form submissions |

For local development, Cloudflare provides test keys that work on any domain:
- Site key: `1x00000000000000000000AA`
- Secret key: `1x0000000000000000000000000000000AA`

## Feature Flags

Build-time flags (`NEXT_PUBLIC_*` variables are inlined at build, so changing them requires a rebuild/redeploy). Both default to enabled; set to `false` to disable.

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_CIRCUIT_TRACES` | Decorative circuit-board traces (nav sidebar, profile circle hover, unlock page backdrop) |
| `NEXT_PUBLIC_WORK_SECTION` | Professional work section: the home page section, the "Work" nav item, and all `/work` pages (which 404 when disabled) |

## Blog Posts

Posts live in `_posts/` as Markdown files with YAML frontmatter:

```markdown
---
title: Post Title
date: 2025-01-01
description: Short description
categories: [Category]
tags: [tag1, tag2]
image: optional-image.png
---

Post content here.
```

Posts are served at `/blog/[year]/[month]/[slug]/`. Tags and categories link to filtered listing pages at `/blog/tag/[tag]/` and `/blog/category/[category]/`.

## Work Section (Resume & Certifications)

The `/work` landing page is public, but the resume and certifications pages behind it are gated. Routes:

- `/work` — public landing page
- `/work/resume` — interactive web view (gated)
- `/work/resume/print` — print-optimized layout (gated)
- `/work/resume/pdf` — downloads a generated PDF via `@react-pdf/renderer` (gated)
- `/work/certifications` — certifications listing (gated)
- `/work/unlock` — password login page (used by the self-managed backend)

### Authentication backends

The gate is enforced in `src/middleware.ts` and supports two swappable backends, selected by `CF_ACCESS_ENABLED`:

- **`CF_ACCESS_ENABLED=true`** — Cloudflare Access. The middleware validates the `CF-Access-JWT-Assertion` header against your Access application.
- **unset / not `true`** — self-managed password gate (the default). Visitors are redirected to `/work/unlock`, which requires a password plus a Cloudflare Turnstile challenge. On success, a signed, session-only cookie is set (via [jose](https://github.com/panva/jose), HS256) and grants access until the browser is closed.

The credential check is isolated in `lib/auth/credentials.ts` so it can later be replaced with a real credential store (time-gated access, usage limits, audit logging) without touching the middleware or routes.

| Variable | Description |
|---|---|
| `CF_ACCESS_ENABLED` | `true` to use Cloudflare Access; otherwise the password gate is used |
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team domain (e.g. `example.cloudflareaccess.com`) |
| `CF_ACCESS_AUD` | Cloudflare Access application audience tag |
| `CF_ACCESS_BYPASS` | Set to `true` to skip JWT validation in local development |
| `SITE_ACCESS_PASSWORD` | Password for the self-managed gate |
| `AUTH_SESSION_SECRET` | Secret used to sign the session cookie (`openssl rand -base64 32`) |

> The password gate reuses `NEXT_PUBLIC_TURNSTILE_SITE_KEY` / `TURNSTILE_SECRET_KEY` for its captcha.

### Encrypted data (SOPS)

The resume and certifications data (`_data/resume.yml`, `_data/certs.yaml`) is encrypted with [SOPS](https://github.com/getsops/sops) using an [age](https://github.com/FiloSottile/age) keypair.

| Variable | Description |
|---|---|
| `AGE_SECRET_KEY` | age private key used to decrypt the data at build time |

The build script (`scripts/unlock.sh`) downloads the SOPS binary if needed, then decrypts the data in-place before `next build` runs. On Vercel, set `AGE_SECRET_KEY` as an environment variable. In development, `sops` must be on the `PATH` for on-demand decryption.

To generate a new keypair locally: `age-keygen`. Add the public key to `.sops.yaml` and the private key to `AGE_SECRET_KEY` in `.env.local`.

## Admin Panel

A dev-only admin panel is available at `/admin` for managing drafts and published posts. Blocked in production (`NODE_ENV === 'production'`).
