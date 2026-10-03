'use client'

import React, { useState } from 'react'
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
  Sparkles,
  ArrowRight,
} from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout, setShowLoginModal } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl border-b border-emerald-950/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 sm:h-18">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-emerald-600 to-amber-500 opacity-20 group-hover:opacity-40 blur transition duration-300"></div>
              <Image
                src="/logo-icon.png"
                alt="AgriTroc"
                width={42}
                height={42}
                className="relative rounded-2xl shadow-sm border border-emerald-100 object-cover transform group-hover:scale-105 transition duration-300"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 group-hover:text-emerald-950 transition">
                  Agri<span className="text-emerald-600">Troc</span>
                </span>
                <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                  SN
                </span>
              </div>
              <span className="hidden sm:block text-[11px] text-slate-400 font-medium tracking-wide">
                Plateforme de troc agricole
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/70 p-1.5 rounded-full border border-slate-200/60 backdrop-blur">
            <Link
              href="/offres"
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                isActive('/offres')
                  ? 'bg-white text-emerald-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              Explorer les offres
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/mes-offres"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                    isActive('/mes-offres')
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  Mes annonces
                </Link>

                <Link
                  href="/messages"
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                    isActive('/messages')
                      ? 'bg-white text-emerald-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Messagerie</span>
                </Link>
              </>
            )}
          </nav>

          {/* Action Button & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/publier"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white px-4 py-2.5 rounded-xl text-sm font-bold shadow-[0_2px_10px_rgba(5,96,58,0.2)] hover:shadow-[0_4px_16px_rgba(5,96,58,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Publier un troc</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1 rounded-full border border-slate-200/80 bg-white hover:border-emerald-300 transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-100 bg-emerald-50 flex items-center justify-center font-bold text-xs text-emerald-800 shrink-0">
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
                  <span className="text-xs font-semibold text-slate-800 max-w-[110px] truncate pr-1">
                    {user?.fullName || user?.full_name || user?.phone}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-2" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50">
                      <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Connecté</p>
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {user?.fullName || user?.full_name || 'Agriculteur'}
                      </p>
                      <p className="text-xs text-emerald-700 font-mono mt-0.5">{user?.phone}</p>
                    </div>

                    <div className="p-1 space-y-0.5">
                      <Link
                        href="/profil"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/70 rounded-xl transition"
                      >
                        <UserIcon className="w-4 h-4 text-emerald-600" />
                        <span>Mon profil</span>
                      </Link>

                      <Link
                        href="/mes-offres"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/70 rounded-xl transition"
                      >
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>Mes offres de troc</span>
                      </Link>

                      <Link
                        href="/messages"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-emerald-800 hover:bg-emerald-50/70 rounded-xl transition"
                      >
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>Messagerie</span>
                      </Link>
                    </div>

                    <div className="pt-1 px-1 border-t border-slate-100">
                      <button
                        onClick={() => {
                          setProfileDropdownOpen(false)
                          logout()
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition text-left"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:text-emerald-800 bg-white hover:bg-emerald-50/50 border border-slate-200/80 transition shadow-xs"
              >
                <UserIcon className="w-4 h-4 text-emerald-600" />
                <span>Se connecter</span>
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/publier"
              className="p-2 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl shadow-xs"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white/95 backdrop-blur-xl px-5 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-3 duration-200">
          <Link
            href="/offres"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50 transition"
          >
            Explorer les offres
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/mes-offres"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Mes offres
              </Link>
              <Link
                href="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Messagerie AgriTroc
              </Link>
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3.5 py-2.5 rounded-xl text-base font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Mon profil ({user?.fullName || user?.phone})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="w-full text-left px-3.5 py-2.5 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition"
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
              className="block w-full text-center px-4 py-3 bg-gradient-to-r from-emerald-700 to-emerald-800 text-white rounded-xl font-bold shadow-md transition"
            >
              Se connecter
            </button>
          )}
        </div>
      )}
    </header>
  )
}
