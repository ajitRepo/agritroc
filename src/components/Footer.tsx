import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-[#090d0b] text-zinc-400 border-t border-white/[0.08] pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-16">
          {/* Brand & Mission (4 cols on desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo-icon.png"
                alt="AgriTroc"
                width={36}
                height={36}
                className="rounded-xl border border-white/10 opacity-90 group-hover:opacity-100 transition"
              />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Agri<span className="text-emerald-400">Troc</span>
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.07] text-zinc-300 border border-white/10">
                  Sénégal
                </span>
              </div>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-sm">
              Infrastructure numérique de troc direct et d'entraide agricole au Sénégal. Échangez récoltes, intrants, bétail et machines sans commission ni intermédiaire financier.
            </p>

            {/* Live Infrastructure Status */}
            <div className="pt-2">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/40 border border-emerald-500/20 text-xs text-emerald-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="font-medium">Réseau d'échange opérationnel</span>
              </div>
            </div>
          </div>

          {/* Col 1: Plateforme (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres" className="hover:text-white transition-colors duration-150">
                  Explorer les offres
                </Link>
              </li>
              <li>
                <Link href="/publier" className="hover:text-white transition-colors duration-150">
                  Déposer une annonce
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-white transition-colors duration-150">
                  Messagerie directe
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-white transition-colors duration-150">
                  Espace producteur
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Ressources (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">
              Ressources
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres?resource_type=seeds" className="hover:text-white transition-colors duration-150">
                  Semences & Plants
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=production" className="hover:text-white transition-colors duration-150">
                  Récoltes & Fourrage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=livestock" className="hover:text-white transition-colors duration-150">
                  Bétail & Élevage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=machinery" className="hover:text-white transition-colors duration-150">
                  Machines & Tracteurs
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=land" className="hover:text-white transition-colors duration-150">
                  Terres & Parcelles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Bassins Agricoles (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">
              Territoires
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres?location=Kaolack" className="hover:text-white transition-colors duration-150">
                  Bassin Arachidier
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Saint-Louis" className="hover:text-white transition-colors duration-150">
                  Vallée du Fleuve
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Thi%C3%A8s" className="hover:text-white transition-colors duration-150">
                  Zone des Niayes
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Ziguinchor" className="hover:text-white transition-colors duration-150">
                  Casamance
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Fatick" className="hover:text-white transition-colors duration-150">
                  Sine Saloum
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Charte & Sécurité (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3.5">
            <h4 className="text-xs font-semibold text-zinc-200 tracking-wider uppercase">
              Confiance
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <span className="text-zinc-300 font-medium">Vérification SMS</span>
                <p className="text-xs text-zinc-500 mt-0.5">Comptes authentifiés</p>
              </li>
              <li>
                <span className="text-zinc-300 font-medium">0% Commission</span>
                <p className="text-xs text-zinc-500 mt-0.5">Échanges 100% gratuits</p>
              </li>
              <li>
                <span className="text-zinc-300 font-medium">Canal Sécurisé</span>
                <p className="text-xs text-zinc-500 mt-0.5">Messagerie intégrée</p>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer / Copyright */}
        <div className="pt-8 border-t border-white/[0.08] flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <p>© 2026 AgriTroc Technologies Sénégal. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link href="/offres" className="hover:text-zinc-300 transition-colors">
              Bourse d'échange
            </Link>
            <Link href="/publier" className="hover:text-zinc-300 transition-colors">
              Publier
            </Link>
            <span className="text-zinc-700">•</span>
            <span className="text-zinc-500">Conçu pour l'autonomie paysanne</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
