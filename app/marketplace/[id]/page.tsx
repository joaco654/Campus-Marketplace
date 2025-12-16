'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, MessageSquare, Star, User, MapPin, Calendar, Clock, MapPin as MapPinIcon } from 'lucide-react'
import { useNotifications } from '../../components/notifications/NotificationContext'

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  pricingModel: string
  images: string | null
  status: string
  boosted: boolean
  createdAt: string
  user: {
    id: string
    name: string
    image?: string
    major?: string
  }
  school: {
    name: string
    logoUrl?: string
  }
  ratings: Array<{
    id: string
    rating: number
    review?: string
    user: {
      name: string
    }
    createdAt: string
  }>
}

export default function ServiceDetailPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const { addNotification } = useNotifications()
  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [rating, setRating] = useState(0)
  const [review, setReview] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('')

  // Booking state
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingDate, setBookingDate] = useState('')
  const [bookingTime, setBookingTime] = useState('')
  const [bookingLocation, setBookingLocation] = useState('')
  const [bookingNotes, setBookingNotes] = useState('')
  const [creatingBooking, setCreatingBooking] = useState(false)

  console.log('ServiceDetailPage render - Session:', session)
  console.log('ServiceDetailPage render - Service ID from params:', params.id)

  useEffect(() => {
    fetchService()
  }, [params.id])

  useEffect(() => {
    const checkOwner = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/user/me')
          if (response.ok) {
            const user = await response.json()
            setIsOwner(user.id === service?.user.id)
          }
        } catch (error) {
          console.error('Error checking owner:', error)
        }
      }
    }
    if (service) {
      checkOwner()
    }
  }, [session, service])

  const fetchService = async () => {
    try {
      const response = await fetch(`/api/services/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setService(data)
      }
    } catch (error) {
      console.error('Error fetching service:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = () => {
    console.log('handleSendMessage called')
    console.log('Current session:', session)
    console.log('Service data:', service)

    if (!session) {
      console.log('No session, redirecting to signin')
      router.push('/auth/signin')
      return
    }

    if (!service?.user?.id) {
      console.error('Service or user ID missing:', service)
      alert('Unable to start conversation - service information is incomplete.')
      return
    }

    const messageUrl = `/marketplace/messages?serviceId=${service.id}&userId=${service.user.id}`
    console.log('Redirecting to messages page:', messageUrl)
    router.push(messageUrl)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!rating || !session) return

    setSubmittingReview(true)
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service?.id,
          rating,
          review: review || undefined,
        }),
      })

      if (response.ok) {
        setRating(0)
        setReview('')
        fetchService()
      }
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setSubmittingReview(false)
    }
  }

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bookingDate || !bookingTime || !session || !service) return

    setCreatingBooking(true)
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: service.id,
          date: bookingDate,
          startTime: bookingTime,
          location: bookingLocation,
          notes: bookingNotes,
          price: service.price,
        }),
      })

      if (response.ok) {
        setShowBookingModal(false)
        setBookingDate('')
        setBookingTime('')
        setBookingLocation('')
        setBookingNotes('')

        // Show success notification
        addNotification({
          type: 'success',
          title: 'Booking Request Sent! 📅',
          message: `Your booking request for "${service?.title}" has been sent to the seller. You'll be notified when they respond.`,
          duration: 6000,
        })
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to create booking')

        // Show error notification
        addNotification({
          type: 'error',
          title: 'Booking Failed',
          message: data.error || 'Failed to create booking. Please try again.',
          duration: 5000,
        })
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setCreatingBooking(false)
    }
  }

  const getAverageRating = () => {
    if (!service || service.ratings.length === 0) return 0
    const sum = service.ratings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / service.ratings.length).toFixed(1)
  }

  let images = []
  try {
    images = service?.images ? JSON.parse(service.images) : []
  } catch (error) {
    console.error('Error parsing images for service detail:', service?.id, error)
    images = []
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Service not found</p>
          <Link href="/marketplace" className="text-primary-600 hover:underline mt-4 inline-block">
            Back to Marketplace
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="max-w-7xl mx-auto p-8">
            <div className={`grid gap-8 ${images.length > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
              {/* Details - Takes up 2/3 on large screens */}
              <div className={images.length > 0 ? 'lg:col-span-2' : ''}>
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.title}</h1>
                  <div className="flex items-center gap-2 text-gray-600 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{service.school.logoUrl} {service.school.name}</span>
                  </div>
                </div>
                {service.boosted && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-3 py-1 rounded">
                    ⚡ Boosted
                  </span>
                )}
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-primary-600">
                  {service.pricingModel === 'free' ? (
                    'FREE'
                  ) : service.pricingModel === 'hourly' ? (
                    `$${service.price}/hr`
                  ) : (
                    `$${service.price}`
                  )}
                </span>
                <span className="text-gray-500 ml-2">
                  {service.pricingModel === 'free' ? 'Service' :
                   service.pricingModel === 'hourly' ? 'per hour' :
                   'USD'}
                </span>
              </div>

              <div className="mb-6">
                <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                  {service.category}
                </span>
                <span className={`ml-2 inline-block px-3 py-1 rounded-full text-sm ${
                  service.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {service.status}
                </span>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
                <p className="text-gray-700 whitespace-pre-wrap">{service.description}</p>
              </div>

              {/* Seller Info */}
              <div className="border-t border-gray-200 pt-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller</h3>
                <div className="flex items-center gap-4">
                  {service.user.image ? (
                    <img
                      src={service.user.image}
                      alt={service.user.name}
                      className="w-12 h-12 rounded-full"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                      <User className="w-6 h-6 text-primary-600" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-900">{service.user.name}</p>
                    {service.user.major && (
                      <p className="text-sm text-gray-600">{service.user.major}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Ratings */}
              {service.ratings.length > 0 && (
                <div className="border-t border-gray-200 pt-6 mb-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-lg font-semibold text-gray-900">
                      {getAverageRating()} ({service.ratings.length} reviews)
                    </span>
                  </div>
                  <div className="space-y-4 max-h-48 overflow-y-auto">
                    {service.ratings.map((r) => (
                      <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < r.rating
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-600">{r.user.name}</span>
                        </div>
                        {r.review && <p className="text-sm text-gray-700 mt-1">{r.review}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              {!isOwner && service.status === 'available' && (
                <div className="space-y-3">
                  <button
                    onClick={() => setShowBookingModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Calendar className="w-5 h-5" />
                    Book This Service
                  </button>
                  <button
                    onClick={handleSendMessage}
                    className="w-full flex items-center justify-center gap-2 border border-primary-600 text-primary-600 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Contact Seller
                  </button>
                </div>
              )}

              {/* Review Form */}
              {!isOwner && session && (
                <div className="border-t border-gray-200 pt-6 mt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Leave a Review</h3>
                  <form onSubmit={handleSubmitReview} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= rating
                                  ? 'text-yellow-400 fill-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Review (Optional)
                      </label>
                      <textarea
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        placeholder="Share your experience..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!rating || submittingReview}
                      className="w-full bg-gray-600 text-white py-2 rounded-lg font-semibold hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                      {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                  </form>
                </div>
              )}
            </div>

              </div>

              {/* Images - Takes up 1/3 on large screens */}
              {images.length > 0 && (
                <div className="lg:col-span-1">
                  <div className="sticky top-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Photos</h3>
                    <div className="space-y-3">
                      {images.map((img: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={img}
                            alt={`${service.title} photo ${idx + 1}`}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={() => {
                              setSelectedImage(img)
                              setSelectedImageTitle(service.title)
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Book {service?.title}</h3>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time *
                </label>
                <input
                  type="time"
                  required
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location (optional)
                </label>
                <input
                  type="text"
                  value={bookingLocation}
                  onChange={(e) => setBookingLocation(e.target.value)}
                  placeholder="e.g., Library, Campus Center, Online"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  value={bookingNotes}
                  onChange={(e) => setBookingNotes(e.target.value)}
                  placeholder="Any special requirements or details..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Service Price:</span>
                  <span className="font-semibold">
                    {service?.pricingModel === 'free' ? 'FREE' :
                     service?.pricingModel === 'hourly' ? `$${service.price}/hr` :
                     `$${service.price}`}
                  </span>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>💳 <strong>Peer-to-peer payment:</strong> Arrange payment directly with the service provider via Venmo, Cash App, or other preferred method after booking is confirmed.</p>
                  <p>🛡️ <strong>Tip:</strong> Only proceed with payment after the booking details are confirmed and you're comfortable with the arrangement.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingBooking}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50"
                >
                  {creatingBooking ? 'Sending...' : 'Send Booking Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={selectedImage}
              alt={selectedImageTitle}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-75 transition-all"
            >
              ✕
            </button>
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              <p className="text-sm font-medium">{selectedImageTitle}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

