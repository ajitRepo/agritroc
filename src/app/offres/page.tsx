'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search, MapPin, X, Plus, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react'
import { RESOURCE_TYPES, SENEGAL_REGIONS, categoryLabel } from '@/lib/constants'
import type { Offer } from '@/lib/types'
import OfferCard, { OfferGrid, OfferGridSkeleton } from '@/components/OfferCard'

const PER_PAGE = 12

function OffresContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // L'URL est la source de vérité : filtres partageables et bouton retour fiable
  const resourceType = searchParams.get('resource_type') || ''
  const location = searchParams.get('location') || ''
  const query = searchParams.get('q') || ''
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))

  const [searchInput, setSearchInput] = useState(query)
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [reloadKey, setReloadKey] = useState(0)

  // Resynchronise le champ quand la recherche change depuis l'extérieur (retour, lien)
  const [syncedQuery, setSyncedQuery] = useState(query)
  if (query !== syncedQuery) {
    setSyncedQuery(query)
    setSearchInput(query)
  }

  useEffect(() => {
    const controller = new AbortController()
    async function fetchOffers() {
      setLoading(true)
      setFailed(false)
      try {
        const params = new URLSearchParams()
        if (resourceType) params.set('resource_type', resourceType)
        if (location) params.set('location', location)
        if (query) params.set('q', query)
        params.set('page', page.toString())
        params.set('per_page', String(PER_PAGE))

        const res = await fetch(`/api/offers?${params.toString()}`, { signal: controller.signal })
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        setOffers(data.items || [])
        setTotal(data.total || 0)
        setPages(data.pages || 1)
      } catch (err) {
        if ((err as Error).name === 'AbortError') return
        console.error('Erreur chargement offres:', err)
        setFailed(true)
      }
      setLoading(false)
    }
    fetchOffers()
    return () => controller.abort()
  }, [resourceType, location, query, page, reloadKey])

  const updateParams = (changes: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    if (!('page' in changes)) params.delete('page')
    const qs = params.toString()
    router.replace(qs ? `/offres?${qs}` : '/offres', { scroll: false })
  }

  const goToPage = (p: number) => {
    updateParams({ page: p > 1 ? String(p) : '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const hasFilters = !!(resourceType || location || query)
  const activeFilters = [
    query && { key: 'q', label: `« ${query} »` },
    resourceType && { key: 'resource_type', label: categoryLabel(resourceType) },
    location && { key: 'location', label: location },
  ].filter(Boolean) as { key: string; label: string }[]

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">Explorer les annonces</h1>
        <Link
          href="/publier"
          className="hidden md:inline-flex items-center gap-2 h-10 px-4 rounded-button bg-primary-soft text-primary font-semibold text-sm hover:bg-primary hover:text-white transition-colors"
        >
          <Plus className="w-4 h-4" aria-hidden />
          Publier
        </Link>
      </div>

      {/* Recherche + région */}
      <div className="sticky top-14 md:top-16 z-30 -mx-4 px-4 sm:mx-0 sm:px-0 py-2 bg-background/95 backdrop-blur space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              updateParams({ q: searchInput.trim() })
            }}
            className="flex-1 flex items-center gap-2 pl-3 pr-1.5 h-12 rounded-button bg-surface border border-line focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent"
          >
            <Search className="w-5 h-5 text-primary shrink-0" aria-hidden />
            <label htmlFor="offres-search" className="sr-only">
              Rechercher un produit
            </label>
            <input
              id="offres-search"
              type="search"
              enterKeyHint="search"
              placeholder="Rechercher un produit agricole"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 min-w-0 bg-transparent outline-none text-base text-ink placeholder:text-ink-subtle"
            />
            <button
              type="submit"
              className="h-9 px-4 rounded-control bg-primary hover:bg-primary-dark text-white text-sm font-semibold cursor-pointer"
            >
              OK
            </button>
          </form>
          <label className="sm:w-56 flex items-center gap-2 px-3 h-12 rounded-button bg-surface border border-line focus-within:ring-2 focus-within:ring-primary">
            <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden />
            <span className="sr-only">Région</span>
            <select
              value={location}
              onChange={(e) => updateParams({ location: e.target.value })}
              className="w-full bg-transparent outline-none text-sm font-medium text-ink cursor-pointer"
            >
              <option value="">Tout le Sénégal</option>
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Catégories : une seule rangée défilante sur mobile */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap" role="group" aria-label="Catégories">
          {[{ value: '', label: 'Tout' }, ...RESOURCE_TYPES].map((t) => {
            const selected = resourceType === t.value
            return (
              <button
                key={t.value || 'all'}
                aria-pressed={selected}
                onClick={() => updateParams({ resource_type: selected ? '' : t.value })}
                className={`shrink-0 px-3.5 h-9 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
                  selected
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-ink-muted border-line hover:border-primary/40 hover:text-ink'
                }`}
              >
                {t.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Résultats + filtres actifs */}
      <div className="flex flex-wrap items-center gap-2 min-h-9" aria-live="polite">
        <p className="text-sm text-ink-muted mr-1">
          {loading ? 'Recherche…' : `${total} annonce${total > 1 ? 's' : ''}`}
        </p>
        {activeFilters.map((f) => (
          <button
            key={f.key}
            onClick={() => updateParams({ [f.key]: '' })}
            className="inline-flex items-center gap-1 h-8 pl-3 pr-2 rounded-full bg-primary-soft text-primary text-sm font-medium hover:bg-primary/15 cursor-pointer"
            aria-label={`Retirer le filtre ${f.label}`}
          >
            {f.label}
            <X className="w-3.5 h-3.5" aria-hidden />
          </button>
        ))}
        {activeFilters.length > 1 && (
          <button
            onClick={() => router.replace('/offres', { scroll: false })}
            className="h-8 px-2 text-sm font-medium text-ink-muted underline underline-offset-2 hover:text-ink cursor-pointer"
          >
            Tout effacer
          </button>
        )}
      </div>

      {loading ? (
        <OfferGridSkeleton />
      ) : failed ? (
        <div className="bg-surface rounded-card border border-line p-8 text-center space-y-3 max-w-md mx-auto">
          <AlertCircle className="w-8 h-8 text-warning mx-auto" aria-hidden />
          <h2 className="font-semibold text-ink">Impossible de charger les annonces.</h2>
          <p className="text-sm text-ink-muted">Vérifiez votre connexion internet puis réessayez.</p>
          <button
            onClick={() => setReloadKey((k) => k + 1)}
            className="h-11 px-5 rounded-button bg-primary text-white font-semibold text-sm cursor-pointer"
          >
            Réessayer
          </button>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-surface rounded-card border border-line p-8 text-center space-y-3 max-w-md mx-auto">
          <p className="text-3xl" aria-hidden>
            🌾
          </p>
          <h2 className="font-semibold text-ink">
            {hasFilters ? 'Aucune annonce ne correspond à votre recherche.' : 'Aucune annonce pour le moment.'}
          </h2>
          <p className="text-sm text-ink-muted">
            {hasFilters
              ? 'Essayez une autre région ou une autre catégorie.'
              : 'Soyez le premier à proposer un échange.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center pt-1">
            {hasFilters && (
              <button
                onClick={() => router.replace('/offres', { scroll: false })}
                className="h-11 px-5 rounded-button bg-surface-secondary hover:bg-line text-ink font-semibold text-sm cursor-pointer"
              >
                Voir toutes les annonces
              </button>
            )}
            <Link
              href="/publier"
              className="inline-flex items-center justify-center gap-2 h-11 px-5 rounded-button bg-primary hover:bg-primary-dark text-white font-semibold text-sm"
            >
              <Plus className="w-4 h-4" aria-hidden />
              Publier une annonce
            </Link>
          </div>
        </div>
      ) : (
        <OfferGrid>
          {offers.map((offer) => (
            <OfferCard key={offer.id} offer={offer} />
          ))}
        </OfferGrid>
      )}

      {!loading && pages > 1 && (
        <nav className="flex justify-center items-center gap-2 pt-4" aria-label="Pagination">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            aria-label="Page précédente"
            className="w-11 h-11 flex items-center justify-center bg-surface border border-line rounded-button text-ink disabled:opacity-40 hover:bg-surface-secondary cursor-pointer disabled:cursor-default"
          >
            <ChevronLeft className="w-5 h-5" aria-hidden />
          </button>
          <span className="text-sm font-medium text-ink-muted px-3">
            Page {page} sur {pages}
          </span>
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= pages}
            aria-label="Page suivante"
            className="w-11 h-11 flex items-center justify-center bg-surface border border-line rounded-button text-ink disabled:opacity-40 hover:bg-surface-secondary cursor-pointer disabled:cursor-default"
          >
            <ChevronRight className="w-5 h-5" aria-hidden />
          </button>
        </nav>
      )}
    </div>
  )
}

export default function OffresPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <OfferGridSkeleton />
        </div>
      }
    >
      <OffresContent />
    </Suspense>
  )
}
