'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { AlertCircle, Camera, X, Loader2, ChevronDown, Link as LinkIcon } from 'lucide-react'
import {
  RESOURCE_TYPES,
  COMPLEMENT_TYPES,
  SENEGAL_REGIONS,
  IMAGE_ACCEPT,
  IMAGE_FORMATS_LABEL,
  MAX_LISTING_PHOTOS,
  MAX_PHOTO_BYTES,
  megabytes,
  photoRejectionReason,
  categoryIcon,
} from '@/lib/constants'

type Field = 'offered' | 'wanted' | 'region' | 'title'

const inputClass = (hasError?: boolean) =>
  `w-full h-12 px-4 bg-surface border rounded-button text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 transition ${
    hasError ? 'border-error focus:ring-error/40' : 'border-line focus:ring-primary focus:border-transparent'
  }`

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 flex items-center gap-1.5 text-sm text-error">
      <AlertCircle className="w-4 h-4 shrink-0" aria-hidden />
      {message}
    </p>
  )
}

export default function PublierPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [resourceType, setResourceType] = useState('seeds')
  const [offeredResource, setOfferedResource] = useState('')
  const [wantedResource, setWantedResource] = useState('')
  const [region, setRegion] = useState('')
  const [place, setPlace] = useState('')
  const [title, setTitle] = useState('')
  const [complementType, setComplementType] = useState('none')
  const [complementDesc, setComplementDesc] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlDraft, setUrlDraft] = useState('')
  const [showDetails, setShowDetails] = useState(false)

  const [uploadingImage, setUploadingImage] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({})
  const [submitted, setSubmitted] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/connexion?next=/publier')
    }
  }, [isLoading, isAuthenticated, router])

  // Valeur par défaut intelligente : la région du profil, si elle est connue
  const [regionDefaulted, setRegionDefaulted] = useState(false)
  if (!regionDefaulted && user) {
    setRegionDefaulted(true)
    const match = SENEGAL_REGIONS.find((r) => user.city?.toLowerCase().includes(r.toLowerCase()))
    if (match) setRegion(match)
  }

  // Titre généré automatiquement : un champ de moins à remplir
  const autoTitle =
    offeredResource.trim() && wantedResource.trim()
      ? `${offeredResource.trim()} contre ${wantedResource.trim()}`
      : offeredResource.trim()
  const finalTitle = title.trim() || autoTitle

  const errors: Partial<Record<Field, string>> = {}
  if (offeredResource.trim().length < 2) errors.offered = 'Indiquez ce que vous proposez.'
  if (wantedResource.trim().length < 2) errors.wanted = 'Indiquez ce que vous voulez en échange.'
  if (!region) errors.region = 'Choisissez votre région.'
  if (title.trim() && title.trim().length < 3) errors.title = 'Le titre doit faire au moins 3 caractères.'

  const showError = (f: Field) => (touched[f] || submitted ? errors[f] : undefined)
  const touch = (f: Field) => () => setTouched((t) => ({ ...t, [f]: true }))

  const uploadFile = async (file: File): Promise<string | null> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('kind', 'listing')
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}` },
      body: formData,
    })
    const data = await res.json()
    if (res.ok && data.url) return data.url
    throw new Error(data.error || "La photo n'a pas pu être envoyée.")
  }

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, MAX_LISTING_PHOTOS - images.length)
    e.target.value = ''
    if (files.length === 0) return

    setUploadError(null)
    const rejected = files.map(photoRejectionReason).find(Boolean)
    if (rejected) {
      setUploadError(rejected)
      return
    }

    setUploadingImage(true)
    try {
      for (const file of files) {
        const url = await uploadFile(file)
        if (url) setImages((prev) => [...prev, url].slice(0, MAX_LISTING_PHOTOS))
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Connexion impossible. Réessayez.')
    } finally {
      setUploadingImage(false)
    }
  }

  const addImageUrl = () => {
    const url = urlDraft.trim()
    if (!/^https?:\/\/\S+$/.test(url)) {
      setUploadError('Ce lien ne semble pas valide. Il doit commencer par https://')
      return
    }
    setImages((prev) => [...prev, url].slice(0, MAX_LISTING_PHOTOS))
    setUrlDraft('')
    setShowUrlInput(false)
    setUploadError(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setError(null)

    if (Object.keys(errors).length > 0) {
      if (errors.title) setShowDetails(true)
      // Amène l'utilisateur directement au premier champ à corriger
      requestAnimationFrame(() => {
        formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus()
      })
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: JSON.stringify({
          title: finalTitle,
          resource_type: resourceType,
          offered_resource: offeredResource.trim(),
          wanted_resource: wantedResource.trim(),
          complement_type: complementType,
          complement_desc: complementType !== 'none' && complementDesc.trim() ? complementDesc.trim() : null,
          location: place.trim() ? `${region}, ${place.trim()}` : region,
          description: description.trim() || null,
          images,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Votre annonce n'a pas pu être publiée. Réessayez.")
        setLoading(false)
      } else {
        router.push(`/offres/${data.id}?publie=1`)
      }
    } catch {
      setError('Connexion impossible. Vérifiez votre réseau puis réessayez.')
      setLoading(false)
    }
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-4" aria-busy>
        <div className="h-8 w-2/3 rounded skeleton" />
        <div className="h-40 rounded-card skeleton" />
        <div className="h-40 rounded-card skeleton" />
      </div>
    )
  }

  const sectionClass = 'bg-surface rounded-card border border-line p-4 sm:p-6 space-y-4'
  const labelClass = 'block text-[15px] font-semibold text-ink mb-1.5'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 sm:py-10">
      <header className="mb-5 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-ink">Publier une annonce</h1>
        <p className="mt-1 text-ink-muted">Gratuit. Les intéressés vous contacteront sur WhatsApp.</p>
      </header>

      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* 1. Catégorie */}
        <fieldset className={sectionClass}>
          <legend className="sr-only">Catégorie</legend>
          <p className={labelClass} aria-hidden>
            Catégorie
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {RESOURCE_TYPES.map((cat) => {
              const isSelected = resourceType === cat.value
              return (
                <button
                  type="button"
                  key={cat.value}
                  aria-pressed={isSelected}
                  onClick={() => setResourceType(cat.value)}
                  className={`min-h-14 p-2.5 rounded-button border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                    isSelected
                      ? 'border-primary bg-primary-soft ring-1 ring-primary'
                      : 'border-line hover:bg-surface-secondary'
                  }`}
                >
                  <Image src={categoryIcon(cat.value)} alt="" width={32} height={32} className="shrink-0" />
                  <span className={`text-sm leading-tight ${isSelected ? 'font-semibold text-primary-dark' : 'font-medium text-ink'}`}>
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* 2. L'échange */}
        <div className={sectionClass}>
          <div>
            <label htmlFor="offered" className={labelClass}>
              Ce que vous proposez
            </label>
            <input
              id="offered"
              type="text"
              placeholder="Ex. : 100 kg de maïs certifié"
              value={offeredResource}
              onChange={(e) => setOfferedResource(e.target.value)}
              onBlur={touch('offered')}
              aria-invalid={!!showError('offered')}
              aria-describedby="offered-error"
              className={inputClass(!!showError('offered'))}
            />
            <FieldError id="offered-error" message={showError('offered')} />
          </div>
          <div>
            <label htmlFor="wanted" className={labelClass}>
              Ce que vous voulez en échange
            </label>
            <input
              id="wanted"
              type="text"
              placeholder="Ex. : 80 kg de mil Souna"
              value={wantedResource}
              onChange={(e) => setWantedResource(e.target.value)}
              onBlur={touch('wanted')}
              aria-invalid={!!showError('wanted')}
              aria-describedby="wanted-error"
              className={inputClass(!!showError('wanted'))}
            />
            <FieldError id="wanted-error" message={showError('wanted')} />
          </div>
        </div>

        {/* 3. Photos */}
        <div className={sectionClass}>
          <div>
            <p className={labelClass}>
              Photos <span className="font-normal text-ink-subtle">(conseillé)</span>
            </p>
            <p className="text-sm text-ink-muted -mt-1">Une annonce avec photo reçoit beaucoup plus de contacts.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {images.map((url, idx) => (
              <div key={url + idx} className="relative aspect-square rounded-button overflow-hidden bg-surface-secondary">
                <img src={url} alt={`Photo ${idx + 1}`} className="w-full h-full object-cover" />
                {idx === 0 && (
                  <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                    Principale
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setImages((prev) => prev.filter((_, i) => i !== idx))}
                  aria-label={`Retirer la photo ${idx + 1}`}
                  className="absolute top-1 right-1 w-8 h-8 flex items-center justify-center bg-black/60 hover:bg-black text-white rounded-full cursor-pointer"
                >
                  <X className="w-4 h-4" aria-hidden />
                </button>
              </div>
            ))}

            {images.length < MAX_LISTING_PHOTOS && (
              <label
                className={`aspect-square rounded-button border-2 border-dashed flex flex-col items-center justify-center gap-1 text-center transition-colors ${
                  uploadingImage
                    ? 'border-line bg-surface-secondary cursor-wait'
                    : 'border-primary/40 bg-primary-soft/50 hover:bg-primary-soft cursor-pointer'
                } ${images.length === 0 ? 'col-span-3 sm:col-span-4 aspect-auto h-36' : ''}`}
              >
                {uploadingImage ? (
                  <Loader2 className="w-7 h-7 text-primary animate-spin" aria-hidden />
                ) : (
                  <Camera className="w-7 h-7 text-primary" aria-hidden />
                )}
                <span className="text-sm font-semibold text-primary px-2">
                  {uploadingImage ? 'Envoi en cours…' : images.length === 0 ? 'Ajouter des photos' : 'Ajouter'}
                </span>
                {images.length === 0 && !uploadingImage && (
                  <span className="text-xs text-ink-subtle">
                    Jusqu&apos;à {MAX_LISTING_PHOTOS} photos · {megabytes(MAX_PHOTO_BYTES)} Mo max
                  </span>
                )}
                <input
                  type="file"
                  accept={IMAGE_ACCEPT}
                  multiple
                  onChange={handleFiles}
                  disabled={uploadingImage}
                  className="sr-only"
                />
              </label>
            )}
          </div>

          {uploadError && <FieldError id="upload-error" message={uploadError} />}

          {images.length < MAX_LISTING_PHOTOS &&
            (showUrlInput ? (
              <div className="flex gap-2">
                <input
                  type="url"
                  inputMode="url"
                  placeholder="https://…"
                  value={urlDraft}
                  onChange={(e) => setUrlDraft(e.target.value)}
                  className={inputClass()}
                  aria-label="Lien de la photo"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="h-12 px-4 rounded-button bg-surface-secondary hover:bg-line font-semibold text-ink cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowUrlInput(true)}
                className="inline-flex items-center gap-1.5 h-9 text-sm font-medium text-ink-muted hover:text-ink cursor-pointer"
              >
                <LinkIcon className="w-4 h-4" aria-hidden />
                Utiliser un lien vers une photo
              </button>
            ))}
          <p className="sr-only">Formats acceptés : {IMAGE_FORMATS_LABEL}</p>
        </div>

        {/* 4. Lieu */}
        <div className={sectionClass}>
          <div>
            <label htmlFor="region" className={labelClass}>
              Région
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => {
                setRegion(e.target.value)
                setTouched((t) => ({ ...t, region: true }))
              }}
              onBlur={touch('region')}
              aria-invalid={!!showError('region')}
              aria-describedby="region-error"
              className={`${inputClass(!!showError('region'))} cursor-pointer ${region ? '' : 'text-ink-subtle'}`}
            >
              <option value="" disabled>
                Choisissez votre région
              </option>
              {SENEGAL_REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
            <FieldError id="region-error" message={showError('region')} />
          </div>
          <div>
            <label htmlFor="place" className={labelClass}>
              Commune ou village <span className="font-normal text-ink-subtle">(facultatif)</span>
            </label>
            <input
              id="place"
              type="text"
              placeholder="Ex. : Nioro du Rip"
              value={place}
              onChange={(e) => setPlace(e.target.value)}
              className={inputClass()}
            />
          </div>
        </div>

        {/* 5. Précisions — repliées pour ne pas alourdir */}
        <div className="bg-surface rounded-card border border-line">
          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            aria-expanded={showDetails}
            className="w-full flex items-center justify-between gap-3 p-4 sm:px-6 text-left cursor-pointer"
          >
            <span>
              <span className="block text-[15px] font-semibold text-ink">Ajouter des précisions</span>
              <span className="block text-sm text-ink-muted">Titre, description, complément d&apos;argent… (facultatif)</span>
            </span>
            <ChevronDown className={`w-5 h-5 text-ink-subtle shrink-0 transition-transform ${showDetails ? 'rotate-180' : ''}`} aria-hidden />
          </button>

          {showDetails && (
            <div className="px-4 pb-4 sm:px-6 sm:pb-6 space-y-4 animate-fade-up">
              <div>
                <label htmlFor="title" className={labelClass}>
                  Titre de l&apos;annonce
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder={autoTitle || 'Ex. : Maïs certifié contre mil Souna'}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={touch('title')}
                  aria-invalid={!!showError('title')}
                  aria-describedby="title-hint title-error"
                  className={inputClass(!!showError('title'))}
                />
                <p id="title-hint" className="mt-1.5 text-sm text-ink-subtle">
                  Laissez vide pour utiliser le titre proposé.
                </p>
                <FieldError id="title-error" message={showError('title')} />
              </div>

              <div>
                <p className={labelClass}>Complément</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {COMPLEMENT_TYPES.map((comp) => (
                    <button
                      type="button"
                      key={comp.value}
                      aria-pressed={complementType === comp.value}
                      onClick={() => setComplementType(comp.value)}
                      className={`min-h-12 px-3 py-2 rounded-button border text-left flex items-center gap-2 text-sm transition-colors cursor-pointer ${
                        complementType === comp.value
                          ? 'border-primary bg-primary-soft ring-1 ring-primary font-semibold text-primary-dark'
                          : 'border-line hover:bg-surface-secondary text-ink'
                      }`}
                    >
                      <span aria-hidden>{comp.icon}</span>
                      {comp.label}
                    </button>
                  ))}
                </div>
                {complementType !== 'none' && (
                  <input
                    type="text"
                    aria-label="Précisez le complément"
                    placeholder={complementType === 'money' ? 'Ex. : 20 000 FCFA pour le transport' : 'Ex. : 2 sacs de compost'}
                    value={complementDesc}
                    onChange={(e) => setComplementDesc(e.target.value)}
                    className={`${inputClass()} mt-2`}
                  />
                )}
              </div>

              <div>
                <label htmlFor="description" className={labelClass}>
                  Description
                </label>
                <textarea
                  id="description"
                  rows={4}
                  placeholder="Qualité, état du matériel, conditions de transport ou de rencontre…"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-4 bg-surface border border-line rounded-button text-base text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div role="alert" className="p-4 rounded-card bg-red-50 border border-red-200 text-error text-sm font-medium flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0" aria-hidden />
            <span>{error}</span>
          </div>
        )}

        {/* Aperçu discret du résultat, puis action principale */}
        <div className="sticky bottom-0 -mx-4 sm:mx-0 px-4 sm:px-0 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] bg-gradient-to-t from-background via-background to-background/0">
          {finalTitle && (
            <p className="text-sm text-ink-muted mb-2 truncate">
              Titre : <span className="font-medium text-ink">{finalTitle}</span>
            </p>
          )}
          <button
            type="submit"
            disabled={loading || uploadingImage}
            className="w-full h-14 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold rounded-button text-base transition-colors flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer disabled:cursor-wait"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                Publication…
              </>
            ) : uploadingImage ? (
              'Envoi de la photo…'
            ) : (
              'Publier mon annonce'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
