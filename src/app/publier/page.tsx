'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  Sprout,
  PlusCircle,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  UploadCloud,
  X,
  Loader2,
} from 'lucide-react'
import { RESOURCE_TYPES, COMPLEMENT_TYPES, SENEGAL_REGIONS, IMAGE_ACCEPT } from '@/lib/constants'

export default function PublierPage() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()

  const [title, setTitle] = useState('')
  const [resourceType, setResourceType] = useState('seeds')
  const [offeredResource, setOfferedResource] = useState('')
  const [wantedResource, setWantedResource] = useState('')
  const [complementType, setComplementType] = useState('none')
  const [complementDesc, setComplementDesc] = useState('')
  const [location, setLocation] = useState('Kaolack')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/connexion')
    }
  }, [isLoading, isAuthenticated, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)
    setUploadingImage(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('kind', 'listing')

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setImageUrl(data.url)
      } else {
        setUploadError(data.error || 'Erreur lors du téléversement')
      }
    } catch (err) {
      setUploadError('Erreur de connexion au service d\'images')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
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
        setError(data.error || 'Erreur lors de la publication de l\'offre')
      } else {
        router.push(`/offres/${data.id}`)
      }
    } catch (err) {
      setError('Erreur de connexion au serveur')
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Chargement...</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold">
          <Sprout className="w-3.5 h-3.5" />
          <span>Nouvelle proposition de troc</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          Publier une annonce d'échange agricole
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Renseignez ce que vous mettez à disposition et ce que vous souhaitez obtenir en échange.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* Category selector */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Type de ressource principale *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {RESOURCE_TYPES.map((cat) => (
              <button
                type="button"
                key={cat.value}
                onClick={() => setResourceType(cat.value)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition ${
                  resourceType === cat.value
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Titre de l'annonce *
          </label>
          <input
            type="text"
            required
            placeholder="ex: 100 kg Semences de maïs jaune contre semences de mil"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
          />
        </div>

        {/* 2-Col Exchange Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1.5">
              Ce que vous proposez *
            </label>
            <input
              type="text"
              required
              placeholder="ex: 100 kg de maïs jaune certifié"
              value={offeredResource}
              onChange={(e) => setOfferedResource(e.target.value)}
              className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-amber-800 mb-1.5">
              Ce que vous recherchez en échange *
            </label>
            <input
              type="text"
              required
              placeholder="ex: 80 à 100 kg de mil Souna"
              value={wantedResource}
              onChange={(e) => setWantedResource(e.target.value)}
              className="w-full px-4 py-3 bg-amber-50/50 border border-amber-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Complement Type */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Complément éventuel (soulte)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {COMPLEMENT_TYPES.map((comp) => (
              <button
                type="button"
                key={comp.value}
                onClick={() => setComplementType(comp.value)}
                className={`p-3 rounded-xl border text-left flex items-center gap-2 transition ${
                  complementType === comp.value
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-600'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl">{comp.icon}</span>
                <span className="text-xs">{comp.label}</span>
              </button>
            ))}
          </div>

          {complementType !== 'none' && (
            <input
              type="text"
              placeholder="Précisez le complément (ex: 20 000 FCFA pour couvrir le transport, ou 2 sacs de compost)"
              value={complementDesc}
              onChange={(e) => setComplementDesc(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          )}
        </div>

        {/* Region & Location */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Localisation / Région *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={location.split(',')[0]}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            >
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Précision (Commune, village, marché...)"
              value={location.includes(',') ? location.split(',')[1]?.trim() : ''}
              onChange={(e) => {
                const reg = location.split(',')[0] || 'Kaolack'
                setLocation(e.target.value ? `${reg}, ${e.target.value}` : reg)
              }}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>
        </div>

        {/* Photo Upload with Cloudinary & File picker */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            Photo de la ressource (Cloudinary ou Fichier)
          </label>

          {imageUrl ? (
            <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-3 right-3 p-1.5 bg-black/60 hover:bg-black text-white rounded-full transition"
                title="Supprimer la photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center transition bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <label className="cursor-pointer font-bold text-sm text-emerald-800 hover:underline">
                  <span>Téléverser une photo</span>
                  <input
                    type="file"
                    accept={IMAGE_ACCEPT}
                    onChange={handleFileUpload}
                    disabled={uploadingImage}
                    className="hidden"
                  />
                </label>
                <p className="text-xs text-slate-400">JPEG, PNG, WebP (max 5 Mo)</p>
              </div>

              <div className="text-xs text-slate-400 flex items-center justify-center gap-2">
                <span>ou collez une URL :</span>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs outline-none w-56"
                />
              </div>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-red-600 font-medium">{uploadError}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Description détaillée & conditions
          </label>
          <textarea
            rows={4}
            placeholder="Qualité des semences, état du matériel, conditions de transport ou de rencontre sur le terrain..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-none"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-2xl text-base shadow-md transition flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Publication en cours...</span>
          ) : (
            <>
              <span>Mettre en ligne mon offre de troc</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </form>
    </div>
  )
}
