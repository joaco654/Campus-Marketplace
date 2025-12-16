'use client'

import React, { useState, useEffect } from 'react'
import { Bell, BellOff, Settings, CheckCircle, XCircle } from 'lucide-react'
import { useNotifications } from './NotificationContext'

interface NotificationSettingsProps {
  onClose?: () => void
}

export const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const { permission, requestPermission, isSupported, sendNotification } = useNotifications()
  const [settings, setSettings] = useState({
    messages: true,
    bookings: true,
    itemOffers: true,
    serviceUpdates: true,
    general: false
  })
  const [isRequesting, setIsRequesting] = useState(false)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('notificationSettings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (error) {
        console.error('Error loading notification settings:', error)
      }
    }
  }, [])

  const saveSettings = (newSettings: typeof settings) => {
    setSettings(newSettings)
    localStorage.setItem('notificationSettings', JSON.stringify(newSettings))
  }

  const handlePermissionRequest = async () => {
    setIsRequesting(true)
    const result = await requestPermission()
    setIsRequesting(false)

    if (result === 'granted') {
      // Send a test notification
      sendNotification({
        title: 'Notifications Enabled! 🎉',
        body: 'You will now receive notifications for important updates.',
        type: 'general'
      })
    }
  }

  const testNotification = (type: keyof typeof settings) => {
    const testMessages = {
      messages: {
        title: 'New Message',
        body: 'You have a new message from a student about your tutoring services.'
      },
      bookings: {
        title: 'New Booking Request',
        body: 'Someone wants to book your Math tutoring session for tomorrow.'
      },
      itemOffers: {
        title: 'Item Offer',
        body: 'Someone is interested in buying your Calculus textbook for $45.'
      },
      serviceUpdates: {
        title: 'Service Update',
        body: 'Your tutoring session with John has been confirmed for Friday.'
      },
      general: {
        title: 'Campus Marketplace',
        body: 'This is a test notification to verify your settings.'
      }
    }

    sendNotification({
      ...testMessages[type],
      type: type as any,
      url: '/marketplace/messages'
    })
  }

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <BellOff className="w-5 h-5 text-yellow-600" />
          <div>
            <h3 className="font-medium text-yellow-800">Notifications Not Supported</h3>
            <p className="text-sm text-yellow-700">
              Your browser doesn't support push notifications. Try using a modern browser like Chrome or Firefox.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 max-w-md">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notification Settings</h2>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        {/* Permission Status */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Browser Notifications</span>
            <div className="flex items-center gap-2">
              {permission === 'granted' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {permission === 'denied' && <XCircle className="w-4 h-4 text-red-500" />}
              {permission === 'default' && <Bell className="w-4 h-4 text-gray-400" />}
            </div>
          </div>

          {permission === 'default' && (
            <button
              onClick={handlePermissionRequest}
              disabled={isRequesting}
              className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              <Bell className="w-4 h-4" />
              {isRequesting ? 'Requesting...' : 'Enable Notifications'}
            </button>
          )}

          {permission === 'granted' && (
            <p className="text-sm text-green-600 flex items-center gap-1">
              <CheckCircle className="w-4 h-4" />
              Notifications enabled
            </p>
          )}

          {permission === 'denied' && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              <p className="flex items-center gap-1 mb-1">
                <XCircle className="w-4 h-4" />
                Notifications blocked
              </p>
              <p className="text-xs">
                Please enable notifications in your browser settings and refresh the page.
              </p>
            </div>
          )}
        </div>

        {/* Notification Types */}
        {permission === 'granted' && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Notification Types</h3>

            {Object.entries(settings).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex-1">
                  <label className="text-sm text-gray-700 capitalize">
                    {key === 'itemOffers' ? 'Item Offers' :
                     key === 'serviceUpdates' ? 'Service Updates' :
                     key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <p className="text-xs text-gray-500">
                    {key === 'messages' && 'New messages and inquiries'}
                    {key === 'bookings' && 'Booking requests and confirmations'}
                    {key === 'itemOffers' && 'Interest in your items for sale'}
                    {key === 'serviceUpdates' && 'Service booking updates and changes'}
                    {key === 'general' && 'General announcements and updates'}
                  </p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button
                    onClick={() => testNotification(key as keyof typeof settings)}
                    className="text-xs text-primary-600 hover:text-primary-700"
                  >
                    Test
                  </button>
                  <button
                    onClick={() => saveSettings({ ...settings, [key]: !enabled })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      enabled ? 'bg-primary-600' : 'bg-gray-200'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Notifications help you stay updated on messages, bookings, and offers.
            You can change these settings anytime.
          </p>
        </div>
      </div>
    </div>
  )
}



