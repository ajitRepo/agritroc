'use client'

import React, { useState, useEffect, useSyncExternalStore } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, Search, MapPin, Plus, Check, AlertCircle } from 'lucide-react'
import { RESOURCE_TYPES, SENEGAL_REGIONS, categoryIcon, seasonalSuggestions } from '@/lib/constants'
import { useAuth } from '@/context/AuthContext'
import type { Offer } from '@/lib/types'
import OfferCard, { OfferGrid, OfferGridSkeleton } from '@/components/OfferCard'

const DEFAULT_SEARCHES = ['Arachide', 'Semences', 'Tracteur', 'Bétail', 'Fourrage']

// Mois courant lu côté client uniquement : la page est pré-rendue au build,
// elle ne doit pas figer la saison du jour de déploiement
const noopSubscribe = () => () => {}
function useMonth(): number | null {
  return useSyncExternalStore(noopSubscribe, () => new Date().getMonth(), () => null)
}

function regionOf(city?: string | null): string {
  if (!city) return ''
  return SENEGAL_REGIONS.find((r) => city.toLowerCase().includes(r.toLowerCase())) || ''
}

const STEPS = [
  { title: 'Publiez', text: 'Ce que vous avez, et ce que vous voulez en échange.' },
  { title: 'Discutez', text: 'Le vendeur vous répond directement sur WhatsApp.' },
  { title: 'Échangez', text: 'Rencontrez-vous et concluez le troc sur place.' },
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [offers, setOffers] = useState<Offer[]>([])
  const [loading, setLoading] = useState(true)
  const [failed, setFailed] = useState(false)
  const { user } = useAuth()
  const userRegion = regionOf(user?.city)
  const [nearby, setNearby] = useState<Offer[]>([])
  const month = useMonth()
  const season = month === null ? null : seasonalSuggestions(month)

  useEffect(() => {
    async function loadRecentOffers() {
      try {
        const res = await fetch('/api/offers?per_page=8')
        if (!res.ok) throw new Error(String(res.status))
        const data = await res.json()
        setOffers(data.items || [])
      } catch (err) {
        console.error('Error fetching offers:', err)
        setFailed(true)
      } finally {
        setLoading(false)
      }
    }
    loadRecentOffers()
  }, [])

  // « Près de chez vous » : annonces de la région du profil
  useEffect(() => {
    if (!userRegion) return
    let cancelled = false
    fetch(`/api/offers?per_page=4&location=${encodeURIComponent(userRegion)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setNearby(data.items || [])
      })
      .catch(() => undefined)
    return () => {
      cancelled = true
    }
  }, [userRegion])

  const goSearch = (q: string, region = selectedRegion) => {
    const params = new URLSearchParams()
    if (q.trim()) params.set('q', q.trim())
    if (region) params.set('location', region)
    router.push(`/offres?${params.toString()}`)
  }

  return (
    <div className="pb-12 md:pb-20">
      {/* Hero : comprendre AgriTroc et chercher, tout de suite */}
      <section className="border-b border-line bg-gradient-to-b from-primary-soft/70 to-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8 sm:pt-14 sm:pb-14">
          <div className="max-w-2xl">
            <h1 className="text-[26px] leading-tight sm:text-5xl font-extrabold tracking-tight text-ink">
              Échangez vos produits agricoles, <span className="text-primary">directement.</span>
            </h1>
            <p className="mt-2 sm:mt-4 text-base sm:text-lg text-ink-muted">
              Semences, récoltes, bétail, matériel : trouvez ce qu&apos;il vous faut près de chez vous au Sénégal.
            </p>
          </div>

          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              goSearch(searchQuery)
            }}
            className="mt-5 sm:mt-8 max-w-3xl flex flex-col sm:flex-row gap-2 bg-surface p-2 rounded-panel border border-line shadow-[0_8px_30px_-16px_rgba(23,34,27,0.25)]"
          >
            <label className="sm:flex-1 flex items-center gap-3 px-3 h-12 shrink-0 rounded-button bg-surface-secondary focus-within:bg-surface focus-within:ring-2 focus-within:ring-primary transition">
              <Search className="w-5 h-5 text-primary shrink-0" aria-hidden />
              <span className="sr-only">Que recherchez-vous ?</span>
              <input
                type="search"
                enterKeyHint="search"
                placeholder="Que recherchez-vous ?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-base text-ink placeholder:text-ink-subtle"
              />
            </label>
            <div className="flex gap-2">
              <label className="flex-1 sm:w-48 flex items-center gap-2 px-3 h-12 rounded-button bg-surface-secondary focus-within:ring-2 focus-within:ring-primary">
                <MapPin className="w-4 h-4 text-primary shrink-0" aria-hidden />
                <span className="sr-only">Région</span>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
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
              <button
                type="submit"
                className="h-12 px-5 rounded-button bg-primary hover:bg-primary-dark text-white font-semibold text-base flex items-center gap-2 transition-colors active:scale-[0.98] cursor-pointer"
              >
                <span>Rechercher</span>
              </button>
            </div>
          </form>

          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap">
            {season && <span className="shrink-0 text-sm font-semibold text-ochre">{season.title} :</span>}
            {(season?.searches || DEFAULT_SEARCHES).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => goSearch(q)}
                className="shrink-0 px-3.5 h-9 rounded-full bg-surface border border-line text-sm font-medium text-ink-muted hover:text-primary hover:border-primary/40 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          <ul className="mt-5 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-ink-muted">
            {['Gratuit, sans commission', 'Contact direct sur WhatsApp', 'Les 14 régions'].map((t) => (
              <li key={t} className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-primary" aria-hidden />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-14 pt-8 sm:pt-12">
        {/* Catégories */}
        <section aria-labelledby="cat-title">
          <h2 id="cat-title" className="text-lg sm:text-2xl font-bold text-ink mb-4">
            Catégories
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 sm:gap-4">
            {RESOURCE_TYPES.map((cat) => (
              <Link
                key={cat.value}
                href={`/offres?resource_type=${cat.value}`}
                className="group flex flex-col items-center gap-2 p-3 sm:p-4 rounded-card bg-surface border border-line hover:border-primary/40 transition-colors active:scale-[0.98]"
              >
                <span className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-surface-secondary flex items-center justify-center overflow-hidden">
                  <Image src={categoryIcon(cat.value)} alt="" width={56} height={56} />
                </span>
                <span className="text-xs sm:text-sm font-semibold text-ink text-center leading-tight group-hover:text-primary">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Près de chez vous */}
        {userRegion && nearby.length > 0 && (
          <section aria-labelledby="nearby-title">
            <div className="flex items-end justify-between gap-4 mb-4">
              <h2 id="nearby-title" className="text-lg sm:text-2xl font-bold text-ink">
                Près de chez vous · {userRegion}
              </h2>
              <Link
                href={`/offres?location=${encodeURIComponent(userRegion)}`}
                className="inline-flex items-center gap-1 h-10 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            </div>
            <OfferGrid>
              {nearby.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </OfferGrid>
          </section>
        )}

        {/* Dernières annonces */}
        <section aria-labelledby="latest-title">
          <div className="flex items-end justify-between gap-4 mb-4">
            <h2 id="latest-title" className="text-lg sm:text-2xl font-bold text-ink">
              Dernières annonces
            </h2>
            {offers.length > 0 && (
              <Link
                href="/offres"
                className="inline-flex items-center gap-1 h-10 text-sm font-semibold text-primary hover:text-primary-dark"
              >
                Voir tout
                <ArrowRight className="w-4 h-4" aria-hidden />
              </Link>
            )}
          </div>

          {loading ? (
            <OfferGridSkeleton count={4} />
          ) : failed ? (
            <div className="bg-surface rounded-card border border-line p-6 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-warning mx-auto" aria-hidden />
              <p className="font-semibold text-ink">Impossible de charger les annonces.</p>
              <p className="text-sm text-ink-muted">Vérifiez votre connexion internet puis réessayez.</p>
              <button
                onClick={() => window.location.reload()}
                className="h-11 px-5 rounded-button bg-surface-secondary hover:bg-line text-ink font-semibold text-sm cursor-pointer"
              >
                Réessayer
              </button>
            </div>
          ) : offers.length === 0 ? (
            <div className="bg-surface rounded-card border border-line p-8 text-center space-y-3">
              <p className="text-3xl" aria-hidden>
                🌾
              </p>
              <p className="font-semibold text-ink">Aucune annonce pour le moment.</p>
              <p className="text-sm text-ink-muted">Soyez le premier à proposer un échange dans votre région.</p>
              <Link
                href="/publier"
                className="inline-flex items-center gap-2 h-12 px-6 rounded-button bg-primary hover:bg-primary-dark text-white font-semibold"
              >
                <Plus className="w-4 h-4" aria-hidden />
                Publier une annonce
              </Link>
            </div>
          ) : (
            <OfferGrid>
              {offers.map((offer) => (
                <OfferCard key={offer.id} offer={offer} />
              ))}
            </OfferGrid>
          )}
        </section>

        {/* Comment ça marche — 3 étapes courtes */}
        <section aria-labelledby="how-title" className="rounded-panel bg-surface border border-line p-5 sm:p-10">
          <h2 id="how-title" className="text-lg sm:text-2xl font-bold text-ink">
            Comment ça marche ?
          </h2>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3 sm:gap-8">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-3.5">
                <span className="w-9 h-9 shrink-0 rounded-full bg-primary-soft text-primary font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-semibold text-ink">{step.title}</h3>
                  <p className="text-sm text-ink-muted mt-0.5">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Appel à publier */}
        <section className="rounded-panel bg-primary-dark text-white p-6 sm:p-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div>
            <h2 className="text-xl sm:text-3xl font-bold">Vous avez un surplus à échanger ?</h2>
            <p className="mt-1.5 text-white/80">Publier une annonce est gratuit et prend moins de 2 minutes.</p>
          </div>
          <Link
            href="/publier"
            className="shrink-0 inline-flex items-center justify-center gap-2 h-12 px-6 rounded-button bg-white text-primary-dark font-semibold hover:bg-primary-soft transition-colors"
          >
            <Plus className="w-5 h-5" aria-hidden />
            Publier une annonce
          </Link>
        </section>
      </div>
    </div>
  )
}
