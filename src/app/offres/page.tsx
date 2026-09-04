'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, X, PlusCircle } from 'lucide-react'
import { RESOURCE_TYPES, SENEGAL_REGIONS } from '@/lib/constants'

function OffresContent() {
  const searchParams = useSearchParams()

  const [offers, setOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [pages, setPages] = useState(1)

  const [resourceType, setResourceType] = useState(searchParams.get('resource_type') || '')
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')

  const fetchOffers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (resourceType) params.set('resource_type', resourceType)
      if (location) params.set('location', location)
      if (searchQuery) params.set('q', searchQuery)
      params.set('page', page.toString())
      params.set('per_page', '12')

      const res = await fetch(`/api/offers?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setOffers(data.items || [])
        setTotal(data.total || 0)
        setPages(data.pages || 1)
      }
    } catch (err) {
      console.error('Erreur chargement offres:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOffers()
  }, [resourceType, location, page])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchOffers()
  }

  const resetFilters = () => {
    setResourceType('')
    setLocation('')
    setSearchQuery('')
    setPage(1)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Explorer les offres de troc agricole
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {total} {total > 1 ? 'annonces disponibles' : 'annonce disponible'} à travers le Sénégal
          </p>
        </div>

        <Link
          href="/publier"
          className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Déposer une annonce</span>
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Mots-clés..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          {/* Resource Type */}
          <div className="relative">
            <select
              value={resourceType}
              onChange={(e) => {
                setResourceType(e.target.value)
                setPage(1)
              }}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="">Toutes les ressources</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                setPage(1)
              }}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            >
              <option value="">Toutes les régions</option>
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold py-2.5 px-4 rounded-xl text-sm transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Search className="w-4 h-4" />
              <span>Filtrer</span>
            </button>
            {(resourceType || location || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition"
                title="Effacer les filtres"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Resource Tabs */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => {
              setResourceType('')
              setPage(1)
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              resourceType === ''
                ? 'bg-emerald-700 text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            🔍 Tout afficher
          </button>
          {RESOURCE_TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => {
                setResourceType(t.value === resourceType ? '' : t.value)
                setPage(1)
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center gap-1.5 ${
                resourceType === t.value
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-4">
          <span className="text-5xl">🌾</span>
          <h3 className="text-xl font-bold text-slate-800">Aucune offre trouvée</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Aucune annonce ne correspond à vos critères de recherche. Essayez d'élargir la région ou de choisir une autre catégorie.
          </p>
          <button
            onClick={resetFilters}
            className="px-5 py-2.5 bg-emerald-100 text-emerald-800 text-sm font-bold rounded-xl hover:bg-emerald-200 transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {offers.map((offer) => {
            const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
              label: offer.resource_type,
              icon: '📦',
            }
            const hasImage = offer.images && offer.images.length > 0
            return (
              <Link
                key={offer.id}
                href={`/offres/${offer.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col group"
              >
                <div className="relative h-48 bg-slate-100 overflow-hidden">
                  {hasImage ? (
                    <img
                      src={offer.images[0].image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-50/50 text-emerald-700">
                      <span className="text-5xl">{resType.icon}</span>
                      <span className="text-xs font-bold mt-2 uppercase tracking-wide">
                        {resType.label}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-white/90 backdrop-blur text-xs font-bold text-emerald-800 flex items-center gap-1 shadow-xs">
                    <span>{resType.icon}</span>
                    <span>{resType.label}</span>
                  </div>
                  {offer.complement_type !== 'none' && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-amber-500 text-white text-[11px] font-bold shadow-xs">
                      + Complément
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-2 text-base group-hover:text-emerald-700 transition">
                      {offer.title}
                    </h3>

                    <div className="mt-3.5 p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-emerald-700 shrink-0">Propose :</span>
                        <span className="text-slate-700 truncate">{offer.offered_resource}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-amber-700 shrink-0">Recherche :</span>
                        <span className="text-slate-700 truncate">{offer.wanted_resource}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{offer.location}</span>
                    </div>
                    <span className="text-emerald-700 font-semibold truncate max-w-[110px]">
                      {offer.user?.full_name || 'Agriculteur'}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-6">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-slate-50"
          >
            Précédent
          </button>
          <span className="text-sm font-medium text-slate-600 px-3">
            Page {page} sur {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold disabled:opacity-50 hover:bg-slate-50"
          >
            Suivant
          </button>
        </div>
      )}
    </div>
  )
}

export default function OffresPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Chargement des offres...</div>}>
      <OffresContent />
    </Suspense>
  )
}
