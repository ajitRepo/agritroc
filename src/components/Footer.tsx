import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { MessageSquare, HeartHandshake, ShieldCheck, Sparkles, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#031510] text-slate-300 border-t border-emerald-950/40 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-14">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo-icon.png"
                alt="AgriTroc"
                width={38}
                height={38}
                className="rounded-2xl border border-emerald-500/20"
              />
              <span className="text-2xl font-black text-white tracking-tight">
                Agri<span className="text-emerald-400">Troc</span>
              </span>
            </Link>
            <p className="text-sm text-emerald-100/70 leading-relaxed">
              La bourse de troc et d'entraide agricole n°1 au Sénégal. Échangez semences, bétail, machines et récoltes directement sans intermédiaire bancaire.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-900/50 border border-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>100% Développé pour le Sénégal</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Catégories de Troc</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/offres?resource_type=seeds" className="hover:text-emerald-400 transition flex items-center gap-2"><span>🌱</span> Semences & Plants</Link></li>
              <li><Link href="/offres?resource_type=livestock" className="hover:text-emerald-400 transition flex items-center gap-2"><span>🐄</span> Bétail & Élevage</Link></li>
              <li><Link href="/offres?resource_type=land" className="hover:text-emerald-400 transition flex items-center gap-2"><span>🌍</span> Terres & Parcelles</Link></li>
              <li><Link href="/offres?resource_type=machinery" className="hover:text-emerald-400 transition flex items-center gap-2"><span>🚜</span> Matériel & Tracteurs</Link></li>
              <li><Link href="/offres?resource_type=production" className="hover:text-emerald-400 transition flex items-center gap-2"><span>🌾</span> Récoltes & Fourrage</Link></li>
            </ul>
          </div>

          {/* Regions */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Bassins Agricoles</h4>
            <ul className="space-y-2.5 text-sm text-emerald-100/60">
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Kaolack & Bassin Arachidier</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Saint-Louis & Vallée du Fleuve</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Thiès & Zone des Niayes</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Fatick & Sine Saloum</li>
              <li className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-emerald-500" /> Tambacounda & Casamance</li>
            </ul>
          </div>

          {/* Security & Direct Communication */}
          <div>
            <h4 className="text-white font-bold text-sm mb-4 tracking-wider uppercase">Confiance & Échange</h4>
            <div className="space-y-3.5 text-sm text-emerald-100/70">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Profils vérifiés par téléphone</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Messagerie instantanée sur AgriTroc</span>
              </div>
              <div className="flex items-center gap-2.5">
                <HeartHandshake className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Échanges directs sans commissions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-emerald-950/60 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-emerald-100/40">
          <p>© 2026 AgriTroc Sénégal. L'entraide agricole nouvelle génération.</p>
          <div className="flex gap-6">
            <Link href="/offres" className="hover:text-emerald-300 transition">Toutes les offres</Link>
            <Link href="/publier" className="hover:text-emerald-300 transition">Publier une annonce</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
