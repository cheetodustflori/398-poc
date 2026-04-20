import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _inter = Inter({ subsets: ["latin"] });
const _jetbrainsMono = JetBrains_Mono({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#3b5bdb',
  width: 'device-width',
  initialScale: 1,
}

export const metadata: Metadata = {
  title: 'Piazza AI Tutor | CS 101',
  description: 'An AI-powered Socratic tutor that helps CS 101 students learn by guiding them through course Q&A content.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/laptop.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/laptop.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/laptop.png',
        type: 'image/svg+xml',
      },
    ],
    apple: '/laptop.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
