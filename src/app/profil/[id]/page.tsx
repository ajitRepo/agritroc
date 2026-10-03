'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import {
  User,
  MapPin,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowLeft,
  ExternalLink,
  Sparkles,
  ArrowRight,
} from 'lucide-react'
import { RESOURCE_TYPES } from '@/lib/constants'

const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

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

      {/* User's Active Offers */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Offres de troc proposées ({profile.offers?.length || 0})
        </h2>

        {!profile.offers || profile.offers.length === 0 ? (
          <div className="p-12 bg-white rounded-3xl border border-slate-200/80 text-center text-sm text-slate-500 shadow-xs">
            Aucune offre active en ce moment pour cet exploitant.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.offers.map((offer: any) => {
              const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
                label: offer.resource_type,
                icon: '📦',
              }
              const iconUrl = CATEGORY_ICONS[offer.resource_type] || '/avatars/avatar-sprout.webp'

              return (
                <Link
                  key={offer.id}
                  href={`/offres/${offer.id}`}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-xl transition-all duration-300 flex flex-col group p-6 space-y-4 card-lift"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-full flex items-center gap-1.5 shadow-xs">
                      <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                        <Image src={iconUrl} alt="" width={14} height={14} />
                      </div>
                      <span>{resType.label}</span>
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{offer.location}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base line-clamp-2 group-hover:text-emerald-800 transition">
                    {offer.title}
                  </h3>

                  <div className="p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200/70 text-xs space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                        Offre
                      </span>
                      <span className="text-slate-800 font-medium truncate">{offer.offered_resource}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                        Cherche
                      </span>
                      <span className="text-slate-800 font-medium truncate">{offer.wanted_resource}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs font-bold text-emerald-700">
                    <span>Consulter l'annonce</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
