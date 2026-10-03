'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSearchParams } from 'next/navigation'
import { Search, MapPin, X, Plus, ArrowRight, Sparkles, Filter, SlidersHorizontal } from 'lucide-react'
import { RESOURCE_TYPES, SENEGAL_REGIONS } from '@/lib/constants'

const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

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
      <div className="relative overflow-hidden bg-gradient-to-r from-[#022c22] to-[#064e3b] p-8 sm:p-10 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-emerald-500/20">
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Marché agricole en direct</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Explorer les offres de troc
          </h1>
          <p className="text-sm sm:text-base text-emerald-100/80">
            {total} {total > 1 ? 'annonces actives' : 'annonce active'} trouvée{total > 1 ? 's' : ''} au Sénégal
          </p>
        </div>

        <Link
          href="/publier"
          className="relative z-10 inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-slate-950 px-6 py-3.5 rounded-2xl font-bold text-sm shadow-[0_4px_14px_rgba(245,158,11,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Déposer une annonce</span>
        </Link>
      </div>

      {/* Filter Bar with Command-style Search */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] space-y-5">
        <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher une ressource..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
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
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition cursor-pointer"
            >
              <option value="">Toutes les catégories</option>
              {RESOURCE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.icon} {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Region */}
          <div className="relative flex items-center">
            <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 pointer-events-none" />
            <select
              value={location}
              onChange={(e) => {
                setLocation(e.target.value)
                setPage(1)
              }}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition cursor-pointer"
            >
              <option value="">Toutes les régions</option>
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button & Reset */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 text-white font-bold py-3 px-5 rounded-2xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs active:scale-95"
            >
              <Search className="w-4 h-4" />
              <span>Filtrer</span>
            </button>
            {(resourceType || location || searchQuery) && (
              <button
                type="button"
                onClick={resetFilters}
                className="p-3 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-2xl transition"
                title="Effacer les filtres"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </form>

        {/* Quick Resource Tabs with 3D Icons */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-slate-100">
          <button
            onClick={() => {
              setResourceType('')
              setPage(1)
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 ${
              resourceType === ''
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Tous les trocs
          </button>
          {RESOURCE_TYPES.map((t) => {
            const iconUrl = CATEGORY_ICONS[t.value] || '/avatars/avatar-sprout.webp'
            const isSelected = resourceType === t.value
            return (
              <button
                key={t.value}
                onClick={() => {
                  setResourceType(t.value === resourceType ? '' : t.value)
                  setPage(1)
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                  <Image src={iconUrl} alt="" width={14} height={14} />
                </div>
                <span>{t.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Offers Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-200/80"></div>
          ))}
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
            🌾
          </div>
          <h3 className="text-xl font-bold text-slate-900">Aucune offre trouvée</h3>
          <p className="text-sm text-slate-500">
            Aucune annonce ne correspond à vos critères de recherche. Essayez d'élargir la région ou de choisir une autre catégorie.
          </p>
          <button
            onClick={resetFilters}
            className="px-6 py-2.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 text-sm font-bold rounded-xl transition"
          >
            Réinitialiser les filtres
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
          {offers.map((offer) => {
            const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
              label: offer.resource_type,
              icon: '📦',
            }
            const iconUrl = CATEGORY_ICONS[offer.resource_type] || '/avatars/avatar-sprout.webp'
            const hasImage = offer.images && offer.images.length > 0
            const userAvatar = offer.user?.avatar_url || offer.user?.avatarUrl || '/avatars/avatar-farmer-w.webp'

            return (
              <Link
                key={offer.id}
                href={`/offres/${offer.id}`}
                className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col group card-lift"
              >
                <div className="relative h-52 bg-slate-100 overflow-hidden">
                  {hasImage ? (
                    <img
                      src={offer.images[0].image_url}
                      alt={offer.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-tr from-emerald-50 to-amber-50/50 text-emerald-800">
                      <div className="w-20 h-20 rounded-full overflow-hidden p-1 shadow-sm bg-white/80">
                        <Image
                          src={iconUrl}
                          alt={resType.label}
                          width={80}
                          height={80}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold mt-2 text-emerald-900 tracking-wide">
                        {resType.label}
                      </span>
                    </div>
                  )}

                  <div className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur text-xs font-bold text-emerald-900 flex items-center gap-1.5 shadow-sm border border-white/60">
                    <div className="w-4 h-4 rounded-full overflow-hidden shrink-0">
                      <Image src={iconUrl} alt="" width={16} height={16} />
                    </div>
                    <span>{resType.label}</span>
                  </div>

                  {offer.complement_type !== 'none' && (
                    <div className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-extrabold shadow-sm tracking-wide">
                      + Complément
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-2 text-lg group-hover:text-emerald-800 transition leading-snug">
                      {offer.title}
                    </h3>

                    <div className="mt-4 p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/70 space-y-2 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px] uppercase">
                          Propose
                        </span>
                        <span className="text-slate-800 font-medium truncate">{offer.offered_resource}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px] uppercase">
                          Recherche
                        </span>
                        <span className="text-slate-800 font-medium truncate">{offer.wanted_resource}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full overflow-hidden border border-emerald-200/80 bg-emerald-50 shrink-0">
                        <img
                          src={userAvatar}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-slate-800 truncate max-w-[130px]">
                          {offer.user?.full_name || 'Agriculteur'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          <span>{offer.location}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-emerald-700 font-bold text-xs group-hover:translate-x-1 transition-transform flex items-center gap-1">
                      <span>Voir</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-8">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition shadow-xs"
          >
            Précédent
          </button>
          <span className="text-sm font-semibold text-slate-600 px-4">
            Page {page} sur {pages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pages, p + 1))}
            disabled={page === pages}
            className="px-5 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 disabled:opacity-40 hover:bg-slate-50 transition shadow-xs"
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
    <Suspense fallback={<div className="p-16 text-center text-slate-500 font-medium">Chargement des offres...</div>}>
      <OffresContent />
    </Suspense>
  )
}
