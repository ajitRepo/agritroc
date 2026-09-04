'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  MapPin,
  Calendar,
  Eye,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowLeft,
  Share2,
  Edit,
  Trash2,
  Check,
  Star,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react'
import { RESOURCE_TYPES, COMPLEMENT_TYPES } from '@/lib/constants'

export default function OfferDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()

  const [offer, setOffer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [contactMsg, setContactMsg] = useState('')
  const [sendingMsg, setSendingMsg] = useState(false)
  const [contactSuccess, setContactSuccess] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const offerId = params.id as string

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/offers/${offerId}`)
        if (res.ok) {
          const data = await res.json()
          setOffer(data)
        }
      } catch (err) {
        console.error('Erreur chargement offre:', err)
      } finally {
        setLoading(false)
      }
    }
    if (offerId) fetchDetail()
  }, [offerId])

  const isOwner = user && offer && offer.user && user.id === offer.user.id

  const handleStartConversation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAuthenticated) {
      router.push('/connexion')
      return
    }

    setSendingMsg(true)
    try {
      const res = await fetch('/api/messages/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: JSON.stringify({
          offer_id: offerId,
          message: contactMsg || 'Salam, je suis intéressé par votre proposition de troc.',
        }),
      })

      if (res.ok) {
        setContactSuccess('Votre message a été envoyé ! Redirection...')
        setTimeout(() => {
          router.push('/messages')
        }, 1500)
      }
    } catch (err) {
      console.error('Erreur envoi message:', err)
    } finally {
      setSendingMsg(false)
    }
  }

  const handleCompleteOffer = async () => {
    if (!confirm('Confirmez-vous que ce troc a été conclu avec succès ?')) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/offers/${offerId}/complete`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
      })
      if (res.ok) {
        const updated = await res.json()
        setOffer(updated)
      }
    } catch (err) {
      console.error('Erreur completion:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancelOffer = async () => {
    if (!confirm('Voulez-vous vraiment annuler cette offre de troc ?')) return
    setActionLoading(true)
    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
      })
      if (res.ok) {
        router.push('/mes-offres')
      }
    } catch (err) {
      console.error('Erreur annulation:', err)
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl h-96 animate-pulse border border-slate-200"></div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <span className="text-5xl">🌾</span>
        <h2 className="text-2xl font-bold text-slate-800">Offre introuvable</h2>
        <p className="text-sm text-slate-500">Cette offre n'existe plus ou a été retirée.</p>
        <Link
          href="/offres"
          className="inline-block px-5 py-2.5 bg-emerald-700 text-white rounded-xl text-sm font-semibold"
        >
          Retour aux offres
        </Link>
      </div>
    )
  }

  const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
    label: offer.resource_type,
    icon: '📦',
  }
  const compType = COMPLEMENT_TYPES.find((c) => c.value === offer.complement_type)

  const cleanPhone = (offer.user?.phone || '').replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
    `Salam, je vous contacte concernant votre offre sur AgriTroc : "${offer.title}"`
  )}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link
          href="/offres"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux annonces</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Images */}
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
            {offer.images && offer.images.length > 0 ? (
              <div className="space-y-2 p-2">
                <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
                  <img
                    src={offer.images[activeImageIdx]?.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {offer.images.length > 1 && (
                  <div className="flex gap-2 px-2 py-1 overflow-x-auto">
                    {offer.images.map((img: any, idx: number) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                          activeImageIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-transparent opacity-70'
                        }`}
                      >
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 sm:h-80 bg-emerald-50/60 flex flex-col items-center justify-center text-emerald-800">
                <span className="text-6xl">{resType.icon}</span>
                <span className="text-sm font-bold mt-2 uppercase tracking-wide">
                  {resType.label}
                </span>
              </div>
            )}

            {/* Title & Badges */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1.5">
                  <span>{resType.icon}</span>
                  <span>{resType.label}</span>
                </div>

                {offer.status === 'active' && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-semibold">
                    🟢 Troc Actif
                  </span>
                )}
                {offer.status === 'completed' && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold">
                    ✓ Conclu
                  </span>
                )}
                {offer.status === 'cancelled' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-semibold">
                    Annulé
                  </span>
                )}

                {offer.complement_type !== 'none' && (
                  <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg text-xs font-bold">
                    {compType?.badge || '+ Complément'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-snug">
                {offer.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-slate-500 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{offer.location}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>
                    Publié le{' '}
                    {offer.created_at
                      ? new Date(offer.created_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })
                      : 'récemment'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{offer.views_count || 0} vues</span>
                </div>
              </div>

              {/* Exchange Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                    🌱 Ce que le propriétaire propose
                  </span>
                  <p className="text-base font-bold text-slate-900">{offer.offered_resource}</p>
                </div>

                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                    🤝 Ce que le propriétaire recherche
                  </span>
                  <p className="text-base font-bold text-slate-900">{offer.wanted_resource}</p>
                </div>
              </div>

              {/* Complement notes if any */}
              {offer.complement_desc && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                  <span className="font-bold text-slate-700">Détails du complément :</span>
                  <p className="text-slate-600">{offer.complement_desc}</p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Description détaillée</h3>
                <p className="text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                  {offer.description || 'Aucune description complémentaire fournie.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar / Actions (1 Col) */}
        <div className="space-y-6">
          {/* Owner Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proposé par
            </h3>

            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg overflow-hidden border border-emerald-200">
                {offer.user?.avatar_url || offer.user?.avatarUrl ? (
                  <img
                    src={offer.user?.avatar_url || offer.user?.avatarUrl}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  offer.user?.full_name?.[0] || 'A'
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-slate-900 truncate">
                  {offer.user?.full_name || 'Agriculteur membre'}
                </h4>
                <p className="text-xs text-slate-500 truncate">{offer.user?.city || offer.location}</p>
              </div>
            </div>

            {offer.user?.rating_avg > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold">{offer.user.rating_avg.toFixed(1)} / 5</span>
                <span className="text-slate-500">({offer.user.exchange_count || 0} trocs réussis)</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              {/* Direct WhatsApp button */}
              {offer.user?.phone && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm shadow transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Contacter sur WhatsApp</span>
                </a>
              )}

              {offer.user?.id && (
                <Link
                  href={`/profil/${offer.user.id}`}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <span>Voir le profil et les autres offres</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Contact / In-App Message Form (if not owner) */}
          {!isOwner && offer.status === 'active' && (
            <div className="bg-white p-6 rounded-3xl border border-emerald-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900">
                Envoyer une proposition de troc
              </h3>

              {contactSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{contactSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleStartConversation} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Décrivez votre proposition (ex: J'ai 100 kg disponibles à Richard Toll...)"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-none"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{sendingMsg ? 'Envoi...' : 'Envoyer la proposition'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Owner Actions */}
          {isOwner && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Gestion de votre annonce
              </h3>

              {offer.status === 'active' && (
                <button
                  onClick={handleCompleteOffer}
                  disabled={actionLoading}
                  className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Marquer le troc comme conclu</span>
                </button>
              )}

              <Link
                href={`/offres/${offerId}/modifier`}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier l'annonce</span>
              </Link>

              {offer.status === 'active' && (
                <button
                  onClick={handleCancelOffer}
                  disabled={actionLoading}
                  className="w-full py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold rounded-xl text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Annuler l'annonce</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
