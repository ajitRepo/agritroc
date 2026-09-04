'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { PlusCircle, Eye, Edit, Trash2, CheckCircle2, MapPin, Clock } from 'lucide-react'
import { RESOURCE_TYPES } from '@/lib/constants'

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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Mes annonces de troc</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Gérez vos propositions d'échanges, suivez les statuts et validez les trocs terminés.
          </p>
        </div>

        <Link
          href="/publier"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Nouvelle offre</span>
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-3">
        {[
          { id: 'all', label: 'Toutes les offres', count: offers.length },
          { id: 'active', label: 'Actives', count: offers.filter((o) => o.status === 'active').length },
          { id: 'completed', label: 'Conclues', count: offers.filter((o) => o.status === 'completed').length },
          { id: 'cancelled', label: 'Annulées', count: offers.filter((o) => o.status === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition flex items-center gap-2 ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-emerald-800 text-white' : 'bg-slate-100 text-slate-700'
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
            <div key={i} className="bg-white rounded-2xl h-36 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3">
          <span className="text-5xl">📦</span>
          <h3 className="text-lg font-bold text-slate-800">Aucune annonce dans cet onglet</h3>
          <p className="text-xs text-slate-500">Déposez une proposition de troc en quelques clics.</p>
          <Link
            href="/publier"
            className="inline-block mt-2 px-5 py-2.5 bg-emerald-700 text-white text-xs font-bold rounded-xl"
          >
            Déposer une annonce
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOffers.map((offer) => {
            const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
              label: offer.resource_type,
              icon: '📦',
            }
            return (
              <div
                key={offer.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-emerald-200 transition"
              >
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center text-2xl shrink-0 border border-emerald-100">
                    {offer.images && offer.images.length > 0 ? (
                      <img
                        src={offer.images[0].image_url}
                        alt=""
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      resType.icon
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                        {resType.label}
                      </span>
                      {offer.status === 'active' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active
                        </span>
                      )}
                      {offer.status === 'completed' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                          Conclue
                        </span>
                      )}
                      {offer.status === 'cancelled' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">
                          Annulée
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-slate-900 text-base">{offer.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {offer.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {offer.created_at
                          ? new Date(offer.created_at).toLocaleDateString('fr-FR')
                          : ''}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  <Link
                    href={`/offres/${offer.id}`}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Voir l'annonce"
                  >
                    <Eye className="w-4 h-4" />
                    <span className="hidden sm:inline">Détails</span>
                  </Link>

                  <Link
                    href={`/offres/${offer.id}/modifier`}
                    className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition"
                    title="Modifier l'annonce"
                  >
                    <Edit className="w-4 h-4" />
                    <span className="hidden sm:inline">Modifier</span>
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
