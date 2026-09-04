'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sprout, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react'
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
          images: imageUrl ? [imageUrl] : [],
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erreur lors de la mise à jour')
      } else {
        router.push(`/offres/${offerId}`)
      }
    } catch (err) {
      setError('Erreur serveur')
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return <div className="p-12 text-center text-slate-500">Chargement de l'annonce...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <Link
          href={`/offres/${offerId}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour aux détails</span>
        </Link>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Modifier l'annonce de troc
        </h1>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Titre de l'annonce *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
              Ce que vous proposez *
            </label>
            <input
              type="text"
              required
              value={offeredResource}
              onChange={(e) => setOfferedResource(e.target.value)}
              className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
              Ce que vous recherchez *
            </label>
            <input
              type="text"
              required
              value={wantedResource}
              onChange={(e) => setWantedResource(e.target.value)}
              className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Complément éventuel
          </label>
          <input
            type="text"
            placeholder="Détails du complément (facultatif)"
            value={complementDesc}
            onChange={(e) => setComplementDesc(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Localisation *
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            URL Photo
          </label>
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-2xl text-base shadow transition"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}
