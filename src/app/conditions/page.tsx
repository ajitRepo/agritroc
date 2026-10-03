import React from 'react'
import Link from 'next/link'
import { FileText, ArrowLeft, HeartHandshake, ShieldCheck, AlertCircle, Mail } from 'lucide-react'

export const metadata = {
  title: "Conditions Générales d'Utilisation — AgriTroc Sénégal",
  description: "Conditions d'utilisation et charte de confiance de la plateforme AgriTroc, créée par AJIT SÉNÉGAL.",
}

export default function ConditionsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil AgriTroc</span>
        </Link>
      </div>

      <div className="bg-gradient-to-r from-[#064e3b] via-[#043d2c] to-[#022c22] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
          <FileText className="w-4 h-4 text-amber-300" />
          <span>Charte de confiance et d'entraide agricole</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Conditions Générales d'Utilisation
        </h1>
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
          Règles simples et transparentes régissant l'utilisation d'AgriTroc au Sénégal. Développé par <strong>AJIT SÉNÉGAL</strong>.
        </p>
      </div>

      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-slate-800 leading-relaxed text-sm sm:text-base">
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
            <span>Objet du service AgriTroc</span>
          </h2>
          <p className="text-slate-600">
            AgriTroc est une plateforme gratuite de mise en relation directe entre producteurs agricoles, maraîchers, éleveurs et coopératives au Sénégal. L'objectif est de faciliter le troc de biens et ressources (semences, bétail, outillage, engrais, récoltes) sans commission bancaire ni intermédiaire financier.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
            <span>Gratuité et absence de commission</span>
          </h2>
          <p className="text-slate-600">
            L'inscription, la consultation et la publication d'annonces sur AgriTroc sont <strong>100% gratuites</strong>. <strong>AJIT SÉNÉGAL</strong> ne prélève aucun pourcentage ni commission sur les échanges conclus entre paysans.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
            <span>Engagements de l'agriculteur</span>
          </h2>
          <ul className="space-y-2 list-disc pl-6 text-slate-700">
            <li>Décrire honnêtement la nature, la qualité et la quantité de la ressource proposée.</li>
            <li>Ne proposer que des biens et semences licites, conformes aux réglementations agricoles sénégalaises.</li>
            <li>Respecter la parole donnée lors des échanges avec les autres membres de la communauté.</li>
            <li>Adopter un comportement courtois et solidaire dans la messagerie AgriTroc.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
            <span>Rencontre et remise des ressources sur le terrain</span>
          </h2>
          <p className="text-slate-600">
            Les modalités finales d'échange, de transport et de vérification physique de la marchandise relèvent de la responsabilité commune des deux parties contractantes. Nous recommandons toujours de vérifier l'état des semences ou des équipements au moment de la remise en main propre.
          </p>
        </section>

        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">5</span>
            <span>Contact & Support</span>
          </h2>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm space-y-1">
            <p className="font-bold text-emerald-950">AJIT SÉNÉGAL</p>
            <p>Plateforme AgriTroc — Dakar, Sénégal</p>
            <p className="flex items-center gap-2 pt-1 font-medium text-emerald-800">
              <Mail className="w-4 h-4" />
              <span>contact@agritroc.sn</span>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
