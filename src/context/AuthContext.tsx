'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface User {
  id: string
  phone: string
  fullName?: string | null
  full_name?: string | null
  firstName?: string | null
  city?: string | null
  address?: string | null
  avatarUrl?: string | null
  avatar_url?: string | null
  bio?: string | null
  ratingAvg?: number
  rating_avg?: number
  ratingCount?: number
  rating_count?: number
  exchangeCount?: number
  exchange_count?: number
  isAdmin?: boolean
  is_admin?: boolean
  isVerified?: boolean
  is_verified?: boolean
  activeOffersCount?: number
  active_offers_count?: number
}

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  loading: boolean
  isAuthenticated: boolean
  showLoginModal: boolean
  setShowLoginModal: (show: boolean) => void
  sendOtp: (phone: string) => Promise<{ success: boolean; message?: string; error?: string; devCode?: string }>
  login: (phone: string, code: string) => Promise<{ success: boolean; error?: string; user?: User; token?: string }>
  verifyOtp: (phone: string, code: string, fullName?: string) => Promise<{ success: boolean; error?: string; user?: User; token?: string }>
  updateProfile: (data: Partial<User>) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showLoginModal, setShowLoginModal] = useState(false)

  const normalizeUser = (userData: any): User => {
    if (!userData) return userData
    return {
      ...userData,
      fullName: userData.fullName || userData.full_name || '',
      full_name: userData.fullName || userData.full_name || '',
      firstName: userData.fullName || userData.full_name || '',
    }
  }

  const fetchUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const data = await res.json()
        setUser(normalizeUser(data))
        return true
      }
      return false
    } catch {
      return false
    }
  }, [token])

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('agri_token') : null
      if (storedToken) {
        setToken(storedToken)
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: storedToken ? { Authorization: `Bearer ${storedToken}` } : {},
        })
        if (res.ok) {
          const data = await res.json()
          setUser(normalizeUser(data))
        } else if (storedToken) {
          localStorage.removeItem('agri_token')
          setToken(null)
          setUser(null)
        }
      } catch {
        // offline or network error
      } finally {
        setIsLoading(false)
      }
    }

    initAuth()
  }, [])

  const sendOtp = async (phone: string) => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })
      const data = await res.json()
      if (!res.ok) {
        return { success: false, error: data.error || "Erreur lors de l'envoi du code" }
      }
      return { success: true, message: data.message, devCode: data.devCode }
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const login = async (phone: string, code: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Code invalide ou expiré' }
      }

      if (data.token) {
        localStorage.setItem('agri_token', data.token)
        setToken(data.token)
      }
      if (data.user) {
        const norm = normalizeUser(data.user)
        setUser(norm)
        data.user = norm
      }

      return data
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const verifyOtp = async (phone: string, code: string, fullName?: string) => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code, fullName }),
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        return { success: false, error: data.error || 'Code invalide ou expiré' }
      }

      if (data.token) {
        localStorage.setItem('agri_token', data.token)
        setToken(data.token)
      }
      if (data.user) {
        const norm = normalizeUser(data.user)
        setUser(norm)
        data.user = norm
      }

      return data
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
  }

  const updateProfile = async (data: Partial<User>) => {
    const res = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const detail = await res.json().catch(() => null)
      throw new Error(
        typeof detail?.error === 'string' ? detail.error : 'Échec de la mise à jour du profil'
      )
    }
    const result = await res.json()
    setUser(normalizeUser(result))
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch {}
    localStorage.removeItem('agri_token')
    setToken(null)
    setUser(null)
  }

  const refreshUser = async () => {
    await fetchUser()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        loading: isLoading,
        isAuthenticated: !!user,
        showLoginModal,
        setShowLoginModal,
        sendOtp,
        login,
        verifyOtp,
        updateProfile,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
