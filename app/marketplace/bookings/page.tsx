'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, Clock, MapPin, CheckCircle, XCircle, AlertCircle, MessageSquare } from 'lucide-react'
import { useNotifications } from '../../components/notifications/NotificationContext'

interface Booking {
  id: string
  serviceId: string
  title: string
  status: string
  date: string
  startTime: string
  endTime?: string
  location?: string
  notes?: string
  price: number
  createdAt: string
  service: {
    title: string
    category: string
    images?: string
  }
  buyer: {
    id: string
    name: string
    image?: string
  }
  seller: {
    id: string
    name: string
    image?: string
  }
}

export default function BookingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchBookings()
    }
  }, [status, router])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        fetchBookings() // Refresh the list

        // Show success notification based on status
        let notificationTitle = ''
        let notificationMessage = ''

        switch (status) {
          case 'CONFIRMED':
            notificationTitle = 'Booking Confirmed! ✅'
            notificationMessage = 'The booking has been confirmed. Check your messages for details.'
            break
          case 'IN_PROGRESS':
            notificationTitle = 'Service Started 🎯'
            notificationMessage = 'The service has been marked as in progress.'
            break
          case 'COMPLETED':
            notificationTitle = 'Service Completed! 🎉'
            notificationMessage = 'The service has been completed. You can now leave a review.'
            break
          case 'CANCELLED':
            notificationTitle = 'Booking Cancelled ❌'
            notificationMessage = 'The booking has been cancelled.'
            break
        }

        if (notificationTitle) {
          addNotification({
            type: 'success',
            title: notificationTitle,
            message: notificationMessage,
            duration: 5000,
          })
        }
      } else {
        addNotification({
          type: 'error',
          title: 'Update Failed',
          message: 'Failed to update booking status. Please try again.',
          duration: 4000,
        })
      }
    } catch (error) {
      console.error('Error updating booking:', error)
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'An error occurred while updating the booking.',
        duration: 4000,
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800'
      case 'IN_PROGRESS': return 'bg-purple-100 text-purple-800'
      case 'COMPLETED': return 'bg-green-100 text-green-800'
      case 'CANCELLED': return 'bg-red-100 text-red-800'
      case 'DISPUTED': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED': return <CheckCircle className="w-4 h-4" />
      case 'CANCELLED': return <XCircle className="w-4 h-4" />
      case 'DISPUTED': return <AlertCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const filteredBookings = bookings.filter(booking => {
    if (filter === 'all') return true
    return booking.status === filter
  })

  const currentUserId = session?.user?.id

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your bookings...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/marketplace"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Marketplace
              </Link>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">My Bookings</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { key: 'all', label: 'All Bookings', count: bookings.length },
                { key: 'PENDING', label: 'Pending', count: bookings.filter(b => b.status === 'PENDING').length },
                { key: 'CONFIRMED', label: 'Confirmed', count: bookings.filter(b => b.status === 'CONFIRMED').length },
                { key: 'COMPLETED', label: 'Completed', count: bookings.filter(b => b.status === 'COMPLETED').length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-6 py-4 text-sm font-medium border-b-2 ${
                    filter === tab.key
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label} ({tab.count})
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all'
                ? "You haven't made any bookings yet."
                : `You have no ${filter.toLowerCase()} bookings.`
              }
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700"
            >
              <Calendar className="w-4 h-4" />
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((booking) => {
              const isBuyer = booking.buyer.id === currentUserId
              const otherParty = isBuyer ? booking.seller : booking.buyer
              const bookingDate = new Date(booking.date)

              return (
                <div key={booking.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{booking.title}</h3>
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">with {otherParty.name}</p>
                      <p className="text-sm text-gray-500">{booking.service.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-primary-600">
                        ${booking.price}
                      </p>
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {bookingDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">
                        {booking.startTime}
                        {booking.endTime && ` - ${booking.endTime}`}
                      </span>
                    </div>
                    {booking.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{booking.location}</span>
                      </div>
                    )}
                  </div>

                  {booking.notes && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{booking.notes}</p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {booking.status === 'PENDING' && !isBuyer && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CONFIRMED')}
                          className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                          className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                        >
                          Decline
                        </button>
                      </div>
                    )}

                    {booking.status === 'CONFIRMED' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'IN_PROGRESS')}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
                      >
                        Mark as Started
                      </button>
                    )}

                    {booking.status === 'IN_PROGRESS' && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'COMPLETED')}
                        className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                      >
                        Mark as Completed
                      </button>
                    )}

                    {booking.status === 'PENDING' && isBuyer && (
                      <button
                        onClick={() => updateBookingStatus(booking.id, 'CANCELLED')}
                        className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                      >
                        Cancel Request
                      </button>
                    )}

                    <Link
                      href={`/marketplace/messages?serviceId=${booking.serviceId}&userId=${otherParty.id}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-lg hover:bg-gray-50"
                    >
                      <MessageSquare className="w-4 h-4 inline mr-1" />
                      Message
                    </Link>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
