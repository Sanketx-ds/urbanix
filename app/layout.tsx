import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, Figtree } from 'next/font/google'
import { AppProviders } from '@/components/urbanix/app-providers'
import { BackgroundOrbs } from '@/components/urbanix/background-orbs'
import { SiteFooter } from '@/components/urbanix/site-footer'
import { SiteHeader } from '@/components/urbanix/site-header'
import { SosDialog, SosFloatingButton } from '@/components/urbanix/sos'
import './globals.css'

const bricolage = Bricolage_Grotesque({ subsets: ['latin'], variable: '--font-bricolage', display: 'swap' })
const figtree = Figtree({ subsets: ['latin'], variable: '--font-figtree', display: 'swap' })

export const metadata: Metadata = {
  title: 'Urbanix: Your city, your purpose, your perfect plan',
  description:
    'Urbanix is a personalised city companion. Tell us who you are and get places, food and a day plan built for you, with one-tap SOS help.',
  generator: 'v0.app',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f4f7f9' },
    { media: '(prefers-color-scheme: dark)', color: '#0b1a28' },
  ],
}

const themeScript = `try{if(localStorage.getItem('urbanix-theme')==='light')document.documentElement.classList.remove('dark')}catch(e){}`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${bricolage.variable} ${figtree.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh antialiased">
        <AppProviders>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-pulse focus:px-4 focus:py-2 focus:text-pulse-foreground"
          >
            Skip to content
          </a>
          <BackgroundOrbs />
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
          <SosFloatingButton />
          <SosDialog />
        </AppProviders>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
