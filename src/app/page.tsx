'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Sprout,
  ArrowRight,
  Search,
  MapPin,
  ShieldCheck,
  RefreshCw,
  PhoneCall,
  Sparkles,
  Layers,
  ArrowLeftRight,
} from 'lucide-react'
import { RESOURCE_TYPES, SENEGAL_REGIONS } from '@/lib/constants'

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRegion, setSelectedRegion] = useState('')
  const [featuredOffers, setFeaturedOffers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecentOffers() {
      try {
        const res = await fetch('/api/offers?per_page=6')
        if (res.ok) {
          const data = await res.json()
          setFeaturedOffers(data.items || [])
        }
      } catch (err) {
        console.error('Error fetching offers:', err)
      } finally {
        setLoading(false)
      }
    }
    loadRecentOffers()
  }, [])

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Decorative background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute -top-24 left-1/4 w-96 h-96 bg-emerald-400 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-amber-400 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>La 1ère plateforme de troc agricole au Sénégal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight">
            Échangez vos ressources agricoles <br className="hidden sm:inline" />
            <span className="text-amber-400 underline decoration-emerald-500/50 underline-offset-8">
              directement et sans intermédiaire
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed">
            Semences, bétail, parcelles irriguées, machines agricoles ou surplus de récoltes : trouvez ce dont votre exploitation a besoin grâce au troc solidaire.
          </p>

          {/* Search Box */}
          <div className="pt-4 max-w-4xl mx-auto">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const params = new URLSearchParams()
                if (searchQuery) params.set('q', searchQuery)
                if (selectedRegion) params.set('location', selectedRegion)
                window.location.href = `/offres?${params.toString()}`
              }}
              className="bg-white p-2 sm:p-3 rounded-2xl shadow-xl flex flex-col sm:flex-row gap-2.5 text-slate-800"
            >
              <div className="flex-1 flex items-center gap-2.5 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <Search className="w-5 h-5 text-emerald-600 shrink-0" />
                <input
                  type="text"
                  placeholder="Que cherchez-vous ? (ex: semences maïs, tracteur, foin...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm placeholder:text-slate-400"
                />
              </div>

              <div className="sm:w-56 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-200">
                <MapPin className="w-5 h-5 text-emerald-600 shrink-0" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm text-slate-700"
                >
                  <option value="">Toutes les régions</option>
                  {SENEGAL_REGIONS.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2 shadow transition"
              >
                <span>Rechercher</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {RESOURCE_TYPES.map((cat) => (
            <Link
              key={cat.value}
              href={`/offres?resource_type=${cat.value}`}
              className="bg-white hover:bg-emerald-50/80 p-4 rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md transition text-center group flex flex-col items-center justify-center gap-2"
            >
              <span className="text-3xl sm:text-4xl group-hover:scale-110 transition duration-200">
                {cat.icon}
              </span>
              <span className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-emerald-800">
                {cat.label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Offers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Opportunités du moment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Dernières offres de troc agricole
            </h2>
          </div>
          <Link
            href="/offres"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
          >
            <span>Voir toutes les offres</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200"></div>
            ))}
          </div>
        ) : featuredOffers.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
            <span className="text-4xl">🌾</span>
            <h3 className="text-lg font-bold text-slate-800">Aucune offre pour le moment</h3>
            <p className="text-sm text-slate-500">Soyez le premier à publier une annonce de troc !</p>
            <Link
              href="/publier"
              className="inline-block mt-2 px-5 py-2.5 bg-emerald-700 text-white text-sm font-semibold rounded-xl"
            >
              Déposer une annonce
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredOffers.map((offer) => {
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
                  {/* Image or Category placeholder */}
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

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-2 text-base group-hover:text-emerald-700 transition">
                        {offer.title}
                      </h3>

                      {/* Exchange Details Box */}
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

                    {/* Footer */}
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
      </section>

      {/* How it works */}
      <section className="bg-emerald-50/60 border-y border-emerald-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
              Simple, rapide et direct
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Comment fonctionne AgriTroc ?
            </h2>
            <p className="text-sm text-slate-600">
              Pas de commissions, pas de blocages bancaires. Un modèle d’échange basé sur la confiance locale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mx-auto">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900">Publiez votre offre</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Décrivez précisément la ressource que vous proposez et ce que vous souhaitez recevoir en échange.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 font-black text-xl flex items-center justify-center mx-auto">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900">Échangez via WhatsApp</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Discutez des modalités de transport, des quantités ou des compléments directement par messagerie ou WhatsApp.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-xs space-y-4 text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 font-black text-xl flex items-center justify-center mx-auto">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900">Concluez sur le terrain</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Rencontrez votre partenaire agricole, procédez à la remise des ressources et marquez le troc comme conclu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-800 to-emerald-900 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-lg">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold">
              Vous avez des semences ou des équipements inexploités ?
            </h2>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Transformez vos excédents en opportunités pour développer votre exploitation. Rejoignez la communauté paysanne d'AgriTroc dès aujourd'hui.
            </p>
          </div>
          <Link
            href="/publier"
            className="shrink-0 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-8 py-4 rounded-2xl text-base shadow transition transform hover:-translate-y-0.5"
          >
            Publier un troc gratuitement
          </Link>
        </div>
      </section>
    </div>
  )
}
