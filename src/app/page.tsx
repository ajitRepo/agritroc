'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowRight,
  Search,
  MapPin,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Layers,
  ArrowLeftRight,
  CheckCircle2,
  TrendingUp,
  Users,
  Shield,
  Clock,
} from 'lucide-react'
import { RESOURCE_TYPES, SENEGAL_REGIONS } from '@/lib/constants'

// Associating each category with its corresponding 3D modern icon asset
const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

const POPULAR_SEARCHES = [
  'Semences d\'arachide certifiées',
  'Tracteur & Motoculteur',
  'Tourteau & Foin pour bétail',
  'Génisses & Zébus',
  'Mangues Kent de saison',
  'Motopompe diesel',
]

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (selectedRegion) params.set('location', selectedRegion)
    window.location.href = `/offres?${params.toString()}`
  }

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section — Clean, Modern SaaS for Farmers, High Readability */}
      <section className="relative bg-gradient-to-b from-[#064e3b] to-[#032e23] text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8 border-b border-emerald-800/40">
        <div className="relative max-w-4xl mx-auto text-center space-y-6 z-10">
          {/* Simple Clean Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/30 text-emerald-100 text-xs sm:text-sm font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Bourse d'entraide agricole au Sénégal • 100% Gratuit</span>
          </div>

          {/* Main Headline — Clean, powerful, zero zigzag */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
            Échangez vos récoltes et matériels. <br className="hidden sm:inline" />
            <span className="text-amber-400">Directement, sans argent.</span>
          </h1>

          {/* Subtitle — Short, touching, clear for farmers */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 font-normal leading-relaxed">
            Publiez ce que vous avez, trouvez ce dont votre champ a besoin. Zéro intermédiaire, zéro dette : la solidarité de paysan à paysan.
          </p>

          {/* Clean SaaS Search Command Bar */}
          <div className="pt-2 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearchSubmit}
              className="bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row gap-2 text-slate-800"
            >
              <div className="flex-1 flex items-center gap-3 px-3.5 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
                <Search className="w-5 h-5 text-emerald-700 shrink-0" />
                <input
                  type="text"
                  placeholder="Que cherchez-vous ? (ex : arachide, semences, tracteur...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm sm:text-base text-slate-900 placeholder:text-slate-400 font-medium"
                />
              </div>

              <div className="sm:w-56 flex items-center gap-2 px-3.5 py-3 bg-slate-50 rounded-xl border border-slate-200 focus-within:border-emerald-600 focus-within:bg-white transition-colors">
                <MapPin className="w-5 h-5 text-emerald-700 shrink-0" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-sm text-slate-800 font-medium cursor-pointer"
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
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold px-6 py-3 rounded-xl text-sm sm:text-base flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-sm"
              >
                <span>Rechercher</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Popular Search Chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-emerald-200 font-medium">Recherches courantes :</span>
              {['Arachide', 'Semences de maïs', 'Tracteur', 'Zébus & Bétail', 'Fourrage'].map((query) => (
                <button
                  key={query}
                  type="button"
                  onClick={() => {
                    setSearchQuery(query)
                    window.location.href = `/offres?q=${encodeURIComponent(query)}`
                  }}
                  className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors cursor-pointer border border-white/10"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          {/* Social Proof / Key Guarantees */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/30">
              <p className="text-xl sm:text-2xl font-bold text-amber-400">0 FCFA</p>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">Aucun frais de commission</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/30">
              <p className="text-xl sm:text-2xl font-bold text-white">14 Régions</p>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">Partout au Sénégal</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/30">
              <p className="text-xl sm:text-2xl font-bold text-emerald-300">Direct</p>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">De paysan à paysan</p>
            </div>
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-600/30">
              <p className="text-xl sm:text-2xl font-bold text-amber-400">Sans dette</p>
              <p className="text-xs text-emerald-100 font-medium mt-0.5">Entraide solidaire</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modern 3D Categories Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-14 sm:-mt-16 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {RESOURCE_TYPES.map((cat) => {
            const iconUrl = CATEGORY_ICONS[cat.value] || '/avatars/avatar-sprout.webp'
            return (
              <Link
                key={cat.value}
                href={`/offres?resource_type=${cat.value}`}
                className="bg-white hover:bg-emerald-50/90 p-4 rounded-3xl border border-emerald-900/[0.08] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.06)] hover:shadow-xl transition-all duration-300 text-center group flex flex-col items-center justify-center gap-2.5 transform hover:-translate-y-1"
              >
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden p-1 bg-gradient-to-b from-emerald-100 to-amber-50 group-hover:scale-110 transition duration-300 shadow-inner">
                  <Image
                    src={iconUrl}
                    alt={cat.label}
                    width={64}
                    height={64}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="space-y-0.5">
                  <span className="block text-xs sm:text-sm font-bold text-slate-900 group-hover:text-emerald-900 transition">
                    {cat.label}
                  </span>
                  <span className="block text-[10px] text-slate-500 font-medium">
                    Découvrir →
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Featured Offers Section with BigTech Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-slate-200/80 pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3 py-1 rounded-full border border-emerald-300/40">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Bourse d'échange en temps réel</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Dernières offres de troc agricole
            </h2>
          </div>
          <Link
            href="/offres"
            className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 px-4 py-2.5 rounded-2xl transition border border-emerald-200/60"
          >
            <span>Consulter toutes les offres</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-3xl h-96 animate-pulse border border-slate-200/80"></div>
            ))}
          </div>
        ) : featuredOffers.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm space-y-4 max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
              🌾
            </div>
            <h3 className="text-xl font-bold text-slate-900">Aucune offre pour le moment</h3>
            <p className="text-sm text-slate-500">
              Soyez le premier exploitant à publier une annonce de troc solidaire !
            </p>
            <Link
              href="/publier"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-2xl shadow transition"
            >
              <span>Déposer la première annonce</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {featuredOffers.map((offer, idx) => {
              const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
                label: offer.resource_type,
                icon: '📦',
              }
              const iconUrl = CATEGORY_ICONS[offer.resource_type] || '/avatars/avatar-sprout.webp'
              const hasImage = offer.images && offer.images.length > 0
              const userAvatar = offer.user?.avatar_url || offer.user?.avatarUrl || (idx % 2 === 0 ? '/avatars/avatar-farmer-m.webp' : '/avatars/avatar-farmer-w.webp')

              return (
                <Link
                  key={offer.id}
                  href={`/offres/${offer.id}`}
                  className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-xl transition-all duration-300 flex flex-col group card-lift"
                >
                  {/* Image Container with Badges */}
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

                    {/* Floating Category Badge */}
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

                  {/* Body & Swap Specification */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="font-bold text-slate-900 line-clamp-2 text-lg group-hover:text-emerald-800 transition leading-snug">
                        {offer.title}
                      </h3>

                      {/* Barter Swap Details Box */}
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

                    {/* Author & Location Footer */}
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
      </section>

      {/* How it Works with BigTech Flow */}
      <section className="bg-gradient-to-b from-white via-emerald-50/40 to-white border-y border-emerald-950/[0.06] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-3 mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-300/40">
              Processus 100% direct & sans commission
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Comment fonctionne le troc sur AgriTroc ?
            </h2>
            <p className="text-base text-slate-600">
              Pas d'intermédiaires financiers, pas de blocages bancaires. Un modèle d’échange équitable fondé sur l'entraide agricole locale.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] card-lift space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-xl flex items-center justify-center border border-emerald-200/60 shadow-xs">
                01
              </div>
              <h3 className="text-xl font-bold text-slate-900">Publiez votre annonce</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Décrivez la ressource disponible dans votre champ (semences, matériel, bétail, récolte) et ce dont vous avez besoin en retour.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] card-lift space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-800 font-black text-xl flex items-center justify-center border border-amber-200/60 shadow-xs">
                02
              </div>
              <h3 className="text-xl font-bold text-slate-900">Échangez sur WhatsApp</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cliquez sur le bouton WhatsApp pour contacter directement l'agriculteur, échanger des photos et convenir des détails du troc en toute simplicité.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] card-lift space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-800 font-black text-xl flex items-center justify-center border border-emerald-200/60 shadow-xs">
                03
              </div>
              <h3 className="text-xl font-bold text-slate-900">Concluez sur le terrain</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Retrouvez l'exploitant partenaire, échangez physiquement les marchandises et marquez l'opération comme réalisée.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Value Proposition Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Protection contre l'endettement</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Acquérez vos intrants et machines sans recourir aux crédits usuraires ou aux taux d'intérêt étouffants.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Zéro gaspillage post-récolte</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Valorisez immédiatement vos surplus périssables contre des matériaux durables avant qu'ils ne se dégradent.
            </p>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-800 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Réseau d'entraide paysanne</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Renforcez les liens de coopération entre communautés de cultivateurs, d'éleveurs et de transformateurs du Sénégal.
            </p>
          </div>
        </div>
      </section>

      {/* Real Farmer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 px-3.5 py-1 rounded-full border border-emerald-300/40">
            Solidarité sur le terrain
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Paroles de producteurs
          </h2>
          <p className="text-sm text-slate-600">
            L'entraide agricole vécue au quotidien dans les terroirs du Sénégal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card 1 - Modou */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
              &ldquo;J'avais un surplus de semences certifiées d'arachide et un collègue avait des bottes de foin pour le bétail. En 48h sur AgriTroc, l'échange s'est conclu sans sortir 1 franc. C'est l'entraide de nos terroirs.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-200 shrink-0">
                <Image
                  src="/avatars/avatar-farmer-m.webp"
                  alt="Modou Ndiaye"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Modou Ndiaye</h4>
                <p className="text-xs text-slate-500">Producteur d'arachide & céréales • Kaolack</p>
              </div>
            </div>
          </div>

          {/* Card 2 - Awa */}
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 flex flex-col justify-between">
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed italic">
              &ldquo;Au lieu de risquer de perdre mes surplus de mangues et légumes de saison, je les ai échangés contre du compost organique et du matériel d'irrigation. C'est simple, direct et respectueux.&rdquo;
            </p>
            <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-200 shrink-0">
                <Image
                  src="/avatars/avatar-farmer-w.webp"
                  alt="Awa Seck"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Awa Seck</h4>
                <p className="text-xs text-slate-500">Maraîchère & arboricultrice • Thiès (Niayes)</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium BigTech Call to Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-r from-[#064e3b] via-[#043d2c] to-[#022c22] rounded-3xl p-8 sm:p-14 text-white shadow-2xl border border-emerald-500/20">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-amber-400/25 rounded-full blur-3xl pointer-events-none"></div>
          <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
            <div className="space-y-4 max-w-2xl text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Rejoignez plus de 500 exploitants actifs</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
                Prêt à troquer vos récoltes ou votre équipement ?
              </h2>
              <p className="text-emerald-100 text-base sm:text-lg leading-relaxed font-normal">
                La publication est gratuite, sans engagement, et accessible directement depuis votre smartphone.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3.5 shrink-0">
              <Link
                href="/publier"
                className="bg-amber-400 hover:bg-amber-500 text-slate-950 font-black px-8 py-4 rounded-2xl text-base shadow-[0_4px_20px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 text-center cursor-pointer"
              >
                Déposer une annonce de troc
              </Link>
              <Link
                href="/offres"
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-6 py-4 rounded-2xl text-base border border-white/20 transition backdrop-blur text-center"
              >
                Explorer la bourse
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
