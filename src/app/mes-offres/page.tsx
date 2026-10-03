'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Plus, Eye, Edit, Trash2, CheckCircle2, MapPin, Clock, Sparkles } from 'lucide-react'
import { RESOURCE_TYPES } from '@/lib/constants'

const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

export default function MesOffresPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/connexion')
      return
    }

    async function loadMyOffers() {
      try {
        const res = await fetch('/api/offers/my', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
          },
        })
        if (res.ok) {
          const data = await res.json()
          setOffers(data)
        }
      } catch (err) {
        console.error('Erreur chargement mes offres:', err)
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated) loadMyOffers()
  }, [isLoading, isAuthenticated, router])

  const filteredOffers = offers.filter((o) => {
    if (activeTab === 'all') return true
    return o.status === activeTab
  })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#022c22] to-[#064e3b] p-8 sm:p-10 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border border-emerald-500/20">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Tableau de bord</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">Mes annonces de troc</h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Suivez les statuts de vos offres, mettez à jour vos demandes et concluez vos trocs.
          </p>
        </div>

        <Link
          href="/publier"
          className="relative z-10 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Nouvelle offre</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200/80 pb-3">
        {[
          { id: 'all', label: 'Toutes les offres', count: offers.length },
          { id: 'active', label: 'Actives', count: offers.filter((o) => o.status === 'active').length },
          { id: 'completed', label: 'Conclues', count: offers.filter((o) => o.status === 'completed').length },
          { id: 'cancelled', label: 'Annulées', count: offers.filter((o) => o.status === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-emerald-900 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-36 animate-pulse border border-slate-200/80"></div>
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
            📦
          </div>
          <h3 className="text-xl font-bold text-slate-900">Aucune annonce dans cet onglet</h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Déposez une proposition de troc agricole en direct et trouvez un partenaire.
          </p>
          <Link
            href="/publier"
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-2xl shadow transition"
          >
            <span>Déposer une annonce</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => {
            const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
              label: offer.resource_type,
              icon: '📦',
            }
            const iconUrl = CATEGORY_ICONS[offer.resource_type] || '/avatars/avatar-sprout.webp'

            return (
              <div
                key={offer.id}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:border-emerald-300 transition-all card-lift"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-800 flex items-center justify-center overflow-hidden shrink-0 border border-emerald-100 p-1 shadow-inner">
                    {offer.images && offer.images.length > 0 ? (
                      <img
                        src={offer.images[0].image_url}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <Image
                        src={iconUrl}
                        alt=""
                        width={50}
                        height={50}
                        className="w-full h-full object-contain"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                        {resType.label}
                      </span>
                      {offer.status === 'active' && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                          🟢 Active
                        </span>
                      )}
                      {offer.status === 'completed' && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          ✓ Conclue
                        </span>
                      )}
                      {offer.status === 'cancelled' && (
                        <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          Annulée
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">{offer.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{offer.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {offer.created_at
                            ? new Date(offer.created_at).toLocaleDateString('fr-FR')
                            : ''}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2.5 self-end sm:self-center shrink-0">
                  <Link
                    href={`/offres/${offer.id}`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition"
                    title="Voir l'annonce"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Détails</span>
                  </Link>

                  <Link
                    href={`/offres/${offer.id}/modifier`}
                    className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl text-xs font-bold flex items-center gap-1.5 transition"
                    title="Modifier l'annonce"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Modifier</span>
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
