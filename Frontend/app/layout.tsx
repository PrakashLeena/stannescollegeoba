import type { Metadata } from 'next'
import './globals.css'
import FirebaseAnalytics from '@/components/FirebaseAnalytics'

export const metadata: Metadata = {
  title: "ST.ANNE'S COLLEGE OLD BOYS ASSOCIATION IN NSW & ACT",
  description: "ST.ANNE'S COLLEGE OLD BOYS ASSOCIATION IN NSW & ACT — a vibrant alumni community reconnecting, reminiscing, and forging new bonds while serving the community.",
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
      </head>
      <body className="font-lato antialiased">
        <FirebaseAnalytics />
        {children}
      </body>
    </html>
  )
}
