import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import AuthInitializer from '@/services/AuthInitializer'

export const metadata: Metadata = {
  title: 'Tiffinvala',
  description: 'Order your favourite tiffin',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthInitializer />
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  )
}
