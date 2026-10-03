'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
  Sparkles,
  ArrowLeftRight,
  Send,
} from 'lucide-react'
import { RESOURCE_TYPES, COMPLEMENT_TYPES } from '@/lib/constants'

const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

const QUICK_MESSAGES = [
  'Salam, votre offre est-elle toujours disponible ?',
  'J\'ai exactement ce que vous recherchez !',
  'Pouvons-nous discuter des modalités de transport ?',
]

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
        }, 1200)
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
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="bg-white rounded-3xl h-96 animate-pulse border border-slate-200"></div>
      </div>
    )
  }

  if (!offer) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center mx-auto text-3xl">
          🌾
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Offre introuvable</h2>
        <p className="text-sm text-slate-500">Cette offre n'existe plus ou a été retirée.</p>
        <Link
          href="/offres"
          className="inline-block px-6 py-3 bg-emerald-700 text-white rounded-2xl text-sm font-bold shadow transition hover:bg-emerald-800"
        >
          Retourner aux offres
        </Link>
      </div>
    )
  }

  const resType = RESOURCE_TYPES.find((r) => r.value === offer.resource_type) || {
    label: offer.resource_type,
    icon: '📦',
  }
  const iconUrl = CATEGORY_ICONS[offer.resource_type] || '/avatars/avatar-sprout.webp'
  const compType = COMPLEMENT_TYPES.find((c) => c.value === offer.complement_type)
  const userAvatar = offer.user?.avatar_url || offer.user?.avatarUrl || '/avatars/avatar-farmer-w.webp'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back navigation */}
      <div>
        <Link
          href="/offres"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-800 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à la bourse de troc</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Photos & Main Media */}
          <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-[0_4px_25px_rgba(0,0,0,0.04)]">
            {offer.images && offer.images.length > 0 ? (
              <div className="space-y-3 p-3 sm:p-4">
                <div className="h-80 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 shadow-inner">
                  <img
                    src={offer.images[activeImageIdx]?.image_url}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                {offer.images.length > 1 && (
                  <div className="flex gap-2.5 px-1 py-1 overflow-x-auto">
                    {offer.images.map((img: any, idx: number) => (
                      <button
                        key={img.id}
                        onClick={() => setActiveImageIdx(idx)}
                        className={`w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                          activeImageIdx === idx ? 'border-emerald-600 ring-2 ring-emerald-200' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="h-64 sm:h-80 bg-gradient-to-tr from-emerald-50 to-amber-50/50 flex flex-col items-center justify-center text-emerald-900">
                <div className="w-24 h-24 rounded-full overflow-hidden p-2 shadow-sm bg-white/90">
                  <Image
                    src={iconUrl}
                    alt={resType.label}
                    width={96}
                    height={96}
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-sm font-bold mt-3 uppercase tracking-wider text-emerald-800">
                  {resType.label}
                </span>
              </div>
            )}

            {/* Title & Exchange Specs */}
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <div className="px-3.5 py-1 bg-emerald-50 text-emerald-900 border border-emerald-200/80 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs">
                  <div className="w-3.5 h-3.5 rounded-full overflow-hidden shrink-0">
                    <Image src={iconUrl} alt="" width={14} height={14} />
                  </div>
                  <span>{resType.label}</span>
                </div>

                {offer.status === 'active' && (
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-bold flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>Troc disponible</span>
                  </span>
                )}
                {offer.status === 'completed' && (
                  <span className="px-3 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-xs font-bold">
                    ✓ Troc conclu
                  </span>
                )}
                {offer.status === 'cancelled' && (
                  <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-semibold">
                    Annulé
                  </span>
                )}

                {offer.complement_type !== 'none' && (
                  <span className="px-3 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full text-xs font-bold">
                    {compType?.badge || '+ Complément'}
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 leading-tight">
                {offer.title}
              </h1>

              <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-slate-500 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>{offer.location}</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
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
                <div className="flex items-center gap-1.5 font-medium">
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>{offer.views_count || 0} consultations</span>
                </div>
              </div>

              {/* Exchange Details Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200/90 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                    🌱 Ce que le propriétaire propose
                  </span>
                  <p className="text-lg font-bold text-slate-900 leading-snug">{offer.offered_resource}</p>
                </div>

                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                    🤝 Ce que le propriétaire recherche
                  </span>
                  <p className="text-lg font-bold text-slate-900 leading-snug">{offer.wanted_resource}</p>
                </div>
              </div>

              {/* Complement notes if any */}
              {offer.complement_desc && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1 text-xs">
                  <span className="font-bold text-slate-800">Précisions sur le complément :</span>
                  <p className="text-slate-600">{offer.complement_desc}</p>
                </div>
              )}

              {/* Description */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-lg font-bold text-slate-900">Description détaillée</h3>
                <p className="text-sm sm:text-base text-slate-700 whitespace-pre-line leading-relaxed">
                  {offer.description || 'Aucune description complémentaire fournie par l\'exploitant.'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar (1 Col) */}
        <div className="space-y-6">
          {/* Owner Profile Card */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Proposé par
            </h3>

            <div className="flex items-center gap-3.5">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-300 bg-emerald-50 shrink-0 shadow-xs">
                <img
                  src={userAvatar}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-bold text-slate-900 truncate text-base">
                    {offer.user?.full_name || 'Agriculteur membre'}
                  </h4>
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                </div>
                <p className="text-xs text-slate-500 truncate mt-0.5">{offer.user?.city || offer.location}</p>
              </div>
            </div>

            {offer.user?.rating_avg > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 p-3 rounded-2xl border border-amber-200/80">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span className="font-bold">{offer.user.rating_avg.toFixed(1)} / 5</span>
                <span className="text-slate-500">({offer.user.exchange_count || 0} trocs réussis)</span>
              </div>
            )}

            <div className="space-y-3 pt-1">
              {offer.user?.id && (
                <Link
                  href={`/profil/${offer.user.id}`}
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
                >
                  <span>Consulter le profil complet</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>

          {/* Contact / In-App Message Form (if not owner) */}
          {!isOwner && offer.status === 'active' && (
            <div className="bg-white p-6 rounded-3xl border border-emerald-200/90 shadow-[0_4px_25px_rgba(5,96,58,0.06)] space-y-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-emerald-700" />
                <h3 className="text-base font-bold text-slate-900">
                  Discuter avec l'exploitant
                </h3>
              </div>

              {contactSuccess ? (
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{contactSuccess}</span>
                </div>
              ) : (
                <form onSubmit={handleStartConversation} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Écrivez votre message (ex: Salam, je suis intéressé, j'ai les semences disponibles...)"
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-none transition"
                  ></textarea>

                  {/* Suggested quick chips */}
                  <div className="space-y-1.5">
                    <p className="text-[11px] text-slate-400 font-medium">Suggestions :</p>
                    <div className="flex flex-col gap-1.5">
                      {QUICK_MESSAGES.map((msg, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setContactMsg(msg)}
                          className="text-left text-[11px] text-emerald-800 bg-emerald-50/70 hover:bg-emerald-100/70 px-2.5 py-1.5 rounded-xl border border-emerald-200/50 transition"
                        >
                          {msg}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={sendingMsg}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 disabled:opacity-60 text-white font-bold rounded-2xl text-sm shadow-[0_4px_14px_rgba(5,96,58,0.25)] transition flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{sendingMsg ? 'Envoi...' : 'Envoyer mon message'}</span>
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
                  className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-2xl text-xs shadow-xs transition flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Marquer le troc comme conclu</span>
                </button>
              )}

              <Link
                href={`/offres/${offerId}/modifier`}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
              >
                <Edit className="w-4 h-4" />
                <span>Modifier l'annonce</span>
              </Link>

              {offer.status === 'active' && (
                <button
                  onClick={handleCancelOffer}
                  disabled={actionLoading}
                  className="w-full py-3 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-2xl text-xs transition flex items-center justify-center gap-2"
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
