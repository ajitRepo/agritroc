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
} from 'lucide-react'
import { SENEGAL_REGIONS } from '@/lib/constants'

export default function ProfilPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading, refreshUser } = useAuth()

  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [address, setAddress] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
              <span>Vérifié WhatsApp</span>
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

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Photo de profil (URL d'image)
            </label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/..."
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
            />
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
