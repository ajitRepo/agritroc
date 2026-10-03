'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Plus, Edit, MapPin, Clock } from 'lucide-react'
import { RESOURCE_TYPES, CATEGORY_ICONS } from '@/lib/constants'
import type { Offer } from '@/lib/types'

export default function MesOffresPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const [offers, setOffers] = useState<Offer[]>([])
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-8 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-ink">Mes annonces</h1>
          <p className="mt-1 text-ink-muted">Suivez et gérez vos propositions de troc.</p>
        </div>
        <Link
          href="/publier"
          className="hidden sm:inline-flex items-center gap-2 h-11 px-4 rounded-button bg-primary hover:bg-primary-dark text-white font-semibold text-sm transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" aria-hidden />
          Nouvelle annonce
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0" role="tablist">
        {[
          { id: 'all', label: 'Toutes', count: offers.length },
          { id: 'active', label: 'Actives', count: offers.filter((o) => o.status === 'active').length },
          { id: 'completed', label: 'Conclues', count: offers.filter((o) => o.status === 'completed').length },
          { id: 'cancelled', label: 'Annulées', count: offers.filter((o) => o.status === 'cancelled').length },
        ].map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`shrink-0 px-4 h-10 rounded-full text-sm font-semibold border transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === tab.id
                ? 'bg-primary text-white border-primary'
                : 'bg-surface text-ink-muted border-line hover:text-ink'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-surface-secondary text-ink-muted'
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
            <div key={i} className="rounded-card h-28 skeleton" aria-hidden></div>
          ))}
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-surface rounded-card p-8 text-center border border-line space-y-3">
          <div className="text-3xl" aria-hidden>
            📦
          </div>
          <h2 className="font-semibold text-ink">
            {offers.length === 0 ? "Vous n'avez pas encore publié d'annonce." : 'Aucune annonce dans cet onglet.'}
          </h2>
          <p className="text-sm text-ink-muted">Proposez un échange : c&apos;est gratuit et rapide.</p>
          <Link
            href="/publier"
            className="inline-flex items-center gap-2 h-12 px-6 bg-primary hover:bg-primary-dark text-white font-semibold rounded-button transition-colors"
          >
            <Plus className="w-4 h-4" aria-hidden />
            <span>Publier une annonce</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredOffers.map((offer) => {
            const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
              label: offer.resource_type,
              icon: '📦',
            }
            const iconUrl = CATEGORY_ICONS[offer.resource_type] || '/avatars/avatar-sprout.webp'

            return (
              <div
                key={offer.id}
                className="bg-surface p-3.5 sm:p-4 rounded-card border border-line flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3"
              >
                <Link href={`/offres/${offer.id}`} className="flex items-start gap-3.5 min-w-0 group">
                  <div className="w-16 h-16 rounded-button bg-surface-secondary flex items-center justify-center overflow-hidden shrink-0">
                    {offer.images && offer.images.length > 0 ? (
                      <img
                        src={offer.images[0].image_url}
                        alt=""
                        loading="lazy" className="w-full h-full object-cover"
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
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-secondary text-ink-muted">
                        {resType.label}
                      </span>
                      {offer.status === 'active' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary-soft text-primary">
                          Active
                        </span>
                      )}
                      {offer.status === 'completed' && (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-ochre-soft text-warning">
                          ✓ Conclue
                        </span>
                      )}
                      {offer.status === 'cancelled' && (
                        <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-surface-secondary text-ink-subtle">
                          Annulée
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-ink line-clamp-2 group-hover:text-primary">{offer.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-ink-subtle">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" aria-hidden />
                        <span className="truncate">{offer.location}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" aria-hidden />
                        <span>
                          {offer.created_at
                            ? new Date(offer.created_at).toLocaleDateString('fr-FR')
                            : ''}
                        </span>
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:shrink-0">
                  <Link
                    href={`/offres/${offer.id}/modifier`}
                    className="flex-1 sm:flex-none h-10 px-4 bg-surface-secondary hover:bg-line text-ink rounded-button text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Edit className="w-4 h-4" aria-hidden />
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
