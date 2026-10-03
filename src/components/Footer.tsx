import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, MessageSquare, HeartHandshake, Globe } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#080d0a] text-zinc-400 border-t border-white/[0.08] pt-18 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Brand & Mission (4 cols on desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative">
                <Image
                  src="/logo-icon.png"
                  alt="AgriTroc"
                  width={38}
                  height={38}
                  className="rounded-xl border border-white/10 opacity-95 group-hover:opacity-100 transition shadow-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white">
                  Agri<span className="text-emerald-400">Troc</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/20">
                  Sénégal
                </span>
              </div>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              L'infrastructure numérique décentralisée dédiée au troc direct et à la solidarité entre exploitants agricoles, éleveurs et coopératives au Sénégal.
            </p>

            {/* Live Infrastructure Status */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-500/20 text-xs text-emerald-300 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-semibold">Réseau d'échange opérationnel • 14 Régions</span>
              </div>

              <div className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500/70" />
                <span>Comptes vérifiés & messagerie interne chiffrée</span>
              </div>
            </div>
          </div>

          {/* Col 1: Plateforme (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres" className="hover:text-emerald-400 transition-colors duration-150">
                  Explorer les offres
                </Link>
              </li>
              <li>
                <Link href="/publier" className="hover:text-emerald-400 transition-colors duration-150">
                  Déposer une annonce
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-emerald-400 transition-colors duration-150">
                  Messagerie AgriTroc
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-emerald-400 transition-colors duration-150">
                  Espace producteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Filières Agricoles (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
              Filières
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres?resource_type=seeds" className="hover:text-emerald-400 transition-colors duration-150">
                  Semences & Plants
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=production" className="hover:text-emerald-400 transition-colors duration-150">
                  Récoltes & Fourrage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=livestock" className="hover:text-emerald-400 transition-colors duration-150">
                  Bétail & Élevage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=machinery" className="hover:text-emerald-400 transition-colors duration-150">
                  Machines & Tracteurs
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=land" className="hover:text-emerald-400 transition-colors duration-150">
                  Terres & Parcelles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bassins de Production (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
              Bassins
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres?location=Kaolack" className="hover:text-emerald-400 transition-colors duration-150">
                  Bassin Arachidier
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Saint-Louis" className="hover:text-emerald-400 transition-colors duration-150">
                  Vallée du Fleuve
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Thi%C3%A8s" className="hover:text-emerald-400 transition-colors duration-150">
                  Zone des Niayes
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Ziguinchor" className="hover:text-emerald-400 transition-colors duration-150">
                  Casamance
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Fatick" className="hover:text-emerald-400 transition-colors duration-150">
                  Sine Saloum
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Valeurs & Garanties (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-bold text-zinc-200 tracking-wider uppercase">
              Garanties
            </h4>
            <ul className="space-y-3 text-xs text-zinc-400">
              <li>
                <span className="text-zinc-200 font-bold block text-sm">0 FCFA de Commission</span>
                <span className="text-zinc-500">Aucun intermédiaire financier</span>
              </li>
              <li>
                <span className="text-zinc-200 font-bold block text-sm">Solidarité Locale</span>
                <span className="text-zinc-500">Entraide directe de paysan à paysan</span>
              </li>
              <li>
                <span className="text-zinc-200 font-bold block text-sm">Canal Sécurisé</span>
                <span className="text-zinc-500">Négociation directe sur AgriTroc</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer & Executive Copyright Bar */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-medium text-zinc-400">
              © 2026 AgriTroc Technologies Inc. Tous droits réservés.
            </p>
            <p className="text-[11px] text-zinc-600">
              Fièrement développé pour l'autonomie et la prospérité des producteurs du Sénégal.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="inline-flex items-center gap-1.5 text-zinc-400 font-medium bg-white/[0.04] px-2.5 py-1 rounded-full border border-white/[0.06]">
              <Globe className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sénégal (Français)</span>
            </div>
            <Link href="/offres" className="hover:text-zinc-300 transition-colors">
              Bourse de troc
            </Link>
            <Link href="/publier" className="hover:text-zinc-300 transition-colors">
              Publier
            </Link>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-500">Plateforme 100% solidaire</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
