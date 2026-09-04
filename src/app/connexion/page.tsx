'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Sprout, Phone, KeyRound, ArrowRight, CheckCircle2, Shield, User } from 'lucide-react'

export default function ConnexionPage() {
  const router = useRouter()
  const { sendOtp, verifyOtp } = useAuth()

  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [phone, setPhone] = useState('+221')
  const [fullName, setFullName] = useState('')
  const [otpCode, setOtpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await sendOtp(phone)
    setLoading(false)

    if (res.success) {
      setSuccessMsg(res.message || 'Code envoyé sur WhatsApp !')
      setStep('otp')
    } else {
      setError(res.error || 'Erreur lors de l\'envoi du code')
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await verifyOtp(phone, otpCode, fullName || undefined)
    setLoading(false)

    if (res.success) {
      router.push('/offres')
    } else {
      setError(res.error || 'Code incorrect ou expiré')
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-emerald-100 shadow-xl p-8 space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-emerald-700 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md">
            <Sprout className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">
            {step === 'phone' ? 'Connexion ou Inscription' : 'Vérification du code'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {step === 'phone'
              ? 'Connectez-vous instantanément avec votre numéro WhatsApp'
              : `Entrez le code à 6 chiffres reçu sur ${phone}`}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
            {error}
          </div>
        )}

        {successMsg && step === 'otp' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
        )}

        {step === 'phone' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Numéro de téléphone WhatsApp
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center gap-1.5 pointer-events-none text-slate-500 text-sm">
                  <Phone className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="tel"
                  required
                  placeholder="+221 77 000 00 00"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Format sénégalais : +221 77/78/76/70/75 XXX XX XX
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nom complet ou Nom de l'exploitation (facultatif)
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center text-slate-500 text-sm">
                  <User className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="text"
                  placeholder="ex: Amadou Diallo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Envoi du code en cours...</span>
              ) : (
                <>
                  <span>Recevoir le code WhatsApp</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Code à 6 chiffres
              </label>
              <div className="relative flex items-center">
                <div className="absolute left-3.5 flex items-center text-slate-500">
                  <KeyRound className="w-4 h-4 text-emerald-600" />
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  autoFocus
                  placeholder="123456"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl font-mono tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white transition"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otpCode.length < 6}
              className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? <span>Vérification...</span> : <span>Valider et me connecter</span>}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-xs text-emerald-700 hover:underline font-semibold"
              >
                Changer de numéro de téléphone
              </button>
            </div>
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
