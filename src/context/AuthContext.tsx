'use client'

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface User {
  id: string
  phone: string
  fullName?: string | null
  full_name?: string | null
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
  isAuthenticated: boolean
  sendOtp: (phone: string) => Promise<{ success: boolean; message?: string; error?: string }>
  verifyOtp: (phone: string, code: string, fullName?: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/auth/me', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
      if (res.ok) {
        const data = await res.json()
        setUser(data)
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
          setUser(data)
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
        return { success: false, error: data.error || 'Erreur lors de l\'envoi du code' }
      }
      return { success: true, message: data.message }
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
      if (!res.ok) {
        return { success: false, error: data.error || 'Code invalide ou expiré' }
      }

      if (data.token) {
        localStorage.setItem('agri_token', data.token)
        setToken(data.token)
      }
      if (data.user) {
        setUser(data.user)
      }

      return { success: true }
    } catch {
      return { success: false, error: 'Erreur de connexion au serveur' }
    }
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
        isAuthenticated: !!user,
        sendOtp,
        verifyOtp,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
