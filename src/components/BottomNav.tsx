'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Search, Plus, Layers, User } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

// Écrans centrés sur une seule action (détail, formulaires) : la barre ferait concurrence à leur CTA
const HIDDEN_ON = [/^\/offres\/[^/]+/, /^\/publier/, /^\/connexion/]

/** Navigation au pouce, mobile uniquement. */
export default function BottomNav() {
  const pathname = usePathname()
  const { isAuthenticated, setShowLoginModal } = useAuth()

  if (HIDDEN_ON.some((re) => re.test(pathname))) return null

  const item = (href: string, label: string, Icon: typeof Home) => {
    const active = href === '/' ? pathname === '/' : pathname.startsWith(href)
    return (
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] font-semibold transition-colors ${
          active ? 'text-primary' : 'text-ink-subtle'
        }`}
      >
        <Icon className={`w-[22px] h-[22px] ${active ? 'stroke-[2.4]' : ''}`} aria-hidden />
        <span>{label}</span>
      </Link>
    )
  }

  return (
    <>
      {/* Réserve la place de la barre en bas de page */}
      <div className="h-16 md:hidden" aria-hidden />
      <nav
        aria-label="Navigation mobile"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-line pb-safe"
      >
        <div className="flex items-stretch max-w-md mx-auto px-2">
          {item('/', 'Accueil', Home)}
          {item('/offres', 'Explorer', Search)}
          <Link
            href="/publier"
            aria-label="Publier une annonce"
            className="flex-1 flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] font-semibold text-primary"
          >
            <span className="w-11 h-9 -mt-0.5 rounded-button bg-primary text-white flex items-center justify-center shadow-[0_4px_12px_-4px_rgba(15,107,62,0.6)] active:scale-95 transition-transform">
              <Plus className="w-5 h-5 stroke-[2.5]" aria-hidden />
            </span>
            <span>Publier</span>
          </Link>
          {item('/mes-offres', 'Annonces', Layers)}
          {isAuthenticated ? (
            item('/profil', 'Profil', User)
          ) : (
            <button
              onClick={() => setShowLoginModal(true)}
              className="flex-1 flex flex-col items-center justify-center gap-0.5 h-14 text-[11px] font-semibold text-ink-subtle cursor-pointer"
            >
              <User className="w-[22px] h-[22px]" aria-hidden />
              <span>Connexion</span>
            </button>
          )}
        </div>
      </nav>
    </>
  )
}
