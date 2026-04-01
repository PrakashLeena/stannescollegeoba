import type { Metadata } from 'next'
import './globals.css'
import FirebaseAnalytics from '@/components/FirebaseAnalytics'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: "St.Anne’s College Past Pupils’ Association",
  description: "St.Anne’s College Past Pupils’ Association — a vibrant alumni community reconnecting, reminiscing, and forging new bonds while serving the community.",
  verification: {
    google: 'D8hml7ROUnx4LXupBE4eoIjZS4X9Y07yzsbqeP-HmsI',
  },
  keywords: [
    "st.anne's college past pupils' association",
    "st.anne's college ppa",
    'sacppa',
    "st.anne's college",
    "st.anne's college vankalai",
    'stannes college past people association',
    'stannesppa',
  ],
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    type: 'website',
    url: '/',
    title: "St.Anne’s College Past Pupils’ Association",
    description:
      "St.Anne’s College Past Pupils’ Association — reconnecting alumni and serving the community.",
    siteName: "St.Anne’s College Past Pupils’ Association",
    images: [{ url: '/src/images/logo-removebg.png' }],
  },
  twitter: {
    card: 'summary',
    title: "St.Anne’s College Past Pupils’ Association",
    description:
      "St.Anne’s College Past Pupils’ Association — reconnecting alumni and serving the community.",
    images: ['/src/images/logo-removebg.png'],
  },
  other: {
    'geo.region': 'LK',
    'geo.placename': 'Vankalai',
  },
  icons: {
    icon: '/src/images/logo-removebg.png',
    apple: '/src/images/logo-removebg.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Lato:wght@300;400;700;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: "St.Anne’s College Past Pupils’ Association",
              alternateName: ['SACPPA', "St.Anne's College PPA", 'stannesppa'],
              url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
              logo: `${(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/+$/, '')}/src/images/logo-removebg.png`,
            }),
          }}
        />
      </head>
      <body className="font-lato antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  )
}
