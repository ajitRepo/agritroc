'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import { Camera, ChevronRight, Layers, LogOut, Eye, Loader2, AlertCircle, Star } from 'lucide-react'
import { SENEGAL_REGIONS, IMAGE_ACCEPT } from '@/lib/constants'
import { AVATAR_PRESETS } from '@/lib/avatars'

const inputClass =
  'w-full h-12 px-4 bg-surface border border-line rounded-button text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition'
const labelClass = 'block text-[15px] font-semibold text-ink mb-1.5'

export default function ProfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, refreshUser, logout } = useAuth()
  const { showToast } = useToast()

  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [nameError, setNameError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const loggingOut = useRef(false)

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !loggingOut.current) {
      router.replace('/connexion?next=/profil')
    }
  }, [isLoading, isAuthenticated, router])

  // Remplit le formulaire quand le profil arrive ou change (après enregistrement)
  const [loadedFrom, setLoadedFrom] = useState<typeof user>(null)
  if (user && user !== loadedFrom) {
    setLoadedFrom(user)
    setFullName(user.fullName || user.full_name || '')
    setCity(user.city || '')
    setAddress(user.address || '')
    setAvatarUrl(user.avatarUrl || user.avatar_url || '')
    setBio(user.bio || '')
  }

  const isDirty =
    !!user &&
    (fullName !== (user.fullName || user.full_name || '') ||
      city !== (user.city || '') ||
      address !== (user.address || '') ||
      avatarUrl !== (user.avatarUrl || user.avatar_url || '') ||
      bio !== (user.bio || ''))

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setUploadingAvatar(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('kind', 'avatar')
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}` },
        body: formData,
      })
      const data = await res.json()
      if (res.ok && data.url) {
        setAvatarUrl(data.url)
        showToast('Photo ajoutée. Appuyez sur « Enregistrer ».', 'info')
      } else showToast(data.error || "La photo n'a pas pu être envoyée.", 'error')
    } catch {
      showToast('Connexion impossible. Réessayez.', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (fullName.trim().length < 2) {
      setNameError('Indiquez votre nom ou celui de votre exploitation.')
      document.getElementById('profil-name')?.focus()
      return
    }
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: JSON.stringify({
          fullName: fullName.trim(),
          city: city || null,
          address: address.trim() || null,
          avatarUrl: avatarUrl || null,
          bio: bio.trim() || null,
        }),
      })
      if (res.ok) {
        await refreshUser()
        showToast('Profil enregistré')
      } else {
        const data = await res.json().catch(() => null)
        setError(data?.error || "Vos modifications n'ont pas pu être enregistrées. Réessayez.")
      }
    } catch {
      setError('Connexion impossible. Vérifiez votre réseau puis réessayez.')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading || !user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4" aria-busy>
        <div className="h-28 rounded-card skeleton" />
        <div className="h-20 rounded-card skeleton" />
        <div className="h-72 rounded-card skeleton" />
      </div>
    )
  }

  const activeCount = user.activeOffersCount || user.active_offers_count || 0
  const exchangeCount = user.exchangeCount || user.exchange_count || 0
  const rating = user.ratingAvg || user.rating_avg || 0
  // Une ancienne valeur hors liste ne doit pas disparaître du menu
  const regionOptions: string[] = city && !(SENEGAL_REGIONS as readonly string[]).includes(city) ? [city, ...SENEGAL_REGIONS] : [...SENEGAL_REGIONS]

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-10 space-y-4">
      {/* Résumé */}
      <section className="bg-surface rounded-card border border-line p-4 sm:p-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingAvatar}
            aria-label="Changer la photo de profil"
            className="relative w-20 h-20 shrink-0 rounded-full overflow-hidden bg-primary-soft cursor-pointer group"
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="w-full h-full flex items-center justify-center text-2xl font-bold text-primary">
                {(fullName[0] || 'U').toUpperCase()}
              </span>
            )}
            <span className="absolute inset-x-0 bottom-0 h-7 bg-black/50 flex items-center justify-center">
              {uploadingAvatar ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" aria-hidden />
              ) : (
                <Camera className="w-4 h-4 text-white" aria-hidden />
              )}
            </span>
          </button>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-ink truncate">{fullName || 'Mon profil'}</h1>
            <p className="text-ink-muted">{user.phone}</p>
            {user.city && <p className="text-sm text-ink-subtle">{user.city}</p>}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-button bg-surface-secondary py-2.5">
            <dt className="text-xs text-ink-muted">Annonces</dt>
            <dd className="text-lg font-bold text-ink">{activeCount}</dd>
          </div>
          <div className="rounded-button bg-surface-secondary py-2.5">
            <dt className="text-xs text-ink-muted">Trocs conclus</dt>
            <dd className="text-lg font-bold text-ink">{exchangeCount}</dd>
          </div>
          <div className="rounded-button bg-surface-secondary py-2.5">
            <dt className="text-xs text-ink-muted">Note</dt>
            <dd className="text-lg font-bold text-ink flex items-center justify-center gap-1">
              {rating > 0 ? (
                <>
                  <Star className="w-4 h-4 fill-ochre text-ochre" aria-hidden />
                  {rating.toFixed(1)}
                </>
              ) : (
                <span className="text-sm font-medium text-ink-subtle">—</span>
              )}
            </dd>
          </div>
        </dl>
      </section>

      {/* Raccourcis */}
      <nav className="bg-surface rounded-card border border-line divide-y divide-line overflow-hidden" aria-label="Mon compte">
        <Link href="/mes-offres" className="flex items-center gap-3 px-4 h-14 hover:bg-surface-secondary">
          <Layers className="w-5 h-5 text-primary" aria-hidden />
          <span className="flex-1 font-medium text-ink">Mes annonces</span>
          <ChevronRight className="w-5 h-5 text-ink-subtle" aria-hidden />
        </Link>
        <Link href={`/profil/${user.id}`} className="flex items-center gap-3 px-4 h-14 hover:bg-surface-secondary">
          <Eye className="w-5 h-5 text-primary" aria-hidden />
          <span className="flex-1 font-medium text-ink">Voir mon profil public</span>
          <ChevronRight className="w-5 h-5 text-ink-subtle" aria-hidden />
        </Link>
      </nav>

      {/* Modifier */}
      <form onSubmit={handleUpdate} noValidate className="bg-surface rounded-card border border-line p-4 sm:p-6 space-y-5">
        <div>
          <h2 className="text-lg font-bold text-ink">Mes informations</h2>
          <p className="text-sm text-ink-muted">Visibles par les personnes qui consultent vos annonces.</p>
        </div>

        <div>
          <label htmlFor="profil-name" className={labelClass}>
            Nom ou exploitation
          </label>
          <input
            id="profil-name"
            type="text"
            autoComplete="name"
            maxLength={60}
            value={fullName}
            onChange={(e) => {
              setFullName(e.target.value)
              setNameError(null)
            }}
            aria-invalid={!!nameError}
            className={`${inputClass} ${nameError ? 'border-error' : ''}`}
          />
          {nameError && (
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
              <AlertCircle className="w-4 h-4" aria-hidden />
              {nameError}
            </p>
          )}
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="profil-region" className={labelClass}>
              Région
            </label>
            <select
              id="profil-region"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className={`${inputClass} cursor-pointer ${city ? '' : 'text-ink-subtle'}`}
            >
              <option value="">Choisissez votre région</option>
              {regionOptions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="profil-address" className={labelClass}>
              Commune ou village <span className="font-normal text-ink-subtle">(facultatif)</span>
            </label>
            <input
              id="profil-address"
              type="text"
              placeholder="Ex. : Ndoffane"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        <div>
          <p className={labelClass}>Photo de profil</p>
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingAvatar}
              aria-label="Importer une photo"
              className="w-12 h-12 shrink-0 rounded-full border-2 border-dashed border-primary/40 bg-primary-soft text-primary flex items-center justify-center cursor-pointer"
            >
              {uploadingAvatar ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : <Camera className="w-5 h-5" aria-hidden />}
            </button>
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAvatarUrl(preset.url)}
                aria-label={preset.label}
                aria-pressed={avatarUrl === preset.url}
                className={`w-12 h-12 shrink-0 rounded-full overflow-hidden ring-offset-2 transition cursor-pointer ${
                  avatarUrl === preset.url ? 'ring-2 ring-primary' : 'opacity-80 hover:opacity-100'
                }`}
              >
                <img src={preset.url} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
          {avatarUrl && (
            <button
              type="button"
              onClick={() => setAvatarUrl('')}
              className="mt-1 h-9 text-sm font-medium text-ink-muted hover:text-error cursor-pointer"
            >
              Retirer la photo
            </button>
          )}
          <input ref={fileInputRef} type="file" accept={IMAGE_ACCEPT} onChange={handleAvatarUpload} className="sr-only" tabIndex={-1} />
        </div>

        <div>
          <label htmlFor="profil-bio" className={labelClass}>
            Présentation <span className="font-normal text-ink-subtle">(facultatif)</span>
          </label>
          <textarea
            id="profil-bio"
            rows={3}
            placeholder="Vos cultures, votre élevage, votre activité…"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full p-4 bg-surface border border-line rounded-button text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
          />
        </div>

        {error && (
          <p role="alert" className="p-3 rounded-button bg-red-50 border border-red-200 text-error text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={saving || uploadingAvatar || !isDirty}
          className="w-full h-12 bg-primary hover:bg-primary-dark disabled:bg-surface-secondary disabled:text-ink-subtle text-white font-semibold rounded-button text-base transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:cursor-default"
        >
          {saving && <Loader2 className="w-5 h-5 animate-spin" aria-hidden />}
          {saving ? 'Enregistrement…' : isDirty ? 'Enregistrer' : 'Aucune modification'}
        </button>
      </form>

      <button
        onClick={async () => {
          loggingOut.current = true
          await logout()
          router.replace('/')
        }}
        className="w-full h-12 flex items-center justify-center gap-2 rounded-button text-error font-semibold hover:bg-red-50 cursor-pointer"
      >
        <LogOut className="w-5 h-5" aria-hidden />
        Se déconnecter
      </button>
    </div>
  )
}
