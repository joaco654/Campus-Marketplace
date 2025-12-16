import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Campus Marketplace - Earn, Learn, and Help Your Campus Community',
  description: 'A marketplace for college students to offer and purchase services',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body
        className={`${inter.className} h-full bg-white text-gray-900 antialiased`}
      >
        <Providers>
          <div className="relative min-h-screen">
            {/* Ambient background orbs */}
            <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
              <div className="absolute -top-40 -left-32 h-72 w-72 rounded-full bg-primary-500/10 blur-3xl animate-blob" />
              <div className="absolute top-1/2 -right-40 h-80 w-80 rounded-full bg-sky-400/8 blur-3xl animate-blob" />
              <div className="absolute -bottom-48 left-1/4 h-72 w-72 rounded-full bg-emerald-400/8 blur-3xl animate-blob" />
            </div>

            {children}
          </div>
        </Providers>
      </body>
    </html>
  )
}

