'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import { ArrowLeft, Camera, Loader2, ShieldCheck, AlertCircle } from 'lucide-react'
import { AVATAR_PRESETS } from '@/lib/avatars'
import { IMAGE_ACCEPT } from '@/lib/constants'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

// 9 chiffres locaux, mobiles sénégalais : 70, 75, 76, 77, 78
const LOCAL_MOBILE = /^7[05678]\d{7}$/

/** Garde uniquement les 9 chiffres locaux, même si l'utilisateur colle "+221 77…" ou "00221…" */
function toLocalDigits(value: string): string {
  let digits = value.replace(/\D/g, '')
  if (digits.startsWith('00221')) digits = digits.slice(5)
  else if (digits.startsWith('221') && digits.length > 9) digits = digits.slice(3)
  return digits.slice(0, 9)
}

/** "771234567" → "77 123 45 67" */
function formatLocal(digits: string): string {
  return [digits.slice(0, 2), digits.slice(2, 5), digits.slice(5, 7), digits.slice(7, 9)].filter(Boolean).join(' ')
}

function InlineError({ message }: { message: string | null }) {
  if (!message) return null
  return (
    <p role="alert" className="mt-2 flex items-start gap-1.5 text-sm text-error text-left">
      <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" aria-hidden />
      {message}
    </p>
  )
}

const primaryButton =
  'w-full h-12 bg-primary hover:bg-primary-dark disabled:opacity-60 text-white font-semibold rounded-button text-base transition-colors flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer disabled:cursor-default'

/**
 * Connexion sans mot de passe en 3 étapes : numéro → code WhatsApp → nom (première fois seulement).
 * Partagé par la page /connexion et la fenêtre de connexion.
 */
export default function LoginFlow({ onDone }: { onDone: () => void }) {
  const { sendOtp, login, updateProfile } = useAuth()
  const { showToast } = useToast()

  const [step, setStep] = useState<'phone' | 'otp' | 'nom'>('phone')
  const [digits, setDigits] = useState('')
  const [code, setCode] = useState('')
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resendTimer, setResendTimer] = useState(0)

  const codeRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fullPhone = `+221${digits}`

  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendTimer])

  const goTo = (next: typeof step) => {
    setError(null)
    setStep(next)
  }

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!LOCAL_MOBILE.test(digits)) {
      setError('Entrez un numéro mobile à 9 chiffres commençant par 7 (ex. : 77 123 45 67).')
      return
    }
    setError(null)
    setLoading(true)
    const result = await sendOtp(fullPhone)
    setLoading(false)
    if (result.success) {
      setCode('')
      setResendTimer(RESEND_COOLDOWN)
      goTo('otp')
    } else {
      setError(result.error || "Le code n'a pas pu être envoyé. Réessayez dans un instant.")
    }
  }

  const handleResend = async () => {
    if (resendTimer > 0 || loading) return
    setLoading(true)
    const result = await sendOtp(fullPhone)
    setLoading(false)
    if (result.success) {
      setCode('')
      setError(null)
      setResendTimer(RESEND_COOLDOWN)
      showToast('Nouveau code envoyé sur WhatsApp')
      codeRef.current?.focus()
    } else {
      setError(result.error || "Le code n'a pas pu être renvoyé.")
    }
  }

  const verify = async (value: string) => {
    if (value.length !== OTP_LENGTH) {
      setError(`Le code contient ${OTP_LENGTH} chiffres.`)
      return
    }
    setError(null)
    setLoading(true)
    const result = await login(fullPhone, value)
    setLoading(false)
    if (!result.success) {
      setError(result.error || 'Code incorrect ou expiré. Vérifiez-le ou demandez-en un nouveau.')
      setCode('')
      codeRef.current?.focus()
      return
    }
    const currentName = result.user?.fullName || result.user?.full_name
    if (!currentName?.trim()) {
      goTo('nom')
      return
    }
    showToast(`Bonjour ${currentName} !`)
    onDone()
  }

  const handleCodeChange = (value: string) => {
    const next = value.replace(/\D/g, '').slice(0, OTP_LENGTH)
    setCode(next)
    if (error) setError(null)
    // Validation automatique dès que le code est complet : une action de moins
    if (next.length === OTP_LENGTH && !loading) verify(next)
  }

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
      if (res.ok && data.url) setAvatarUrl(data.url)
      else showToast(data.error || "La photo n'a pas pu être envoyée.", 'error')
    } catch {
      showToast('Connexion impossible. Réessayez.', 'error')
    } finally {
      setUploadingAvatar(false)
    }
  }

  const handleSaveName = async (e: React.FormEvent) => {
    e.preventDefault()
    const nom = fullName.trim()
    if (nom.length < 2) {
      setError('Indiquez votre nom ou celui de votre exploitation.')
      return
    }
    setError(null)
    setLoading(true)
    try {
      await updateProfile({
        fullName: nom,
        full_name: nom,
        ...(avatarUrl ? { avatarUrl, avatar_url: avatarUrl } : {}),
      })
      showToast(`Bienvenue ${nom} !`)
      onDone()
    } catch {
      setError("Votre nom n'a pas pu être enregistré. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Indicateur d'étape : l'utilisateur sait où il en est */}
      <div className="flex gap-1.5" aria-hidden>
        {['phone', 'otp', 'nom'].map((s, i) => (
          <span
            key={s}
            className={`h-1 flex-1 rounded-full transition-colors ${
              ['phone', 'otp', 'nom'].indexOf(step) >= i ? 'bg-primary' : 'bg-line'
            }`}
          />
        ))}
      </div>

      {step === 'phone' && (
        <form onSubmit={handleSendOtp} noValidate className="space-y-5 animate-fade-up">
          <div className="space-y-1.5">
            <Image src="/logo-icon.png" alt="" width={48} height={48} className="rounded-button" />
            <h1 className="text-2xl font-bold text-ink pt-2">Connexion</h1>
            <p className="text-ink-muted">
              Entrez votre numéro. Nous vous envoyons un code sur WhatsApp, sans mot de passe.
            </p>
          </div>

          <div>
            <label htmlFor="login-phone" className="block text-[15px] font-semibold text-ink mb-1.5">
              Numéro de téléphone
            </label>
            <div
              className={`flex items-center h-14 rounded-button border bg-surface focus-within:ring-2 transition ${
                error ? 'border-error focus-within:ring-error/40' : 'border-line focus-within:ring-primary focus-within:border-transparent'
              }`}
            >
              <span className="pl-4 pr-3 h-full flex items-center gap-1.5 border-r border-line text-ink font-semibold shrink-0">
                <span aria-hidden>🇸🇳</span> +221
              </span>
              <input
                id="login-phone"
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                autoFocus
                placeholder="77 123 45 67"
                value={formatLocal(digits)}
                onChange={(e) => {
                  setDigits(toLocalDigits(e.target.value))
                  if (error) setError(null)
                }}
                aria-invalid={!!error}
                className="flex-1 min-w-0 h-full px-3 bg-transparent outline-none text-lg font-semibold tracking-wide text-ink placeholder:text-ink-subtle placeholder:font-normal"
              />
            </div>
            <InlineError message={error} />
          </div>

          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : null}
            {loading ? 'Envoi du code…' : 'Recevoir mon code'}
          </button>
        </form>
      )}

      {step === 'otp' && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            verify(code)
          }}
          noValidate
          className="space-y-5 animate-fade-up"
        >
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-ink">Entrez le code</h1>
            <p className="text-ink-muted">
              Envoyé sur WhatsApp au <strong className="text-ink whitespace-nowrap">+221 {formatLocal(digits)}</strong>
            </p>
            <button
              type="button"
              onClick={() => goTo('phone')}
              className="inline-flex items-center gap-1 h-9 text-sm font-semibold text-primary hover:text-primary-dark cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden />
              Changer de numéro
            </button>
          </div>

          <div>
            <label htmlFor="login-code" className="sr-only">
              Code à {OTP_LENGTH} chiffres
            </label>
            <input
              ref={codeRef}
              id="login-code"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              autoFocus
              maxLength={OTP_LENGTH}
              placeholder={'•'.repeat(OTP_LENGTH)}
              value={code}
              onChange={(e) => handleCodeChange(e.target.value)}
              aria-invalid={!!error}
              className={`w-full h-16 rounded-button border bg-surface text-center text-3xl font-bold tracking-[0.5em] pl-[0.5em] text-ink placeholder:text-line outline-none focus:ring-2 transition ${
                error ? 'border-error focus:ring-error/40' : 'border-line focus:ring-primary focus:border-transparent'
              }`}
            />
            <InlineError message={error} />
            <p className="mt-2 text-sm text-ink-subtle">Le code est valable 10 minutes.</p>
          </div>

          <button type="submit" disabled={loading || code.length < OTP_LENGTH} className={primaryButton}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : null}
            {loading ? 'Vérification…' : 'Valider'}
          </button>

          <p className="text-center text-sm text-ink-muted">
            Pas reçu ?{' '}
            {resendTimer > 0 ? (
              <span>Nouveau code possible dans {resendTimer} s</span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                disabled={loading}
                className="font-semibold text-primary hover:text-primary-dark underline underline-offset-2 cursor-pointer"
              >
                Renvoyer le code
              </button>
            )}
          </p>
        </form>
      )}

      {step === 'nom' && (
        <form onSubmit={handleSaveName} noValidate className="space-y-5 animate-fade-up">
          <div className="space-y-1.5">
            <h1 className="text-2xl font-bold text-ink">Comment vous appelez-vous ?</h1>
            <p className="text-ink-muted">Ce nom s&apos;affichera sur vos annonces.</p>
          </div>

          <div>
            <label htmlFor="login-name" className="block text-[15px] font-semibold text-ink mb-1.5">
              Votre nom ou celui de votre exploitation
            </label>
            <input
              id="login-name"
              type="text"
              autoComplete="name"
              autoFocus
              maxLength={60}
              placeholder="Ex. : Amadou Diallo, GIE Terroir Bio"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                if (error) setError(null)
              }}
              aria-invalid={!!error}
              className={`w-full h-12 px-4 rounded-button border bg-surface text-base text-ink placeholder:text-ink-subtle outline-none focus:ring-2 transition ${
                error ? 'border-error focus:ring-error/40' : 'border-line focus:ring-primary focus:border-transparent'
              }`}
            />
            <InlineError message={error} />
          </div>

          <div>
            <p className="text-[15px] font-semibold text-ink mb-2">
              Photo <span className="font-normal text-ink-subtle">(facultatif)</span>
            </p>
            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar -mx-1 px-1 py-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                aria-label="Importer une photo"
                className="w-12 h-12 shrink-0 rounded-full border-2 border-dashed border-primary/40 bg-primary-soft text-primary flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {uploadingAvatar ? (
                  <Loader2 className="w-5 h-5 animate-spin" aria-hidden />
                ) : avatarUrl && !AVATAR_PRESETS.some((p) => p.url === avatarUrl) ? (
                  <img src={avatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Camera className="w-5 h-5" aria-hidden />
                )}
              </button>
              {AVATAR_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setAvatarUrl(avatarUrl === preset.url ? '' : preset.url)}
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
            <input ref={fileInputRef} type="file" accept={IMAGE_ACCEPT} onChange={handleAvatarUpload} className="sr-only" tabIndex={-1} />
          </div>

          <button type="submit" disabled={loading} className={primaryButton}>
            {loading ? <Loader2 className="w-5 h-5 animate-spin" aria-hidden /> : null}
            {loading ? 'Enregistrement…' : 'Continuer'}
          </button>
        </form>
      )}

      <p className="flex items-center justify-center gap-1.5 text-sm text-ink-subtle">
        <ShieldCheck className="w-4 h-4 text-primary" aria-hidden />
        Connexion sécurisée par code WhatsApp, sans mot de passe.
      </p>
    </div>
  )
}
