'use client'

import React, { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import LoginFlow from '@/components/LoginFlow'

/** Retour vers la page d'origine ; uniquement des chemins internes */
function safeNext(value: string | null): string {
  return value && value.startsWith('/') && !value.startsWith('//') ? value : '/offres'
}

function ConnexionContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isLoading, user } = useAuth()
  const next = safeNext(searchParams.get('next'))

  // Déjà connecté (et profil complet) : pas besoin de rester ici
  const hasName = !!(user?.fullName || user?.full_name)
  useEffect(() => {
    if (!isLoading && isAuthenticated && hasName) router.replace(next)
  }, [isLoading, isAuthenticated, hasName, next, router])

  return (
    <div className="min-h-[calc(100svh-3.5rem)] md:min-h-[80vh] flex items-start sm:items-center justify-center px-4 py-6 sm:py-12">
      <div className="w-full max-w-md bg-surface rounded-panel border border-line p-5 sm:p-8">
        <LoginFlow onDone={() => router.replace(next)} />
      </div>
    </div>
  )
}

export default function ConnexionPage() {
  return (
    <Suspense fallback={null}>
      <ConnexionContent />
    </Suspense>
  )
}
