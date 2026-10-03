'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import { Plus, User as UserIcon, LogOut, Layers, ChevronDown } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, setShowLoginModal } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const displayName = user?.fullName || user?.full_name || user?.phone
  const avatar = user?.avatarUrl || user?.avatar_url

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`px-3 py-2 rounded-control text-sm font-semibold transition-colors ${
        isActive(href) ? 'text-primary bg-primary-soft' : 'text-ink-muted hover:text-ink hover:bg-surface-secondary'
      }`}
    >
      {label}
    </Link>
  )

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 md:h-16 gap-4">
          <Link href="/" className="flex items-center gap-2.5 shrink-0" aria-label="AgriTroc, accueil">
            <Image src="/logo-icon.png" alt="" width={34} height={34} className="rounded-control object-cover" />
            <span className="text-lg font-bold tracking-tight text-ink">
              Agri<span className="text-primary">Troc</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1" aria-label="Navigation principale">
            {navLink('/offres', 'Explorer')}
            {isAuthenticated && navLink('/mes-offres', 'Mes annonces')}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/publier"
              className="hidden md:inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 h-10 rounded-button text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden />
              <span>Publier une annonce</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setMenuOpen(!menuOpen)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  aria-label="Mon compte"
                  className="flex items-center gap-2 h-10 pl-1 pr-1 md:pr-2.5 rounded-full md:rounded-button border border-line hover:bg-surface-secondary transition-colors cursor-pointer"
                >
                  <span className="w-8 h-8 rounded-full overflow-hidden bg-primary-soft flex items-center justify-center font-bold text-xs text-primary shrink-0">
                    {avatar ? (
                      <img src={avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      (user?.fullName?.[0] || user?.full_name?.[0] || 'U').toUpperCase()
                    )}
                  </span>
                  <span className="hidden md:block text-sm font-semibold text-ink max-w-[120px] truncate">
                    {displayName}
                  </span>
                  <ChevronDown className="hidden md:block w-4 h-4 text-ink-subtle" aria-hidden />
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-60 bg-surface rounded-card shadow-lg border border-line py-2 z-50 animate-fade-up"
                  >
                    <div className="px-4 py-2 border-b border-line">
                      <p className="text-sm font-semibold text-ink truncate">{user?.fullName || user?.full_name || 'Mon compte'}</p>
                      <p className="text-xs text-ink-subtle mt-0.5">{user?.phone}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/profil"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 h-11 text-sm font-medium text-ink hover:bg-surface-secondary rounded-control"
                      >
                        <UserIcon className="w-4 h-4 text-primary" aria-hidden />
                        Mon profil
                      </Link>
                      <Link
                        href="/mes-offres"
                        role="menuitem"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 h-11 text-sm font-medium text-ink hover:bg-surface-secondary rounded-control"
                      >
                        <Layers className="w-4 h-4 text-primary" aria-hidden />
                        Mes annonces
                      </Link>
                    </div>
                    <div className="pt-1 px-1 border-t border-line">
                      <button
                        role="menuitem"
                        onClick={() => {
                          setMenuOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-3 px-3 h-11 text-sm font-medium text-error hover:bg-red-50 rounded-control text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" aria-hidden />
                        Se déconnecter
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-button text-sm font-semibold text-ink bg-surface hover:bg-surface-secondary border border-line transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-primary" aria-hidden />
                <span>Se connecter</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
