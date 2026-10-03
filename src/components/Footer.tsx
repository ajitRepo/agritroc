import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 pt-16 pb-12 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand & Purpose (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="AgriTroc"
                width={36}
                height={36}
                className="rounded-xl border border-slate-700 object-cover"
              />
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Agri<span className="text-emerald-400">Troc</span>
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Sénégal
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              La bourse solidaire des producteurs au Sénégal. Échangez directement récoltes, semences, bétail et matériel agricole sans intermédiaire financier.
            </p>

            <p className="text-xs text-slate-500">
              Plateforme conçue et développée par <span className="text-slate-300 font-semibold">AJIT SÉNÉGAL</span>.
            </p>
          </div>

          {/* Col 1: Plateforme (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Plateforme
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/offres" className="hover:text-emerald-400 transition-colors">
                  Explorer les offres
                </Link>
              </li>
              <li>
                <Link href="/publier" className="hover:text-emerald-400 transition-colors">
                  Déposer une annonce
                </Link>
              </li>
              <li>
                <Link href="/messages" className="hover:text-emerald-400 transition-colors">
                  Messagerie
                </Link>
              </li>
              <li>
                <Link href="/profil" className="hover:text-emerald-400 transition-colors">
                  Mon espace
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Filières d'échange (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Filières d'échange
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/offres?resource_type=seeds" className="hover:text-emerald-400 transition-colors">
                  Semences & Plants
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=production" className="hover:text-emerald-400 transition-colors">
                  Récoltes & Fourrage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=livestock" className="hover:text-emerald-400 transition-colors">
                  Bétail & Élevage
                </Link>
              </li>
              <li>
                <Link href="/offres?resource_type=machinery" className="hover:text-emerald-400 transition-colors">
                  Matériel & Tracteurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Informations & Légal (2 cols) */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Légal & Aide
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/confidentialite" className="hover:text-emerald-400 transition-colors">
                  Confidentialité
                </Link>
              </li>
              <li>
                <Link href="/conditions" className="hover:text-emerald-400 transition-colors">
                  Conditions d'usage
                </Link>
              </li>
              <li>
                <a href="mailto:contact@agritroc.sn" className="hover:text-emerald-400 transition-colors">
                  Support & Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Clean Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            © 2026 AgriTroc. Développé par <strong className="text-slate-300 font-medium">AJIT SÉNÉGAL</strong>. Tous droits réservés.
          </p>

          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5 text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              <span>100% Solidaire • 14 Régions</span>
            </span>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400">🇸🇳 Sénégal</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
