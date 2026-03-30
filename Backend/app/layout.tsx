import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Backend Admin',
  description: 'Backend admin panel',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
