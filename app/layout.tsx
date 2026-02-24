import type { Metadata } from 'next'
import { Inter, Lexend } from 'next/font/google'
import { Providers } from './providers'
import '../src/styles/tailwind.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Sleep Diagnosis CMS',
    template: '%s | Sleep Diagnosis CMS',
  },
  description:
    'Content Management System for the Sleep Diagnosis Application.',
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${lexend.variable} h-full bg-pagebg-100 antialiased`}
    >
      <body className="h-full font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
