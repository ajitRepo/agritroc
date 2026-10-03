'use client'

import React, { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/components/Toast'
import Image from 'next/image'
import { Phone, KeyRound, ArrowLeft, RefreshCw, MessageSquare, Check, User as UserIcon, Shield, Upload, Camera } from 'lucide-react'
import { AVATAR_PRESETS } from '@/lib/avatars'

const OTP_LENGTH = 6
const RESEND_COOLDOWN = 60

export default function ConnexionPage() {
  const router = useRouter()
  const { sendOtp, login, updateProfile, isAuthenticated } = useAuth()
  const { showToast } = useToast()

  const [step, setStep] = useState<'phone' | 'otp' | 'nom'>('phone')
  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''))
  const [fullName, setFullName] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)

  const otpRefs = useRef<(HTMLInputElement | null)[]>([])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadingAvatar(true)
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
        showToast('Photo importée !')
      } else {
        showToast(data.error || 'Erreur lors du téléversement', 'error')
      }
    } catch {
      showToast('Erreur de connexion lors du téléversement', 'error')
    } finally {
      setUploadingAvatar(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // If already authenticated, redirect
  useEffect(() => {
    if (isAuthenticated && step !== 'nom') {
      router.push('/offres')
    }
  }, [isAuthenticated, step, router])

  // Countdown timer for OTP resend
  useEffect(() => {
    if (resendTimer <= 0) return
    const timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000)
    return () => clearTimeout(timer)
  }, [resendTimer])

  // Auto focus first OTP input when entering OTP step
  useEffect(() => {
    if (step === 'otp') {
      setTimeout(() => otpRefs.current[0]?.focus(), 100)
    }
  }, [step])

  const formatPhoneInput = (value: string) => {
    const digits = value.replace(/\D/g, '')
    if (!digits.startsWith('221')) {
      return '+221' + digits.slice(0, 9)
    }
    return '+' + digits.slice(0, 12)
  }

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const formatted = formatPhoneInput(phone)
    if (formatted.length < 12) {
      showToast('Entrez un numéro sénégalais valide (+221 7X XXX XX XX)', 'error')
      return
    }

    setLoading(true)
    try {
      const result = await sendOtp(formatted)
      if (result.success) {
        setPhone(formatted)
        setStep('otp')
        setResendTimer(RESEND_COOLDOWN)
        showToast(result.message || 'Code envoyé via WhatsApp !')
      } else {
        showToast(result.error || "Erreur lors de l'envoi du code", 'error')
      }
    } catch {
      showToast('Erreur réseau, veuillez réessayer', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    if (resendTimer > 0 || loading) return
    setLoading(true)
    try {
      const result = await sendOtp(phone)
      if (result.success) {
        setOtp(Array(OTP_LENGTH).fill(''))
        setResendTimer(RESEND_COOLDOWN)
        showToast(result.message || 'Nouveau code envoyé via WhatsApp !')
        otpRefs.current[0]?.focus()
      } else {
        showToast(result.error || 'Erreur lors du renvoi', 'error')
      }
    } catch {
      showToast('Erreur réseau', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleBackToPhone = () => {
    setStep('phone')
    setOtp(Array(OTP_LENGTH).fill(''))
    setResendTimer(0)
  }

  const handleOtpInput = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...otp]
    next[index] = digit
    setOtp(next)

    if (digit && index < OTP_LENGTH - 1) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH)
    if (pasted.length > 0) {
      const next = Array(OTP_LENGTH).fill('')
      for (let i = 0; i < pasted.length; i++) {
        next[i] = pasted[i]
      }
      setOtp(next)
      const focusIndex = Math.min(pasted.length, OTP_LENGTH - 1)
      otpRefs.current[focusIndex]?.focus()
    }
  }

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const code = otp.join('')
    if (code.length !== OTP_LENGTH) {
      showToast(`Entrez le code à ${OTP_LENGTH} chiffres`, 'error')
      return
    }

    setLoading(true)
    try {
      const result = await login(phone, code)
      if (!result.success) {
        showToast(result.error || 'Code incorrect ou expiré', 'error')
        return
      }

      const currentName = result.user?.fullName || result.user?.full_name || result.user?.firstName
      if (!currentName || currentName.trim() === '') {
        setStep('nom')
        return
      }

      showToast(`Bonjour ${currentName} !`)
      router.push('/offres')
    } catch {
      showToast('Erreur réseau lors de la vérification', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveName = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const nom = fullName.trim()
    if (nom.length < 2) {
      showToast('Entrez votre nom ou exploitation pour continuer', 'error')
      return
    }

    setLoading(true)
    try {
      await updateProfile({
        fullName: nom,
        full_name: nom,
        ...(avatarUrl ? { avatarUrl, avatar_url: avatarUrl } : {}),
      })
      showToast(`Bienvenue ${nom} !`)
      router.push('/offres')
    } catch {
      showToast("Impossible d'enregistrer votre nom. Réessayez.", 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-100 shadow-2xl p-7 sm:p-9 text-center relative space-y-6">
        {/* STEP 1: PHONE */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-md overflow-hidden">
                <Image src="/logo-icon.png" alt="AgriTroc" width={64} height={64} />
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                Connexion WhatsApp
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto leading-relaxed">
                Entrez votre numéro sénégalais pour recevoir un code d'authentification par WhatsApp.
              </p>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Numéro WhatsApp
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center pointer-events-none text-emerald-600">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+221 7X XXX XX XX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-lg font-bold text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition"
                  autoFocus
                />
              </div>
              <p className="text-[11px] text-slate-400 text-center">
                Orange (77, 78), Free (76), Expresso (70), Promobile (75)
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <MessageSquare className="w-4 h-4" />
                  <span>Recevoir le code WhatsApp</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <KeyRound className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-slate-900">
                Code de vérification
              </h1>
              <p className="text-xs sm:text-sm text-slate-500">
                Entrez le code envoyé au <strong className="text-slate-900">{phone}</strong>
              </p>

              <div>
                <button
                  type="button"
                  onClick={handleBackToPhone}
                  className="text-emerald-700 hover:text-emerald-800 text-xs font-bold hover:underline inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>Modifier le numéro</span>
                </button>
              </div>
            </div>

            {/* 6 Individual OTP Inputs */}
            <div className="flex gap-2 justify-center my-4" onPaste={handleOtpPaste}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    otpRefs.current[i] = el
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpInput(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(i, e)}
                  className="w-11 h-13 sm:w-12 sm:h-14 bg-slate-50 border-2 border-slate-200 rounded-xl text-center text-xl sm:text-2xl font-black text-slate-900 outline-none focus:border-emerald-600 focus:bg-white transition"
                />
              ))}
            </div>

            <p className="text-slate-400 text-[11px]">
              Code valable pendant 10 minutes
            </p>

            <button
              type="submit"
              disabled={loading || otp.join('').length < OTP_LENGTH}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Valider le code</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || loading}
              className={`w-full border border-slate-200 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 ${
                resendTimer > 0
                  ? 'text-slate-400 bg-slate-50 cursor-not-allowed'
                  : 'text-slate-700 hover:border-emerald-600 hover:text-emerald-700 bg-white'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>
                {resendTimer > 0 ? `Renvoyer le code (${resendTimer}s)` : 'Renvoyer le code par WhatsApp'}
              </span>
            </button>
          </form>
        )}

        {/* STEP 3: NAME & AVATAR ONBOARDING */}
        {step === 'nom' && (
          <form onSubmit={handleSaveName} className="space-y-5">
            <div className="space-y-2">
              {/* Optional Avatar Picker */}
              <div className="relative mx-auto w-20 h-20">
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
                  className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-800 flex items-center justify-center font-black text-2xl overflow-hidden border-2 border-emerald-300 shadow-sm relative group hover:border-emerald-500 transition"
                  title="Ajouter une photo de profil (optionnel)"
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="w-9 h-9 text-emerald-700" />
                  )}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                    <Camera className="w-5 h-5 text-white" />
                  </div>
                  {uploadingAvatar && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-700 hover:bg-emerald-800 text-white rounded-full flex items-center justify-center shadow-md transition"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Sous quel nom vous connaît-on ?
              </h1>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Votre prénom ou exploitation. Vous pouvez aussi choisir une photo ou un avatar ci-dessous (optionnel).
              </p>

              {/* Quick preset avatars */}
              <div className="pt-2">
                <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1">
                  {AVATAR_PRESETS.slice(0, 6).map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      className={`p-1 rounded-xl border-2 transition ${
                        avatarUrl === preset.url
                          ? 'border-emerald-600 bg-emerald-50 scale-105'
                          : 'border-transparent hover:border-slate-200'
                      }`}
                      title={preset.label}
                    >
                      <img src={preset.url} alt={preset.label} className="w-8 h-8 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="ex: Amadou Diallo ou GIE Terroir Bio"
                maxLength={60}
                autoFocus
                className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl py-3 px-4 text-slate-900 text-center text-sm font-bold outline-none focus:border-emerald-600 focus:bg-white transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading || fullName.trim().length < 2}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <span>Continuer et démarrer</span>
              )}
            </button>
          </form>
        )}

        {/* Security badge */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
          <Shield className="w-4 h-4 text-emerald-600" />
          <span>Sécurisé sans mot de passe via WhatsApp</span>
        </div>
      </div>
    </div>
  )
}
