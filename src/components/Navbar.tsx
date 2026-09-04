'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Sprout,
  PlusCircle,
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
  const { user, isAuthenticated, logout } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-emerald-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center text-white shadow-sm group-hover:bg-emerald-800 transition">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-emerald-900">
                Agri<span className="text-amber-600">Troc</span>
              </span>
              <span className="hidden sm:block text-[10px] text-emerald-700 font-medium tracking-wide uppercase">
                Sénégal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link
              href="/offres"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                isActive('/offres')
                  ? 'text-emerald-800 bg-emerald-50 font-semibold'
                  : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
              }`}
            >
              Explorer les offres
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/mes-offres"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                    isActive('/mes-offres')
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  Mes annonces
                </Link>

                <Link
                  href="/messages"
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition flex items-center gap-1.5 ${
                    isActive('/messages')
                      ? 'text-emerald-800 bg-emerald-50 font-semibold'
                      : 'text-slate-600 hover:text-emerald-700 hover:bg-slate-50'
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Discussions</span>
                </Link>
              </>
            )}
          </nav>

          {/* Action Button & User Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/publier"
              className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow-xs hover:shadow transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publier un troc</span>
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-700"
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs overflow-hidden border border-emerald-200">
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
                  <span className="text-sm font-medium text-slate-800 max-w-[120px] truncate">
                    {user?.fullName || user?.full_name || user?.phone}
                  </span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-1.5 z-50"
                    onMouseLeave={() => setProfileDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs text-slate-500">Connecté en tant que</p>
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {user?.fullName || user?.full_name || 'Agriculteur'}
                      </p>
                      <p className="text-xs text-emerald-600 font-mono">{user?.phone}</p>
                    </div>

                    <Link
                      href="/profil"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <UserIcon className="w-4 h-4 text-slate-500" />
                      <span>Mon profil</span>
                    </Link>

                    <Link
                      href="/mes-offres"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Layers className="w-4 h-4 text-slate-500" />
                      <span>Mes offres de troc</span>
                    </Link>

                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false)
                        logout()
                      }}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 text-red-500" />
                      <span>Déconnexion</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/connexion"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition"
              >
                <span>Connexion WhatsApp</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/publier"
              className="p-2 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
            >
              <PlusCircle className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            href="/offres"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explorer les offres
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                href="/mes-offres"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Mes offres
              </Link>
              <Link
                href="/messages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Discussions
              </Link>
              <Link
                href="/profil"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
              >
                Mon profil ({user?.fullName || user?.phone})
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  logout()
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-red-600 hover:bg-red-50"
              >
                Déconnexion
              </button>
            </>
          ) : (
            <Link
              href="/connexion"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full text-center px-4 py-2.5 bg-emerald-700 text-white rounded-lg font-semibold"
            >
              Connexion WhatsApp
            </Link>
          )}
        </div>
      )}
    </header>
  )
}
