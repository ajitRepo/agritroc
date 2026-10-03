import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/components/Toast'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LoginModal from '@/components/LoginModal'
import BottomNav from '@/components/BottomNav'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://agritroc.com'),
  title: 'AgriTroc — Plateforme de Troc & Entraide Agricole au Sénégal',
  description: 'Échangez vos ressources agricoles (semences, terres, bétail, machines, récoltes) en direct au Sénégal par troc simple ou avec complément sur AgriTroc.',
  icons: {
    icon: '/icon.png',
    apple: '/apple-icon.png',
  },
  openGraph: {
    title: 'AgriTroc — Plateforme de Troc & Entraide Agricole au Sénégal',
    description: 'Échangez vos ressources agricoles en direct au Sénégal par troc simple ou avec complément sur AgriTroc.',
    type: 'website',
    locale: 'fr_SN',
    siteName: 'AgriTroc',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AgriTroc — Troc Agricole au Sénégal',
    description: 'Échangez vos ressources agricoles en direct au Sénégal.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0f6b3e',
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-background text-ink">
        <AuthProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <BottomNav />
            <LoginModal />
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
