'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  MessageSquare,
  Send,
  User,
  Phone,
  ExternalLink,
  CheckCheck,
  Clock,
  ArrowLeft,
} from 'lucide-react'
import Link from 'next/link'

export default function MessagesPage() {
  const router = useRouter()
  const { user, isAuthenticated, isLoading } = useAuth()

  const [conversations, setConversations] = useState<any[]>([])
  const [activeConvId, setActiveConvId] = useState<string | null>(null)
  const [activeConv, setActiveConv] = useState<any | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [sending, setSending] = useState(false)

  // Fetch all conversations
  const loadConversations = async () => {
    try {
      const res = await fetch('/api/messages/conversations', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setConversations(data)
        if (data.length > 0 && !activeConvId) {
          setActiveConvId(data[0].id)
        }
      }
    } catch (err) {
      console.error('Erreur conversations:', err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch messages for active conversation
  const loadMessages = async (convId: string) => {
    setLoadingMsgs(true)
    try {
      const res = await fetch(`/api/messages/conversations/${convId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
      })
      if (res.ok) {
        const data = await res.json()
        setActiveConv(data)
        setMessages(data.messages || [])
      }
    } catch (err) {
      console.error('Erreur messages:', err)
    } finally {
      setLoadingMsgs(false)
    }
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/connexion')
      return
    }
    if (isAuthenticated) {
      loadConversations()
    }
  }, [isLoading, isAuthenticated, router])

  useEffect(() => {
    if (activeConvId) {
      loadMessages(activeConvId)
    }
  }, [activeConvId])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConvId) return

    setSending(true)
    try {
      const res = await fetch(`/api/messages/conversations/${activeConvId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('agri_token') || ''}`,
        },
        body: JSON.stringify({ content: newMessage }),
      })

      if (res.ok) {
        const sent = await res.json()
        setMessages((prev) => [...prev, sent])
        setNewMessage('')
        loadConversations()
      }
    } catch (err) {
      console.error('Erreur envoi:', err)
    } finally {
      setSending(false)
    }
  }

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Chargement des discussions...</div>
  }

  const otherUser = activeConv?.other_user || activeConv?.otherUser
  const cleanPhone = (otherUser?.phone || '').replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${cleanPhone}`

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden h-[78vh] flex flex-col md:flex-row">
        {/* Left column: Conversation list */}
        <div
          className={`w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col ${
            activeConvId ? 'hidden md:flex' : 'flex'
          }`}
        >
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-700" />
              <span>Discussions</span>
            </h2>
            <span className="text-xs px-2.5 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-full">
              {conversations.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-6 text-center text-xs text-slate-400">Chargement...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center space-y-2">
                <span className="text-3xl">💬</span>
                <p className="text-xs font-semibold text-slate-700">Aucune discussion ouverte</p>
                <p className="text-[11px] text-slate-400">
                  Consultez une offre et contactez le propriétaire pour démarrer un échange.
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = conv.id === activeConvId
                const other = conv.other_user || conv.otherUser
                return (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full p-4 text-left transition flex items-start gap-3 hover:bg-slate-50 ${
                      isSelected ? 'bg-emerald-50/60 border-l-4 border-emerald-600' : ''
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 overflow-hidden">
                      {other?.avatar_url || other?.avatarUrl ? (
                        <img
                          src={other.avatar_url || other.avatarUrl}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        other?.full_name?.[0] || 'A'
                      )}
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {other?.full_name || other?.phone || 'Membre'}
                        </h4>
                        {conv.unread_count > 0 && (
                          <span className="w-4 h-4 bg-emerald-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                            {conv.unread_count}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-emerald-800 truncate">
                        {conv.offer_title || conv.offerTitle || 'Offre de troc'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {conv.last_message || conv.lastMessage || 'Nouvelle conversation'}
                      </p>
                    </div>
                  </button>
                )
              })
            )}
          </div>
        </div>

        {/* Right column: Chat view */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/50 ${
            !activeConvId ? 'hidden md:flex items-center justify-center' : 'flex'
          }`}
        >
          {activeConvId ? (
            <>
              {/* Chat Header */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setActiveConvId(null)}
                    className="md:hidden p-1.5 text-slate-500 hover:text-slate-800"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm overflow-hidden">
                    {otherUser?.avatar_url || otherUser?.avatarUrl ? (
                      <img
                        src={otherUser.avatar_url || otherUser.avatarUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      otherUser?.full_name?.[0] || 'A'
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {otherUser?.full_name || otherUser?.phone || 'Interlocuteur'}
                    </h3>
                    {activeConv?.offer && (
                      <Link
                        href={`/offres/${activeConv.offer.id}`}
                        className="text-xs text-emerald-700 hover:underline flex items-center gap-1"
                      >
                        <span>{activeConv.offer.title}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>

                {/* Direct WhatsApp Callout */}
                {otherUser?.phone && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp direct</span>
                  </a>
                )}
              </div>

              {/* Message Feed */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {loadingMsgs ? (
                  <div className="text-center text-xs text-slate-400 pt-8">
                    Chargement des messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 pt-8">
                    Aucun message dans cette discussion.
                  </div>
                ) : (
                  messages.map((m) => {
                    const isMe = m.sender_id === user?.id || m.senderId === user?.id
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                      >
                        <div
                          className={`max-w-[80%] sm:max-w-[70%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                            isMe
                              ? 'bg-emerald-700 text-white rounded-br-xs shadow-xs'
                              : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
                          }`}
                        >
                          <p>{m.content}</p>
                        </div>
                        <span className="text-[10px] text-slate-400 px-1 mt-0.5">
                          {m.created_at || m.createdAt
                            ? new Date(m.created_at || m.createdAt).toLocaleTimeString('fr-FR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </span>
                      </div>
                    )
                  })
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200 flex gap-2">
                <input
                  type="text"
                  placeholder="Écrivez votre message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:bg-white"
                />
                <button
                  type="submit"
                  disabled={sending || !newMessage.trim()}
                  className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                  <span className="hidden sm:inline">Envoyer</span>
                </button>
              </form>
            </>
          ) : (
            <div className="text-center space-y-2 p-8 text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-600">Sélectionnez une discussion</p>
              <p className="text-xs">Choisissez une conversation à gauche pour afficher les messages.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
