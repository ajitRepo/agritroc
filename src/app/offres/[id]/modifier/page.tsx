'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { RESOURCE_TYPES, COMPLEMENT_TYPES, SENEGAL_REGIONS } from '@/lib/constants'

export default function ModifierOffrePage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const offerId = params.id as string

  const [title, setTitle] = useState('')
  const [resourceType, setResourceType] = useState('seeds')
  const [offeredResource, setOfferedResource] = useState('')
  const [wantedResource, setWantedResource] = useState('')
  const [complementType, setComplementType] = useState('none')
  const [complementDesc, setComplementDesc] = useState('')
  const [location, setLocation] = useState('Kaolack')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  // Photos supplémentaires : conservées telles quelles à l'enregistrement
  const [otherImages, setOtherImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadOffer() {
      try {
        const res = await fetch(`/api/offers/${offerId}`)
        if (res.ok) {
          const data = await res.json()
          setTitle(data.title || '')
          setResourceType(data.resource_type || 'seeds')
          setOfferedResource(data.offered_resource || '')
          setWantedResource(data.wanted_resource || '')
          setComplementType(data.complement_type || 'none')
          setComplementDesc(data.complement_desc || '')
          setLocation(data.location || 'Kaolack')
          setDescription(data.description || '')
          if (data.images && data.images.length > 0) {
            setImageUrl(data.images[0].image_url || '')
            setOtherImages(data.images.slice(1).map((img: { image_url: string }) => img.image_url))
          }
        }
      } catch (err) {
        console.error('Erreur chargement offre:', err)
      } finally {
        setFetching(false)
      }
    }
    if (offerId) loadOffer()
  }, [offerId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/offers/${offerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: JSON.stringify({
          title,
          resource_type: resourceType,
          offered_resource: offeredResource,
          wanted_resource: wantedResource,
          complement_type: complementType,
          complement_desc: complementDesc || null,
          location,
          description: description || null,
          images: [imageUrl, ...otherImages].filter(Boolean),
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Vos modifications n'ont pas pu être enregistrées. Réessayez.")
      } else {
        router.push(`/offres/${offerId}`)
      }
    } catch (err) {
      setError('Connexion impossible. Vérifiez votre réseau puis réessayez.')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4" aria-busy>
        <div className="h-8 w-2/3 rounded skeleton" />
        <div className="h-72 rounded-card skeleton" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-10 space-y-5">
      <div>
        <Link
          href={`/offres/${offerId}`}
          className="inline-flex items-center gap-1.5 h-10 text-sm font-semibold text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour à l&apos;annonce</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">
          Modifier l&apos;annonce
        </h1>
      </div>

      {error && (
        <div role="alert" className="p-4 rounded-card bg-red-50 border border-red-200 text-error text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-surface p-4 sm:p-6 rounded-card border border-line space-y-5">
        <div>
          <label className="block text-[15px] font-semibold text-ink mb-1.5">
            Titre de l&apos;annonce
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-[15px] font-semibold text-ink mb-1.5">
              Ce que vous proposez
            </label>
            <input
              type="text"
              required
              value={offeredResource}
              onChange={(e) => setOfferedResource(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-[15px] font-semibold text-ink mb-1.5">
              Ce que vous voulez en échange
            </label>
            <input
              type="text"
              required
              value={wantedResource}
              onChange={(e) => setWantedResource(e.target.value)}
              className="w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-[15px] font-semibold text-ink mb-1.5">
            Complément <span className="font-normal text-ink-subtle">(facultatif)</span>
          </label>
          <input
            type="text"
            placeholder="Détails du complément (facultatif)"
            value={complementDesc}
            onChange={(e) => setComplementDesc(e.target.value)}
            className="w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-[15px] font-semibold text-ink mb-1.5">
            Localisation
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-[15px] font-semibold text-ink mb-1.5">
            Lien de la photo principale
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-[15px] font-semibold text-ink mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-surface border border-line rounded-button text-base text-ink focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold rounded-button text-base transition-colors cursor-pointer"
        >
          {loading ? 'Enregistrement…' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}
