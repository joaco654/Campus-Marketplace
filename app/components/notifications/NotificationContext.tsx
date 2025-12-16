'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface NotificationData {
  title: string
  body?: string
  message?: string
  url?: string
  type?: 'message' | 'booking' | 'item' | 'service' | 'general' | 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface NotificationContextType {
  permission: NotificationPermission
  requestPermission: () => Promise<NotificationPermission>
  sendNotification: (data: NotificationData) => void
  showBrowserNotification: (data: NotificationData) => void
  addNotification: (data: NotificationData) => void
  removeNotification: (id: string) => void
  isSupported: boolean
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}

interface NotificationProviderProps {
  children: ReactNode
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [permission, setPermission] = useState<NotificationPermission>('default')
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if notifications are supported
    if ('Notification' in window && 'serviceWorker' in navigator) {
      setIsSupported(true)
      setPermission(Notification.permission)

      // Register service worker
      registerServiceWorker()
    }
  }, [])

  const registerServiceWorker = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      })

      console.log('Service Worker registered:', registration)

      // Handle updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing
        if (newWorker) {
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New service worker available, notify user
              console.log('New service worker available')
            }
          })
        }
      })

    } catch (error) {
      console.error('Service Worker registration failed:', error)
    }
  }

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!isSupported) {
      console.warn('Notifications not supported')
      return 'denied'
    }

    try {
      const result = await Notification.requestPermission()
      setPermission(result)
      return result
    } catch (error) {
      console.error('Error requesting notification permission:', error)
      return 'denied'
    }
  }

  const showBrowserNotification = (data: NotificationData) => {
    if (permission !== 'granted') {
      console.warn('Notification permission not granted')
      return
    }

    const notification = new Notification(data.title, {
      body: data.body || data.message,
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: data.type || 'general',
      requireInteraction: true,
      data: {
        url: data.url
      }
    })

    notification.onclick = () => {
      window.focus()
      if (data.url) {
        window.location.href = data.url
      }
      notification.close()
    }

    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close()
    }, 5000)
  }

  const sendNotification = async (data: NotificationData) => {
    // Always try to show in-app notification (toast)
    showBrowserNotification(data)

    // Also try to send push notification via service worker if available
    if ('serviceWorker' in navigator && permission === 'granted') {
      try {
        const registration = await navigator.serviceWorker.ready
        await registration.showNotification(data.title, {
          body: data.body,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: data.type || 'general',
          requireInteraction: true,
          data: {
            url: data.url
          }
        })
      } catch (error) {
        console.error('Error sending push notification:', error)
      }
    }
  }

  const addNotification = (data: NotificationData) => {
    sendNotification(data)
  }

  const removeNotification = (id: string) => {
    // For now, just log - in a full implementation, this would manage a notification queue
    console.log('Remove notification:', id)
  }

  const value: NotificationContextType = {
    permission,
    requestPermission,
    sendNotification,
    showBrowserNotification,
    addNotification,
    removeNotification,
    isSupported
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}