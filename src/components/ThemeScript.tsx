'use client'

import { useServerInsertedHTML } from 'next/navigation'

// Anti-flash theme initialization. Sets data-theme from localStorage before the
// page paints so there's no light/dark flash on load.
//
// In the Next.js 16 App Router, rendering a raw <script> element inside a
// component triggers React's "Encountered a script tag while rendering React
// component" warning (React 19 never executes such scripts on the client).
// useServerInsertedHTML injects the markup into the server-rendered <head>
// directly, outside React's element tree, so it still runs synchronously on
// first paint without tripping that warning.
const THEME_INIT = `(function(){try{var t=localStorage.getItem('theme');document.documentElement.setAttribute('data-theme',t||'dark')}catch(e){}})()`

export default function ThemeScript() {
  useServerInsertedHTML(() => (
    <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
  ))
  return null
}
