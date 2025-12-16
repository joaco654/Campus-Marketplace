'use client'

import { useState, useRef, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Send, User, MessageSquare } from 'lucide-react'
import { useNotifications } from '../../components/notifications/NotificationContext'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  sender: {
    name: string
    email: string
  }
}

interface Conversation {
  otherUserId: string
  otherUserName: string
  otherUserImage: string | null
  lastMessage: string
  lastMessageTime: string
  unreadCount: number
  serviceTitle?: string
}

function MessagesPageContent() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { sendNotification } = useNotifications()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [previousUnreadCount, setPreviousUnreadCount] = useState(0)
  const [conversationLoading, setConversationLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Debug session data
  console.log('MessagesPage render - Session status:', status)
  console.log('MessagesPage render - Session data:', session)

  const serviceId = searchParams?.get('serviceId')
  const userId = searchParams?.get('userId')

  // Debug logging
  console.log('Messages page - URL params:', { serviceId, userId, status })

  // Redirect if not authenticated
  useEffect(() => {
    console.log('Messages page auth status:', status)
    if (status === 'unauthenticated') {
      console.log('User not authenticated, redirecting to signin')
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      console.log('User authenticated:', session?.user)
      // Verify session has user ID
      if (!session?.user?.id) {
        console.warn('Session missing user ID, this might cause messaging issues')
        // Force session refresh
        window.location.reload()
      }
    }
  }, [status, router, session])

  // Load conversations and handle URL parameters
  useEffect(() => {
    if (status === 'authenticated') {
      console.log('Messages page: User authenticated, session data:', session?.user)
      fetchConversations()

      // Handle URL parameters for starting new conversations
      console.log('Checking URL params for conversation:', { userId, serviceId })
      if (userId && serviceId) {
        console.log('Starting conversation with:', { serviceId, userId })
        handleStartConversation(serviceId, userId)
      }
    } else {
      console.log('Messages page: User not authenticated, status:', status)
    }
  }, [status, userId, serviceId, session])

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation)
    }
  }, [selectedConversation])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  const fetchConversations = async () => {
    try {
      const response = await fetch('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        const newConversations = data.conversations || []
        setConversations(newConversations)

        // Check for new unread messages and send notification
        const totalUnread = newConversations.reduce((sum: number, conv: Conversation) => sum + (conv.unreadCount || 0), 0)

        if (totalUnread > previousUnreadCount && previousUnreadCount > 0) {
          // Find the conversation with new messages
          const newMessageConversation = newConversations.find((conv: Conversation) =>
            conv.unreadCount > 0 && conv.lastMessage
          )

          if (newMessageConversation) {
            sendNotification({
              title: 'New Message',
              body: `${newMessageConversation.otherUserName}: ${newMessageConversation.lastMessage}`,
              url: '/marketplace/messages',
              type: 'message'
            })
          }
        }

        setPreviousUnreadCount(totalUnread)
        setLoading(false)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
      setLoading(false)
    }
  }

  const fetchMessages = async (otherUserId: string) => {
    try {
      const response = await fetch(`/api/messages?userId=${otherUserId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const handleStartConversation = async (serviceId: string, otherUserId: string) => {
    console.log('handleStartConversation called with:', { serviceId, otherUserId })
    setConversationLoading(true)
    setSelectedConversation(otherUserId)
    console.log('Selected conversation set to:', otherUserId)

    // Check current user session
    console.log('Current session:', session)

    // Add to conversations list if not already there
    try {
      const response = await fetch(`/api/user/me?userId=${otherUserId}`)
      console.log('User API response status:', response.status)

      if (response.ok) {
        const userData = await response.json()
        console.log('User data received:', userData)

        if (!userData || !userData.name) {
          console.error('Invalid user data received:', userData)
          return
        }

        const newConversation: Conversation = {
          otherUserId,
          otherUserName: userData.name || 'Unknown User',
          otherUserImage: userData.image || null,
          lastMessage: '',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          serviceTitle: serviceId ? 'Service Inquiry' : undefined
        }

        setConversations(prev => {
          const exists = prev.find(c => c.otherUserId === otherUserId)
          if (!exists) {
            console.log('Adding new conversation to list')
            return [newConversation, ...prev]
          }
          console.log('Conversation already exists, updating selection')
          return prev
        })

        // Ensure the conversation is immediately available
        const updatedConversations = conversations.find(c => c.otherUserId === otherUserId)
          ? conversations
          : [newConversation, ...conversations]

        // Set current conversation directly for immediate access
        const currentConv = updatedConversations.find(c => c.otherUserId === otherUserId)
        if (currentConv) {
          console.log('Conversation ready for messaging:', currentConv.otherUserName)
        }
        console.log('Conversation added/updated successfully')
      } else {
        const errorText = await response.text()
        console.error('Failed to fetch user data:', response.status, errorText)
        alert(`Failed to load user information. Please try again. Error: ${response.status}`)
      }
    } catch (error) {
      console.error('Error starting conversation:', error)
      alert('Failed to start conversation. Please check your connection and try again.')
    } finally {
      setConversationLoading(false)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedConversation) return

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          receiverId: selectedConversation,
          content: newMessage.trim(),
          serviceId: serviceId || undefined,
        }),
      })

      if (response.ok) {
        const messageData = await response.json()
        setMessages(prev => [...prev, messageData])
        setNewMessage('')
        fetchConversations() // Update conversation list
      } else {
        console.error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const currentConversation = conversations.find(c => c.otherUserId === selectedConversation)

  console.log('Render state:', {
    selectedConversation,
    conversationsCount: conversations.length,
    currentConversation: !!currentConversation,
    status,
    loading
  })

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/marketplace"
            className="inline-flex items-center text-primary-600 hover:text-primary-700"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Marketplace
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Conversations Sidebar */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Conversations</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <p className="text-sm">No conversations yet</p>
                  <p className="text-xs mt-1">Click "Message" on service listings to start chatting</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <button
                    key={conversation.otherUserId}
                    onClick={() => setSelectedConversation(conversation.otherUserId)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors ${
                      selectedConversation === conversation.otherUserId
                        ? 'bg-primary-50 border-l-4 border-primary-600'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {conversation.otherUserImage ? (
                        <img
                          src={conversation.otherUserImage}
                          alt={conversation.otherUserName}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {conversation.otherUserName}
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.lastMessage || 'No messages yet'}
                        </p>
                        {conversation.serviceTitle && (
                          <p className="text-xs text-primary-600 truncate">
                            {conversation.serviceTitle}
                          </p>
                        )}
                      </div>
                      {conversation.unreadCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                          {conversation.unreadCount > 99 ? '99+' : conversation.unreadCount}
                        </span>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Messages Area */}
          <div className="md:col-span-3">
            {(selectedConversation || conversationLoading) ? (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Chat Header */}
                <div className="bg-primary-600 text-white p-4">
                  <div className="flex items-center gap-3">
                    {conversationLoading ? (
                      <>
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-600"></div>
                        </div>
                        <div>
                          <h3 className="font-semibold">Loading...</h3>
                          <p className="text-sm text-primary-100">Starting conversation</p>
                        </div>
                      </>
                    ) : currentConversation ? (
                      <>
                        {currentConversation.otherUserImage ? (
                          <img
                            src={currentConversation.otherUserImage}
                            alt={currentConversation.otherUserName}
                            className="w-10 h-10 rounded-full"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary-600" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{currentConversation.otherUserName}</h3>
                          {currentConversation.serviceTitle && (
                            <p className="text-sm text-primary-100">{currentConversation.serviceTitle}</p>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold">Starting Conversation...</h3>
                          <p className="text-sm text-primary-100">Send your first message</p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Messages Container */}
                <div className="h-[500px] flex flex-col">
                  {/* Messages - Scrollable */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {conversationLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center text-gray-500">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
                          <p className="text-lg font-medium">Loading conversation...</p>
                          <p className="text-sm">Getting things ready for you</p>
                        </div>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">
                        <p>No messages yet. Start the conversation!</p>
                      </div>
                    ) : (
                      messages.map((message) => {
                        const isSender = message.sender.email === session?.user?.email
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl shadow-sm ${
                                isSender
                                  ? 'bg-primary-600 text-white rounded-br-sm'
                                  : 'bg-gray-100 text-gray-900 rounded-bl-sm'
                              }`}
                            >
                              <p className="text-sm leading-relaxed">{message.content}</p>
                              <p
                                className={`text-xs mt-2 ${
                                  isSender ? 'text-primary-100' : 'text-gray-500'
                                }`}
                              >
                                {formatTime(new Date(message.createdAt))}
                              </p>
                            </div>
                          </div>
                        )
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area - Fixed at Bottom */}
                  <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-3">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type your message..."
                          className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-gray-50"
                          disabled={!selectedConversation}
                        />
                        {newMessage.trim() && selectedConversation && (
                          <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      {newMessage.trim() && (
                        <button
                          type="button"
                          onClick={() => setNewMessage('')}
                          className="text-gray-400 hover:text-gray-600 px-3 py-2"
                        >
                          ✕
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="h-[500px] flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <MessageSquare className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">Select a Conversation</h3>
                    <p className="text-sm">Choose a conversation from the sidebar to start messaging</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    }>
      <MessagesPageContent />
    </Suspense>
  )
}