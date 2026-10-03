import React from 'react'
import Link from 'next/link'
import { ShieldCheck, ArrowLeft, Lock, Smartphone, Eye, Trash2, Mail, CheckCircle2 } from 'lucide-react'

export const metadata = {
  title: 'Politique de Confidentialité — AgriTroc Sénégal',
  description: 'Politique de confidentialité et protection des données personnelles de la plateforme et application mobile AgriTroc, développée par AJIT SÉNÉGAL.',
}

export default function ConfidentialitePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header Back link */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-bold text-emerald-800 hover:text-emerald-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l'accueil AgriTroc</span>
        </Link>
      </div>

      {/* Main Title Card */}
      <div className="bg-gradient-to-r from-[#064e3b] via-[#043d2c] to-[#022c22] rounded-3xl p-8 sm:p-10 text-white shadow-xl space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold border border-white/10">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Protection de vos données • Conforme Google Play & App Store</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          Politique de Confidentialité
        </h1>
        <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
          Dernière mise à jour : 3 octobre 2026. L'application et la plateforme <strong>AgriTroc</strong> sont éditées et opérées par <strong>AJIT SÉNÉGAL</strong>.
        </p>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-xs space-y-8 text-slate-800 leading-relaxed text-sm sm:text-base">
        {/* Intro */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">1</span>
            <span>Notre engagement envers les agriculteurs</span>
          </h2>
          <p className="text-slate-600">
            Chez <strong>AJIT SÉNÉGAL</strong>, nous concevons des technologies au service du monde rural et de l'agriculture sénégalaise. Nous nous engageons à respecter scrupuleusement votre vie privée. La présente politique explique de façon simple et transparente quelles informations nous collectons lorsque vous utilisez le site web ou l'application mobile AgriTroc, pourquoi nous les collectons et comment vous gardez le contrôle total sur vos données.
          </p>
        </section>

        {/* Données collectées */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">2</span>
            <span>Les données que nous collectons</span>
          </h2>
          <p className="text-slate-600">
            Nous limitons la collecte au strict minimum nécessaire pour faire fonctionner le service d'échange et d'entraide :
          </p>
          <ul className="space-y-2.5 list-disc pl-6 text-slate-700">
            <li>
              <strong>Numéro de téléphone :</strong> Utilisé exclusivement pour sécuriser votre compte via un code de vérification par SMS ou WhatsApp. Votre numéro ne sera jamais vendu, loué ni partagé à des démarcheurs publicitaires.
            </li>
            <li>
              <strong>Nom ou nom d'exploitation :</strong> Le nom public que vous choisissez pour que les autres paysans sachent avec qui ils échangent.
            </li>
            <li>
              <strong>Région et localisation :</strong> La région et la commune où se trouvent vos récoltes ou votre matériel (par exemple : Kaolack, Saint-Louis, Thiès), afin d'afficher les trocs proches de chez vous.
            </li>
            <li>
              <strong>Photos de vos annonces et avatar :</strong> Les photos que vous choisissez de téléverser pour illustrer vos semences, animaux, machines ou récoltes.
            </li>
            <li>
              <strong>Contact direct par WhatsApp :</strong> Les discussions et accords de troc s'effectuent directement sur WhatsApp entre producteurs. AgriTroc ne conserve aucun journal de vos conversations privées.
            </li>
          </ul>
        </section>

        {/* Autorisations de l'application mobile */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">3</span>
            <span>Autorisations requises par l'application mobile</span>
          </h2>
          <p className="text-slate-600">
            Lorsque vous installez l'application mobile AgriTroc (Android via Google Play Store ou iOS via App Store), certaines autorisations peuvent vous être demandées :
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Smartphone className="w-4 h-4 text-emerald-700" />
                <span>Photos & Galerie</span>
              </span>
              <p className="text-xs text-slate-600">
                Permet de sélectionner une photo de votre champ, bétail ou récolte pour la joindre à votre annonce de troc. Nous n'accédons qu'aux photos que vous choisissez manuellement.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
              <span className="font-bold text-slate-900 flex items-center gap-1.5 text-sm">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>Connexion Internet</span>
              </span>
              <p className="text-xs text-slate-600">
                Indispensable pour charger les dernières annonces de troc disponibles au Sénégal et synchroniser vos messages avec vos partenaires.
              </p>
            </div>
          </div>
        </section>

        {/* Utilisation des données */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">4</span>
            <span>À quoi servent vos informations ?</span>
          </h2>
          <ul className="space-y-2 list-disc pl-6 text-slate-700">
            <li>Vous permettre de publier gratuitement des propositions d'échange agricole.</li>
            <li>Permettre aux producteurs d'entrer en relation directe sans intermédiaire.</li>
            <li>Prévenir les fraudes, faux profils et abus grâce à l'authentification téléphonique.</li>
            <li>Améliorer le fonctionnement technique et la fluidité de la plateforme.</li>
          </ul>
        </section>

        {/* Partage et tiers */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">5</span>
            <span>Aucune vente de vos données</span>
          </h2>
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-start gap-3 text-emerald-950 text-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <p>
              <strong>Engagement ferme :</strong> AJIT SÉNÉGAL ne vend et ne vendra jamais vos données personnelles ou votre numéro à des tiers. AgriTroc est un service 100% dédié à la solidarité agricole au Sénégal.
            </p>
          </div>
        </section>

        {/* Conservation et suppression */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">6</span>
            <span>Vos droits et suppression de vos données</span>
          </h2>
          <p className="text-slate-600">
            Conformément aux lois sur la protection des données personnelles, vous conservez à tout moment un droit d'accès, de modification et de suppression totale de votre compte et de toutes vos annonces.
          </p>
          <p className="text-slate-600">
            Pour demander la suppression de votre compte ou de vos données, il vous suffit de nous contacter simplement par email ou via la plateforme. Vos informations seront alors définitivement effacées sous 48 heures.
          </p>
        </section>

        {/* Contact AJIT SENEGAL */}
        <section className="space-y-3 pt-4 border-t border-slate-100">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-7 h-7 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-black">7</span>
            <span>Éditeur & Contact</span>
          </h2>
          <p className="text-slate-600">
            La plateforme et l'application mobile AgriTroc sont développées et administrées par :
          </p>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-sm space-y-1">
            <p className="font-bold text-base text-emerald-900">AJIT SÉNÉGAL</p>
            <p>Dakar, République du Sénégal</p>
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
