import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ShieldCheck, HeartHandshake, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#06241a] text-emerald-100/80 border-t border-emerald-900/60 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-2 md:grid-cols-12 gap-8 lg:gap-12 mb-14">
          {/* Brand & Creator (4 cols on desktop) */}
          <div className="col-span-2 md:col-span-4 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <Image
                src="/logo-icon.png"
                alt="AgriTroc"
                width={40}
                height={40}
                className="rounded-xl border border-emerald-500/20 shadow-sm"
              />
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-white">
                  Agri<span className="text-amber-400">Troc</span>
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-900/80 text-emerald-300 border border-emerald-500/30">
                  Sénégal
                </span>
              </div>
            </Link>

            <p className="text-sm text-emerald-100/90 leading-relaxed max-w-sm">
              La plateforme d'entraide entre agriculteurs et éleveurs du Sénégal. Échangez vos semences, récoltes, animaux et outils directement entre paysans, sans argent liquide ni intermédiaire.
            </p>

            {/* Created by AJIT SENEGAL Badge */}
            <div className="pt-1">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-500/40 text-xs text-white">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Créé par <strong className="text-amber-300 font-bold">AJIT SÉNÉGAL</strong></span>
              </div>
            </div>
          </div>

          {/* Col 1: Plateforme (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Plateforme
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres" className="hover:text-amber-300 transition-colors">
                  Explorer les offres
                </Link>
              </li>
              <li>
                <Link href="/publier" className="hover:text-amber-300 transition-colors">
                  Déposer une annonce
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-amber-300 transition-colors">
                  Messagerie AgriTroc
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-amber-300 transition-colors">
                  Mon profil paysan
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Ce qu'on échange (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Ce qu'on échange
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres?resource_type=seeds" className="hover:text-amber-300 transition-colors">
                  Semences & Plants
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=production" className="hover:text-amber-300 transition-colors">
                  Récoltes & Fourrage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=livestock" className="hover:text-amber-300 transition-colors">
                  Bétail & Élevage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=machinery" className="hover:text-amber-300 transition-colors">
                  Matériel & Tracteurs
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=land" className="hover:text-amber-300 transition-colors">
                  Terres & Parcelles
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Nos Régions (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Nos Terroirs
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/offres?location=Kaolack" className="hover:text-amber-300 transition-colors">
                  Kaolack & Saloum
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Saint-Louis" className="hover:text-amber-300 transition-colors">
                  Saint-Louis & Fleuve
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Thi%C3%A8s" className="hover:text-amber-300 transition-colors">
                  Thiès & Niayes
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Ziguinchor" className="hover:text-amber-300 transition-colors">
                  Casamance
                </Link>
              </li>
              <li>
                <Link href="/offres?location=Tambacounda" className="hover:text-amber-300 transition-colors">
                  Tambacounda
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Confiance & Sécurité (2 cols) */}
          <div className="col-span-1 md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white tracking-wider uppercase">
              Nos Engagements
            </h4>
            <ul className="space-y-2.5 text-xs text-emerald-100/90">
              <li className="space-y-0.5">
                <span className="font-bold text-amber-300 block text-sm">100% Gratuit</span>
                <span>Zéro commission ni intermédiaire</span>
              </li>
              <li className="space-y-0.5">
                <span className="font-bold text-white block text-sm">De paysan à paysan</span>
                <span>Parole d'honneur et respect mutuel</span>
              </li>
              <li className="space-y-0.5">
                <span className="font-bold text-white block text-sm">Comptes vérifiés</span>
                <span>Numéro de téléphone validé</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sub-footer / Clean Copyright Bar */}
        <div className="pt-8 border-t border-emerald-900/60 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-emerald-200/70">
          <div className="space-y-1 text-center md:text-left">
            <p className="font-medium text-white">
              © 2026 AgriTroc. Une initiative créée avec fierté par <strong className="text-amber-300 font-bold">AJIT SÉNÉGAL</strong>.
            </p>
            <p className="text-[11px] text-emerald-200/60">
              Dédié au courage et à la solidarité des agriculteurs et éleveurs de nos 14 régions.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5">
            <Link href="/confidentialite" className="hover:text-amber-300 transition-colors font-medium">
              Politique de Confidentialité
            </Link>
            <span className="text-emerald-700">•</span>
            <Link href="/conditions" className="hover:text-amber-300 transition-colors font-medium">
              Conditions d'Utilisation
            </Link>
            <span className="text-emerald-700">•</span>
            <Link href="/offres" className="hover:text-amber-300 transition-colors font-medium">
              Bourse de troc
            </Link>
            <span className="text-emerald-700">•</span>
            <span className="text-white font-semibold">🇸🇳 Sénégal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
