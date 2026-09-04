import React from 'react'
import Link from 'next/link'
import { Sprout, PhoneCall, HeartHandshake, ShieldCheck } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white">
                <Sprout className="w-5 h-5" />
              </div>
              <span className="text-xl font-black text-white">
                Agri<span className="text-amber-500">Troc</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              La 1ère plateforme de troc et d'entraide agricole au Sénégal. Échangez semences, bétail, parcelles, machines et récoltes sans intermédiaire financier imposé.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Catégories de Troc</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/offres?resource_type=seeds" className="hover:text-emerald-400 transition">🌱 Semences & Plants</Link></li>
              <li><Link href="/offres?resource_type=livestock" className="hover:text-emerald-400 transition">🐄 Bétail & Élevage</Link></li>
              <li><Link href="/offres?resource_type=land" className="hover:text-emerald-400 transition">🌍 Terres & Parcelles</Link></li>
              <li><Link href="/offres?resource_type=machinery" className="hover:text-emerald-400 transition">🚜 Matériel & Tracteurs</Link></li>
              <li><Link href="/offres?resource_type=production" className="hover:text-emerald-400 transition">🌾 Récoltes & Fourrage</Link></li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Principales Régions</h4>
            <ul className="space-y-2.5 text-sm text-slate-400">
              <li>Kaolack & Bassin Arachidier</li>
              <li>Saint-Louis & Vallée du Fleuve</li>
              <li>Thiès & Niayes</li>
              <li>Fatick & Sine Saloum</li>
              <li>Tambacounda & Casamance</li>
            </ul>
          </div>

          {/* Trust & WhatsApp */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Sécurité & Contact</h4>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Authentification WhatsApp 100% sécurisée</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-amber-400" />
                <span>Échanges directs de paysan à paysan</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <span>Mise en relation instantanée</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2026 AgriTroc Sénégal. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/offres" className="hover:text-slate-300">Toutes les offres</Link>
            <Link href="/publier" className="hover:text-slate-300">Publier une annonce</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
