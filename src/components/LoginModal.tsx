'use client'

import React, { useEffect } from 'react'
import { X } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import LoginFlow from './LoginFlow'

/** Connexion sans quitter la page : bottom sheet sur mobile, fenêtre centrée sur ordinateur. */
export default function LoginModal() {
  const { showLoginModal, setShowLoginModal } = useAuth()

  useEffect(() => {
    if (!showLoginModal) return
    const close = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowLoginModal(false)
    }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', close)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', close)
    }
  }, [showLoginModal, setShowLoginModal])

  if (!showLoginModal) return null

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-end sm:items-center justify-center sm:p-4"
      onClick={() => setShowLoginModal(false)}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connexion"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-md bg-surface rounded-t-panel sm:rounded-panel p-5 pt-3 sm:p-8 max-h-[92svh] overflow-y-auto pb-[max(1.25rem,env(safe-area-inset-bottom))] animate-fade-up"
      >
        <div className="sm:hidden mx-auto mb-3 h-1 w-10 rounded-full bg-line" aria-hidden />
        <button
          onClick={() => setShowLoginModal(false)}
          aria-label="Fermer"
          className="absolute top-2 right-2 sm:top-3 sm:right-3 w-11 h-11 flex items-center justify-center rounded-full text-ink-subtle hover:text-ink hover:bg-surface-secondary cursor-pointer"
        >
          <X className="w-5 h-5" aria-hidden />
        </button>
        {/* Monté à chaque ouverture : l'état repart de zéro sans effet de réinitialisation */}
        <div className="pt-6 sm:pt-4">
          <LoginFlow onDone={() => setShowLoginModal(false)} />
        </div>
      </div>
    </div>
  )
}
