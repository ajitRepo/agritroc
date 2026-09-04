import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'AgriTroc — Plateforme de Troc & Entraide Agricole au Sénégal',
  description: 'Échangez vos ressources agricoles (semences, terres, bétail, machines, récoltes) en direct au Sénégal par troc simple ou avec complément via WhatsApp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f8faf5] text-slate-900">
        <AuthProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  )
}
