import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'PromptWise — Clarity for the AI Era',
  description: 'Transform messy prompts into clear, optimized AI instructions. Reduce token usage, lower API costs, and get intelligent model recommendations.',
  generator: 'v0.app',
  keywords: ['AI', 'prompts', 'optimization', 'token reduction', 'GPT', 'Claude', 'AI tools'],
  authors: [{ name: 'PromptWise' }],
  openGraph: {
    title: 'PromptWise — Clarity for the AI Era',
    description: 'Transform messy prompts into clear, optimized AI instructions.',
    type: 'website',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#f0eeff',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className={`${inter.variable} font-sans antialiased overflow-x-hidden`}>
        {children}
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
