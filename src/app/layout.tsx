import type { Metadata } from 'next'
import { Raleway, Open_Sans } from 'next/font/google'
import SiteChrome from '@components/SiteChrome'
import ThemeScript from '@components/ThemeScript'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '@assets/css/main.scss'

const raleway = Raleway({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-raleway',
  display: 'block',
})

const openSans = Open_Sans({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-open-sans',
  display: 'block',
})

export const metadata: Metadata = {
  title: {
    default: 'Nate Shoffner',
    template: '%s • Nate Shoffner',
  },
  description: 'Personal homepage and blog for Nate Shoffner.',
  icons: {
    icon: '/assets/images/logo.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" className={`${raleway.variable} ${openSans.variable}`} suppressHydrationWarning>
      <body>
        <ThemeScript />
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  )
}
