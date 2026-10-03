'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { MapPin, Star, ArrowLeft } from 'lucide-react'
import type { Offer } from '@/lib/types'
import OfferCard, { OfferGrid, OfferGridSkeleton } from '@/components/OfferCard'

interface PublicProfile {
  full_name?: string | null
  avatar_url?: string | null
  avatarUrl?: string | null
  city?: string | null
  address?: string | null
  bio?: string | null
  created_at?: string
  active_offers_count?: number
  exchange_count?: number
  rating_avg: number
  offers?: Offer[]
}

export default function PublicProfilePage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPublic() {
      try {
        const res = await fetch(`/api/profile/${userId}`)
        if (res.ok) {
          const data = await res.json()
          setProfile(data)
        }
      } catch (err) {
        console.error('Erreur profil public:', err)
      } finally {
        setLoading(false)
      }
    }
    if (userId) fetchPublic()
  }, [userId])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6" aria-busy>
        <div className="h-36 rounded-card skeleton" />
        <OfferGridSkeleton count={4} />
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        <p className="text-4xl" aria-hidden>
          🌾
        </p>
        <h1 className="text-xl font-bold text-ink">Ce profil est introuvable.</h1>
        <p className="text-sm text-ink-muted">Le compte a peut-être été supprimé.</p>
        <Link
          href="/offres"
          className="inline-flex items-center justify-center h-11 px-5 rounded-button bg-primary text-white font-semibold text-sm"
        >
          Voir les annonces
        </Link>
      </div>
    )
  }

  const userAvatar = profile.avatar_url || profile.avatarUrl || '/avatars/avatar-farmer-w.webp'
  const memberSince = profile.created_at
    ? new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    : null

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8 space-y-6">
      <button
        onClick={() => (window.history.length > 1 ? router.back() : router.push('/offres'))}
        className="inline-flex items-center gap-1.5 h-10 -ml-2 px-2 rounded-control text-sm font-semibold text-ink-muted hover:text-ink cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" aria-hidden />
        Retour
      </button>

      <section className="bg-surface rounded-card border border-line p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-4">
          <img src={userAvatar} alt="" className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover bg-primary-soft shrink-0" />
          <div className="min-w-0 space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-bold text-ink">{profile.full_name || 'Membre AgriTroc'}</h1>
            <p className="flex items-center gap-1.5 text-ink-muted">
              <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden />
              <span className="truncate">{[profile.address, profile.city].filter(Boolean).join(', ') || 'Sénégal'}</span>
            </p>
            {memberSince && <p className="text-sm text-ink-subtle">Membre depuis {memberSince}</p>}
          </div>
        </div>

        {profile.bio && <p className="text-ink-muted leading-relaxed">{profile.bio}</p>}

        <dl className="grid grid-cols-3 gap-2 text-center max-w-md">
          <div className="rounded-button bg-surface-secondary py-2.5">
            <dt className="text-xs text-ink-muted">Annonces</dt>
            <dd className="text-lg font-bold text-ink">{profile.active_offers_count || 0}</dd>
          </div>
          <div className="rounded-button bg-surface-secondary py-2.5">
            <dt className="text-xs text-ink-muted">Trocs conclus</dt>
            <dd className="text-lg font-bold text-ink">{profile.exchange_count || 0}</dd>
          </div>
          <div className="rounded-button bg-surface-secondary py-2.5">
            <dt className="text-xs text-ink-muted">Note</dt>
            <dd className="text-lg font-bold text-ink flex items-center justify-center gap-1">
              {profile.rating_avg > 0 ? (
                <>
                  <Star className="w-4 h-4 fill-ochre text-ochre" aria-hidden />
                  {profile.rating_avg.toFixed(1)}
                </>
              ) : (
                <span className="text-sm font-medium text-ink-subtle">—</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {/* Annonces actives du membre */}
      <section className="space-y-4">
        <h2 className="text-lg sm:text-2xl font-bold text-ink">
          Annonces en cours ({profile.offers?.length || 0})
        </h2>

        {!profile.offers || profile.offers.length === 0 ? (
          <div className="p-8 bg-surface rounded-card border border-line text-center text-sm text-ink-muted">
            Ce membre n&apos;a pas d&apos;annonce en cours.
          </div>
        ) : (
          <OfferGrid>
            {profile.offers.map((offer: Offer) => (
              <OfferCard key={offer.id} offer={offer} />
            ))}
          </OfferGrid>
        )}
      </section>
    </div>
  )
}
