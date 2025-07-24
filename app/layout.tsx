import { Geist, Geist_Mono } from 'next/font/google'
import './globals.tailwind.css'
import { Toaster } from '@/components/ui/sonner'
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()

  return (
    <html lang="en">
      <SessionProvider session={session}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} bg-primary-foreground antialiased min-h-screen flex flex-col`}
        >
          {children}
          <Toaster richColors position="top-right" />
        </body>
      </SessionProvider>
    </html>
  )
}
