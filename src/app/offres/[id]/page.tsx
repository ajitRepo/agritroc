'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import {
  MapPin,
  Calendar,
  Eye,
  ArrowLeft,
  Share2,
  Edit,
  Trash2,
  Check,
  Star,
  ChevronRight,
  MessageCircle,
  CheckCircle2,
  Plus,
  AlertCircle,
} from 'lucide-react'
import { COMPLEMENT_TYPES, categoryIcon, categoryLabel, whatsAppUrl } from '@/lib/constants'
import type { Offer } from '@/lib/types'

type LoadState = 'loading' | 'ready' | 'not-found' | 'error'

function StatusBadge({ status }: { status: string }) {
  if (status === 'active')
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary-soft text-primary text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" aria-hidden />
        Disponible
      </span>
    )
  if (status === 'completed')
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-secondary text-ink-muted text-xs font-semibold">
        <Check className="w-3.5 h-3.5" aria-hidden />
        Troc conclu
      </span>
    )
  return (
    <span className="px-2.5 py-1 rounded-full bg-surface-secondary text-ink-muted text-xs font-semibold">Annulée</span>
  )
}

function OfferDetail() {
  const params = useParams()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { showToast } = useToast()

  const [offer, setOffer] = useState<Offer | null>(null)
  const [state, setState] = useState<LoadState>('loading')
  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [actionLoading, setActionLoading] = useState(false)
  const [confirming, setConfirming] = useState<'complete' | 'cancel' | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  const offerId = params.id as string
  const justPublished = searchParams.get('publie') === '1'

  useEffect(() => {
    async function fetchDetail() {
      try {
        const res = await fetch(`/api/offers/${offerId}`)
        if (res.ok) {
          setOffer(await res.json())
          setState('ready')
        } else {
          setState(res.status === 404 ? 'not-found' : 'error')
        }
      } catch (err) {
        console.error('Erreur chargement offre:', err)
        setState('error')
      }
    }
    if (offerId) fetchDetail()
  }, [offerId, reloadKey])

  const isOwner = !!(user && offer?.user && user.id === offer.user.id)

  const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}` })

  const handleCompleteOffer = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/offers/${offerId}/complete`, { method: 'POST', headers: authHeader() })
      if (!res.ok) throw new Error(String(res.status))
      setOffer(await res.json())
      showToast('Bravo ! Votre troc est marqué comme conclu.')
    } catch (err) {
      console.error('Erreur completion:', err)
      showToast("L'opération n'a pas abouti. Réessayez.", 'error')
    } finally {
      setActionLoading(false)
      setConfirming(null)
    }
  }

  const handleCancelOffer = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/offers/${offerId}`, { method: 'DELETE', headers: authHeader() })
      if (!res.ok) throw new Error(String(res.status))
      showToast('Votre annonce a été retirée.', 'info')
      router.push('/mes-offres')
    } catch (err) {
      console.error('Erreur annulation:', err)
      showToast("L'annonce n'a pas pu être retirée. Réessayez.", 'error')
      setActionLoading(false)
      setConfirming(null)
    }
  }

  const handleShare = async () => {
    const url = window.location.origin + `/offres/${offerId}`
    try {
      if (navigator.share) {
        await navigator.share({ title: offer?.title, url })
      } else {
        await navigator.clipboard.writeText(url)
        showToast('Lien copié')
      }
    } catch {
      // Partage annulé par l'utilisateur : rien à signaler
    }
  }

  if (state === 'loading') {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8" aria-busy>
        <span className="sr-only" role="status">
          Chargement de l&apos;annonce…
        </span>
        <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8">
          <div className="space-y-4">
            <div className="aspect-[4/3] sm:aspect-[16/10] rounded-panel skeleton" />
            <div className="h-7 w-3/4 rounded skeleton" />
            <div className="h-4 w-1/3 rounded skeleton" />
            <div className="h-24 rounded-card skeleton" />
          </div>
          <div className="hidden lg:block h-64 rounded-panel skeleton" />
        </div>
      </div>
    )
  }

  if (state !== 'ready' || !offer) {
    const notFound = state === 'not-found'
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-3">
        {notFound ? (
          <p className="text-4xl" aria-hidden>
            🌾
          </p>
        ) : (
          <AlertCircle className="w-10 h-10 text-warning mx-auto" aria-hidden />
        )}
        <h1 className="text-xl font-bold text-ink">
          {notFound ? 'Cette annonce n’existe plus.' : 'Impossible de charger cette annonce.'}
        </h1>
        <p className="text-sm text-ink-muted">
          {notFound
            ? 'Elle a peut-être été retirée par son auteur.'
            : 'Vérifiez votre connexion internet puis réessayez.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          {!notFound && (
            <button
              onClick={() => {
                setState('loading')
                setReloadKey((k) => k + 1)
              }}
              className="h-11 px-5 rounded-button bg-primary text-white font-semibold text-sm cursor-pointer"
            >
              Réessayer
            </button>
          )}
          <Link
            href="/offres"
            className="inline-flex items-center justify-center h-11 px-5 rounded-button bg-surface-secondary text-ink font-semibold text-sm"
          >
            Voir les autres annonces
          </Link>
        </div>
      </div>
    )
  }

  const images = offer.images || []
  const compType = COMPLEMENT_TYPES.find((c) => c.value === offer.complement_type)
  const sellerName = offer.user?.full_name || 'Agriculteur membre'
  const sellerAvatar = offer.user?.avatar_url || '/avatars/avatar-farmer-w.webp'
  const canContact = !isOwner && offer.status === 'active'
  const contactUrl = offer.user?.phone ? whatsAppUrl(offer.user.phone, offer.title) : null
  const publishedOn = offer.created_at
    ? new Date(offer.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null

  const whatsAppButton = contactUrl ? (
    <a
      href={contactUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full h-12 bg-[#1fa855] hover:bg-[#178f47] text-white font-semibold rounded-button text-base transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
    >
      <MessageCircle className="w-5 h-5" aria-hidden />
      Contacter sur WhatsApp
    </a>
  ) : (
    <p className="p-3 bg-surface-secondary rounded-button text-sm text-ink-muted text-center">
      Le numéro de ce vendeur n&apos;est pas disponible.
    </p>
  )

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-10 sm:pt-8">
      <div className="flex items-center justify-between mb-3 sm:mb-5">
        <button
          onClick={() => (window.history.length > 1 ? router.back() : router.push('/offres'))}
          className="inline-flex items-center gap-1.5 h-10 -ml-2 px-2 rounded-control text-sm font-semibold text-ink-muted hover:text-ink cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" aria-hidden />
          Retour
        </button>
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 h-10 px-3 rounded-control text-sm font-semibold text-ink-muted hover:text-ink hover:bg-surface-secondary cursor-pointer"
        >
          <Share2 className="w-4 h-4" aria-hidden />
          Partager
        </button>
      </div>

      {justPublished && isOwner && (
        <div className="mb-5 p-4 rounded-card bg-primary-soft border border-primary/20 flex flex-col sm:flex-row sm:items-center gap-3 animate-fade-up" role="status">
          <div className="flex items-center gap-2.5 flex-1">
            <CheckCircle2 className="w-6 h-6 text-primary shrink-0" aria-hidden />
            <div>
              <p className="font-semibold text-ink">Votre annonce est maintenant en ligne.</p>
              <p className="text-sm text-ink-muted">Les intéressés vous contacteront sur WhatsApp.</p>
            </div>
          </div>
          <Link
            href="/publier"
            className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-button bg-surface border border-line text-sm font-semibold text-ink hover:bg-surface-secondary"
          >
            <Plus className="w-4 h-4" aria-hidden />
            Publier un autre produit
          </Link>
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_360px] gap-6 lg:gap-8 items-start">
        <div className="space-y-6 min-w-0">
          {/* Galerie */}
          <div className="space-y-2.5">
            <div className="relative aspect-[4/3] sm:aspect-[16/10] overflow-hidden bg-surface-secondary -mx-4 sm:mx-0 rounded-none sm:rounded-panel">
              {images.length > 0 ? (
                <img
                  src={images[activeImageIdx]?.image_url}
                  alt={offer.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-gradient-to-br from-primary-soft to-ochre-soft">
                  <Image src={categoryIcon(offer.resource_type)} alt="" width={96} height={96} />
                  <span className="text-sm font-medium text-ink-muted">Pas de photo</span>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setActiveImageIdx(idx)}
                    aria-label={`Photo ${idx + 1}`}
                    aria-current={activeImageIdx === idx}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-control overflow-hidden shrink-0 border-2 transition cursor-pointer ${
                      activeImageIdx === idx ? 'border-primary' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img.image_url} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Titre et infos clés */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={offer.status} />
              <span className="px-2.5 py-1 rounded-full bg-surface border border-line text-xs font-semibold text-ink-muted">
                {categoryLabel(offer.resource_type)}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-ink leading-tight">{offer.title}</h1>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1.5 font-medium text-ink">
                <MapPin className="w-4 h-4 text-primary" aria-hidden />
                {offer.location}
              </span>
              {publishedOn && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" aria-hidden />
                  {publishedOn}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Eye className="w-4 h-4" aria-hidden />
                {offer.views_count || 0} vues
              </span>
            </div>
          </div>

          {/* L'échange : le cœur de l'annonce */}
          <section aria-label="L'échange proposé" className="rounded-card border border-line bg-surface overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-line">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Propose</p>
              <p className="mt-1 text-lg font-semibold text-ink">{offer.offered_resource}</p>
            </div>
            <div className="p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-ochre">En échange de</p>
              <p className="mt-1 text-lg font-semibold text-ink">{offer.wanted_resource}</p>
            </div>
            {offer.complement_type !== 'none' && (
              <div className="px-4 sm:px-5 py-3 bg-ochre-soft text-sm">
                <span className="font-semibold text-ink">{compType?.badge || '+ Complément'}</span>
                {offer.complement_desc && <span className="text-ink-muted"> — {offer.complement_desc}</span>}
              </div>
            )}
          </section>

          {offer.description && (
            <section className="space-y-2">
              <h2 className="text-lg font-bold text-ink">Description</h2>
              <p className="text-base text-ink-muted whitespace-pre-line leading-relaxed">{offer.description}</p>
            </section>
          )}
        </div>

        {/* Colonne vendeur / actions */}
        <aside className="space-y-4 lg:sticky lg:top-24">
          <div className="bg-surface rounded-card border border-line p-4 sm:p-5 space-y-4">
            <Link
              href={offer.user?.id ? `/profil/${offer.user.id}` : '#'}
              className="flex items-center gap-3 -m-1 p-1 rounded-control hover:bg-surface-secondary"
            >
              <img src={sellerAvatar} alt="" className="w-12 h-12 rounded-full object-cover bg-primary-soft shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-ink-subtle">Proposé par</p>
                <p className="font-semibold text-ink truncate">{sellerName}</p>
                <p className="text-sm text-ink-muted truncate">{offer.user?.city || offer.location}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-ink-subtle shrink-0" aria-hidden />
            </Link>

            {(offer.user?.rating_avg ?? 0) > 0 && (
              <p className="flex items-center gap-1.5 text-sm text-ink-muted">
                <Star className="w-4 h-4 fill-ochre text-ochre" aria-hidden />
                <span className="font-semibold text-ink">{offer.user!.rating_avg!.toFixed(1)}/5</span>
                <span>· {offer.user?.exchange_count || 0} trocs réussis</span>
              </p>
            )}

            {canContact && (
              <div className="hidden lg:block space-y-2 pt-1">
                {whatsAppButton}
                <p className="text-xs text-ink-subtle text-center">Discutez quantités, lieu et date du troc.</p>
              </div>
            )}
          </div>

          {isOwner && (
            <div className="bg-surface rounded-card border border-line p-4 sm:p-5 space-y-2.5">
              <h2 className="text-sm font-semibold text-ink">Gérer mon annonce</h2>

              {confirming ? (
                <div className="space-y-2.5 animate-fade-up" role="alertdialog" aria-label="Confirmation">
                  <p className="text-sm text-ink">
                    {confirming === 'complete'
                      ? 'Confirmez-vous que ce troc a bien été conclu ?'
                      : "Retirer cette annonce ? Elle ne sera plus visible."}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setConfirming(null)}
                      disabled={actionLoading}
                      className="h-11 rounded-button bg-surface-secondary text-ink font-semibold text-sm cursor-pointer"
                    >
                      Non
                    </button>
                    <button
                      onClick={confirming === 'complete' ? handleCompleteOffer : handleCancelOffer}
                      disabled={actionLoading}
                      className={`h-11 rounded-button text-white font-semibold text-sm cursor-pointer disabled:opacity-60 ${
                        confirming === 'complete' ? 'bg-primary' : 'bg-error'
                      }`}
                    >
                      {actionLoading ? 'Un instant…' : confirming === 'complete' ? 'Oui, conclu' : 'Oui, retirer'}
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {offer.status === 'active' && (
                    <button
                      onClick={() => setConfirming('complete')}
                      className="w-full h-11 bg-primary hover:bg-primary-dark text-white font-semibold rounded-button text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Check className="w-4 h-4" aria-hidden />
                      Marquer comme conclu
                    </button>
                  )}
                  <Link
                    href={`/offres/${offerId}/modifier`}
                    className="w-full h-11 bg-surface-secondary hover:bg-line text-ink font-semibold rounded-button text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" aria-hidden />
                    Modifier
                  </Link>
                  {offer.status === 'active' && (
                    <button
                      onClick={() => setConfirming('cancel')}
                      className="w-full h-11 text-error hover:bg-red-50 font-semibold rounded-button text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" aria-hidden />
                      Retirer l&apos;annonce
                    </button>
                  )}
                </>
              )}
            </div>
          )}
        </aside>
      </div>

      {/* CTA collant mobile : contacter en un geste */}
      {canContact && (
        <div
          data-sticky-cta
          className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-surface/95 backdrop-blur border-t border-line px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        >
          <div className="max-w-md mx-auto">{whatsAppButton}</div>
        </div>
      )}
    </div>
  )
}

export default function OfferDetailPage() {
  return (
    <Suspense fallback={null}>
      <OfferDetail />
    </Suspense>
  )
}
