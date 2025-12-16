'use client'

import { NotificationProvider } from './components/notifications/NotificationContext'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      {children}
    </NotificationProvider>
  )
}

