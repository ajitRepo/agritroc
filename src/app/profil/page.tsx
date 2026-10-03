'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  User,
  MapPin,
  Phone,
  ShieldCheck,
  Star,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Upload,
  Camera,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { SENEGAL_REGIONS } from '@/lib/constants'
import { AVATAR_PRESETS } from '@/lib/avatars'

export default function ProfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()

  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('kind', 'avatar')

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: formData,
      })

      const data = await res.json()
      if (res.ok && data.url) {
        setAvatarUrl(data.url)
      } else {
        setError(data.error || 'Erreur lors du téléversement de la photo')
      }
    } catch {
      setError('Erreur réseau lors du téléversement')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/connexion')
      return
    }
    if (user) {
      setFullName(user.fullName || user.full_name || '')
      setCity(user.city || 'Kaolack')
      setAddress(user.address || '')
      setAvatarUrl(user.avatarUrl || user.avatar_url || '')
      setBio(user.bio || '')
    }
  }, [isLoading, isAuthenticated, user, router])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSuccess(false)

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: JSON.stringify({
          fullName,
          city,
          address,
          avatarUrl: avatarUrl || null,
          bio: bio || null,
        }),
      })

      if (res.ok) {
        setSuccess(true)
        await refreshUser()
      } else {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la mise à jour')
      }
    } catch (err) {
      setError('Erreur de connexion')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Chargement du profil...</div>
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Profile Summary */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-emerald-100 shadow-xs flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-3xl shrink-0 overflow-hidden border-2 border-emerald-300 shadow-xs">
          {avatarUrl ? (
            <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            fullName?.[0] || 'U'
          )}
        </div>

        <div className="flex-1 text-center sm:text-left space-y-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {fullName || 'Agriculteur membre'}
            </h1>
            <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Membre vérifié</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center justify-center sm:justify-start gap-1 font-mono">
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>{user?.phone}</span>
          </p>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 pt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-emerald-700" />
              <strong>{user?.activeOffersCount || user?.active_offers_count || 0}</strong> annonces actives
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <strong>{user?.exchangeCount || user?.exchange_count || 0}</strong> trocs conclus
            </span>
            {(user?.ratingAvg || user?.rating_avg || 0) > 0 && (
              <span className="flex items-center gap-1 text-amber-700">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                <strong>{(user?.ratingAvg || user?.rating_avg)?.toFixed(1)}</strong> / 5
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Edit Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900">Modifier mes informations</h2>

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profil mis à jour avec succès !</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Nom complet ou Nom d'exploitation
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Région principale
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
              >
                {SENEGAL_REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Adresse ou Commune exacte
            </label>
            <input
              type="text"
              placeholder="ex: Commune de Ndoffane, Bassin arachidier"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
          </div>

          <div className="space-y-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Photo de profil / Avatar
            </label>

            {/* Current preview + upload actions */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-2xl shrink-0 overflow-hidden border-2 border-emerald-300 shadow-xs relative group">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  fullName?.[0]?.toUpperCase() || 'U'
                )}
                {uploadingAvatar && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingAvatar}
                    className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploadingAvatar ? 'Téléversement...' : 'Importer une photo'}</span>
                  </button>

                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl('')}
                      className="px-3 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Retirer</span>
                    </button>
                  )}
                </div>
                <p className="text-[11px] text-slate-500">
                  Formats acceptés : PNG, JPG, WebP. Taille maximale : 5 Mo.
                </p>
              </div>
            </div>

            {/* Presets Grid */}
            <div className="pt-2 border-t border-slate-200/80">
              <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                Ou choisissez un avatar agricole prédéfini :
              </span>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatarUrl(preset.url)}
                    className={`flex flex-col items-center p-1.5 rounded-xl border-2 transition ${
                      avatarUrl === preset.url
                        ? 'border-emerald-600 bg-emerald-50 scale-105 shadow-xs'
                        : 'border-transparent bg-white hover:bg-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <img src={preset.url} alt={preset.label} className="w-10 h-10 rounded-full object-cover" />
                    <span className="text-[10px] text-slate-600 font-medium mt-1 truncate max-w-full">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual URL Fallback */}
            <div className="pt-1">
              <input
                type="url"
                placeholder="Ou collez une URL d'image personnalisée (https://...)"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Présentation / Bio
            </label>
            <textarea
              rows={3}
              placeholder="Décrivez vos cultures, vos élevages ou votre activité agricole..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow transition"
          >
            {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
          </button>
        </form>
      </div>
    </div>
  )
}
