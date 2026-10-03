'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import {
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Layers,
  ArrowLeft,
} from 'lucide-react'
import type { Offer } from '@/lib/types'
import OfferCard, { OfferGrid } from '@/components/OfferCard'

export default function PublicProfilePage() {
  const params = useParams()
  const userId = params.id as string

  const [profile, setProfile] = useState<any>(null)
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
    return <div className="p-16 text-center text-slate-500 font-medium">Chargement du profil...</div>
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
          🌾
        </div>
        <h2 className="text-xl font-bold text-slate-800">Profil introuvable</h2>
        <Link href="/offres" className="inline-block px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs transition">
          Retour aux offres
        </Link>
      </div>
    )
  }

  const userAvatar = profile.avatar_url || profile.avatarUrl || '/avatars/avatar-farmer-w.webp'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/offres"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la bourse d'échange</span>
        </Link>
      </div>

      {/* User Header Profile Card */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] flex flex-col sm:flex-row items-center gap-7">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-emerald-300 bg-emerald-50 shrink-0 shadow-sm">
          <img
            src={userAvatar}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2.5">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {profile.full_name || 'Agriculteur membre'}
            </h1>
            <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200/80 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Membre vérifié</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-medium">
            <MapPin className="w-4 h-4 text-emerald-600" />
            <span>{profile.city || profile.address || 'Sénégal'}</span>
          </p>

          {profile.bio && (
            <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">{profile.bio}</p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-5 pt-3 text-xs text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1.5 font-medium">
              <Layers className="w-4 h-4 text-emerald-700" />
              <strong className="text-slate-900">{profile.active_offers_count || 0}</strong> annonces actives
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              <strong className="text-slate-900">{profile.exchange_count || 0}</strong> trocs conclus
            </span>
            {profile.rating_avg > 0 && (
              <span className="flex items-center gap-1.5 text-amber-700 font-medium">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <strong className="text-amber-900">{profile.rating_avg.toFixed(1)}</strong> / 5
              </span>
            )}
          </div>
        </div>
      </div>

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
