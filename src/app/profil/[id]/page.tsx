'use client'

import React, { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
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
} from 'lucide-react'
import { RESOURCE_TYPES } from '@/lib/constants'

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
    return <div className="p-12 text-center text-slate-500">Chargement du profil...</div>
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-5xl">🌾</span>
        <h2 className="text-xl font-bold text-slate-800">Profil introuvable</h2>
        <Link href="/offres" className="text-sm text-emerald-700 font-semibold hover:underline">
          Retour aux offres
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href="/offres"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux annonces</span>
        </Link>
      </div>

      {/* User Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-3xl shrink-0 overflow-hidden border-2 border-emerald-300">
          {profile.avatar_url || profile.avatarUrl ? (
            <img
              src={profile.avatar_url || profile.avatarUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            profile.full_name?.[0] || 'U'
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-2">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {profile.full_name || 'Agriculteur membre'}
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Membre vérifié</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 flex items-center justify-center sm:justify-start gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{profile.city || profile.address || 'Sénégal'}</span>
          </p>

          {profile.bio && (
            <p className="text-xs sm:text-sm text-slate-600 italic max-w-2xl">{profile.bio}</p>
          )}

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <strong>{profile.active_offers_count || 0}</strong> offres actives
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <strong>{profile.exchange_count || 0}</strong> trocs conclus
            </span>
            {profile.rating_avg > 0 && (
              <span className="flex items-center gap-1 text-amber-700">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <strong>{profile.rating_avg.toFixed(1)}</strong> / 5
              </span>
            )}
          </div>
        </div>
      </div>

      {/* User's Active Offers */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          Offres de troc proposées par {profile.full_name || 'ce membre'}
        </h2>

        {!profile.offers || profile.offers.length === 0 ? (
          <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
            Aucune offre active en ce moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.offers.map((offer: any) => {
              const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
                label: offer.resource_type,
                icon: '📦',
              }
              return (
                <Link
                  key={offer.id}
                  href={`/offres/${offer.id}`}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group p-5 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-800 rounded-lg flex items-center gap-1">
                      <span>{resType.icon}</span>
                      <span>{resType.label}</span>
                    </span>
                    <span className="text-xs text-slate-400">{offer.location}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm line-clamp-2 group-hover:text-emerald-700 transition">
                    {offer.title}
                  </h3>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-emerald-700">Offre :</span>
                      <span className="text-slate-700 truncate">{offer.offered_resource}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="font-bold text-amber-700">Cherche :</span>
                      <span className="text-slate-700 truncate">{offer.wanted_resource}</span>
                    </div>
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
