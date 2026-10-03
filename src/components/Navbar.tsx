'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Image from 'next/image'
import {
  Plus,
  MessageSquare,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Layers,
  ChevronDown,
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, setShowLoginModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isActive = (path: string) => pathname === path

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand - Clean, crisp, no distracting glow */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo-icon.png"
              alt="AgriTroc"
              width={38}
              height={38}
              className="rounded-xl border border-emerald-100 object-cover"
            />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Agri<span className="text-emerald-700">Troc</span>
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Sénégal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation - Clear, simple links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/offres"
              className={`text-sm font-semibold transition-colors ${
                isActive('/offres')
                  ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
                  : 'text-slate-600 hover:text-emerald-800'
              }`}
            >
              Toutes les offres
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/mes-offres"
                  className={`text-sm font-semibold transition-colors ${
                    isActive('/mes-offres')
                      ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  Mes annonces
                </Link>

                <Link
                  href="/messages"
                  className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                    isActive('/messages')
                      ? 'text-emerald-800 border-b-2 border-emerald-700 pb-0.5'
                      : 'text-slate-600 hover:text-emerald-800'
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  <span>Messagerie</span>
                </Link>
              </>
            )}
          </nav>

          {/* Action Button & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/publier"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Publier un troc</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center font-bold text-xs text-emerald-800 shrink-0">
                    {user?.avatarUrl || user?.avatar_url ? (
                      <img
                        src={user.avatarUrl || user.avatar_url || ''}
                        alt="Avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      user?.fullName?.[0] || user?.full_name?.[0] || 'U'
                    )}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 max-w-[120px] truncate">
                    {user?.fullName || user?.full_name || user?.phone}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Compte connecté</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.fullName || user?.full_name || 'Agriculteur'}
                      </p>
                      <p className="text-xs text-emerald-700 font-mono mt-0.5">{user?.phone}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/profil"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-700" />
                        <span>Mon profil</span>
                      </Link>

                      <Link
                        href="/mes-offres"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <Layers className="w-4 h-4 text-emerald-700" />
                        <span>Mes annonces</span>
                      </Link>

                      <Link
                        href="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50 rounded-lg transition-colors"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-700" />
                        <span>Messagerie</span>
                      </Link>
                    </div>

                    <div className="pt-1 px-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Déconnexion</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowLoginModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 transition-colors cursor-pointer"
              >
                <UserIcon className="w-4 h-4 text-emerald-700" />
                <span>Connexion</span>
              </button>
            )}
          </div>

          {/* Mobile menu buttons */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/publier"
              className="p-2 bg-emerald-700 text-white rounded-lg shadow-xs"
              aria-label="Publier un troc"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Ouvrir le menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer - Simple, clean, large tap targets */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2">
          <Link
            href="/offres"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
          >
            Toutes les offres
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/mes-offres"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Mes annonces
              </Link>
              <Link
                href="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Messagerie
              </Link>
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-base font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
              >
                Mon profil ({user?.fullName || user?.phone})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setShowLoginModal(true)
              }}
              className="block w-full text-center px-4 py-3 bg-emerald-700 text-white rounded-lg font-bold transition-colors"
            >
              Se connecter
            </button>
          )}
        </div>
      )}
    </header>
  )
}
