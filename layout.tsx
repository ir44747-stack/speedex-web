import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import './globals.css'

export const metadata: Metadata = {
  title: 'SPEEDEX — Bilateral Trade Between Qatar and China',
  description:
    'SPEEDEX is a premium commercial mediation and business consultancy for bilateral trade, integrated logistics, precise supply chains and corporate establishment between Qatar and China.',
  keywords: ['SPEEDEX', 'Qatar China bilateral trade', 'Qatar China supply chain', 'commercial mediation', 'integrated logistics', 'Qatar corporate setup'],
  icons: {
    icon: [{ url: '/assets/speedex-mark.svg', type: 'image/svg+xml' }],
    shortcut: ['/assets/speedex-mark.svg'],
  },
  openGraph: {
    title: 'SPEEDEX — QATAR ↔ CHINA',
    description: 'Integrated logistics and precise supply-chain execution across Qatar and China, with corporate establishment in Qatar from A to Z.',
    type: 'website',
    images: [{ url: '/assets/doha-west-bay-real.jpg', width: 2200, height: 968, alt: 'SPEEDEX — bilateral trade between Qatar and China' }],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#070709',
}

const themeScript = `
try {
  var savedTheme = localStorage.getItem('spx-theme');
  document.documentElement.dataset.theme = savedTheme === 'light' ? 'light' : 'dark';
} catch (e) {
  document.documentElement.dataset.theme = 'dark';
}
`

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&family=Noto+Sans+SC:wght@400;500;700;900&family=Noto+Serif+SC:wght@600;700&family=Syne:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  )
}
