'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import {
  Plus,
  MapPin,
  Image as ImageIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  UploadCloud,
  X,
  Loader2,
  ShieldCheck,
  ArrowLeftRight,
} from 'lucide-react'
import { RESOURCE_TYPES, COMPLEMENT_TYPES, SENEGAL_REGIONS, IMAGE_ACCEPT } from '@/lib/constants'

const CATEGORY_ICONS: Record<string, string> = {
  seeds: '/avatars/avatar-seedling.webp',
  production: '/avatars/avatar-wheat.webp',
  livestock: '/avatars/avatar-cow.webp',
  machinery: '/avatars/avatar-tractor.webp',
  land: '/avatars/avatar-sprout.webp',
  other: '/avatars/avatar-peanut.webp',
}

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
    return <div className="p-16 text-center text-slate-500 font-medium">Chargement...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#022c22] to-[#064e3b] p-8 sm:p-10 rounded-3xl text-white shadow-xl border border-emerald-500/20">
        <div className="space-y-2 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-emerald-200 text-xs font-semibold backdrop-blur">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Échange solidaire & direct</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Publier une offre de troc agricole
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80">
            Détaillez vos surplus ou équipements disponibles et précisez ce dont vous avez besoin en retour.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center gap-2.5 animate-in fade-in">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.04)] space-y-8">
        {/* Category selector with 3D Icons */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            1. Choisissez la catégorie de la ressource *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {RESOURCE_TYPES.map((cat) => {
              const iconUrl = CATEGORY_ICONS[cat.value] || '/avatars/avatar-sprout.webp'
              const isSelected = resourceType === cat.value
              return (
                <button
                  type="button"
                  key={cat.value}
                  onClick={() => setResourceType(cat.value)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center gap-3 transition-all duration-200 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/90 text-emerald-950 font-bold ring-2 ring-emerald-600/30 shadow-xs'
                      : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden p-0.5 bg-white border border-emerald-100 shrink-0 shadow-xs">
                    <Image
                      src={iconUrl}
                      alt={cat.label}
                      width={40}
                      height={40}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-xs sm:text-sm font-semibold">{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            2. Titre de l'annonce *
          </label>
          <input
            type="text"
            required
            placeholder="ex: 100 kg Semences de maïs jaune contre semences de mil"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
          />
        </div>

        {/* 2-Col Exchange Details with High-contrast Badges */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            3. Les termes de l'échange *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200/80 space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                <span>🌱 Ce que vous proposez</span>
              </span>
              <input
                type="text"
                required
                placeholder="ex: 100 kg de maïs certifié"
                value={offeredResource}
                onChange={(e) => setOfferedResource(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-emerald-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 transition"
              />
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
                <span>🤝 Ce que vous recherchez</span>
              </span>
              <input
                type="text"
                required
                placeholder="ex: 80 à 100 kg de mil Souna"
                value={wantedResource}
                onChange={(e) => setWantedResource(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-amber-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Complement Type */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            4. Complément financier ou matériel éventuel (Optionnel)
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {COMPLEMENT_TYPES.map((comp) => (
              <button
                type="button"
                key={comp.value}
                onClick={() => setComplementType(comp.value)}
                className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition ${
                  complementType === comp.value
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-bold ring-2 ring-emerald-600/30'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span className="text-xl">{comp.icon}</span>
                <span className="text-xs font-semibold">{comp.label}</span>
              </button>
            ))}
          </div>

          {complementType !== 'none' && (
            <input
              type="text"
              placeholder="Précisez le complément (ex: 20 000 FCFA pour couvrir le transport, ou 2 sacs de compost)"
              value={complementDesc}
              onChange={(e) => setComplementDesc(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          )}
        </div>

        {/* Region & Location */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            5. Localisation / Région d'échange *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <select
              value={location.split(',')[0]}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition cursor-pointer"
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
              className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
            />
          </div>
        </div>

        {/* Photo Upload with File picker */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            6. Photo de la ressource (Optionnel)
          </label>

          {imageUrl ? (
            <div className="relative w-full h-56 rounded-3xl overflow-hidden border border-slate-200 bg-slate-100 group shadow-inner">
              <img src={imageUrl} alt="Aperçu" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => setImageUrl('')}
                className="absolute top-3.5 right-3.5 p-2 bg-black/60 hover:bg-black text-white rounded-full transition shadow-md"
                title="Supprimer la photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-3xl p-8 text-center transition bg-slate-50/50 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                {uploadingImage ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <label className="cursor-pointer font-bold text-sm text-emerald-800 hover:underline">
                  <span>Téléverser une photo depuis votre appareil</span>
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

              <div className="text-xs text-slate-400 flex items-center justify-center gap-2 pt-1">
                <span>ou collez une URL :</span>
                <input
                  type="url"
                  placeholder="https://..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs outline-none w-64"
                />
              </div>
            </div>
          )}

          {uploadError && (
            <p className="text-xs text-red-600 font-semibold">{uploadError}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
            7. Description détaillée & conditions
          </label>
          <textarea
            rows={4}
            placeholder="Qualité des semences, état du matériel, conditions de transport ou de rencontre sur le terrain..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white resize-none transition"
          ></textarea>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading || uploadingImage}
          className="w-full py-4.5 bg-gradient-to-r from-emerald-700 to-emerald-800 hover:from-emerald-800 hover:to-emerald-900 disabled:opacity-60 text-white font-bold rounded-2xl text-base shadow-[0_4px_18px_rgba(5,96,58,0.3)] transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 cursor-pointer"
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
