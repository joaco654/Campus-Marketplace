'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNotifications } from '../components/notifications/NotificationContext'
import { Search, Plus, Filter, User, LogOut, MessageSquare, Star, Calendar } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  pricingModel: string
  status: string
  boosted: boolean
  createdAt: string
  images?: string | null
  user: {
    id: string
    name: string
    image?: string
  }
  school: {
    name: string
    logoUrl?: string
  }
  ratings: Array<{ rating: number }>
}

export default function MarketplacePage() {
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('')
  const [user, setUser] = useState<any>(null)

  const categories = [
    'all',
    'tutoring',
    'essay editing',
    'moving help',
    'resume review',
    'graphic design',
    'class notes',
    'photography',
    'web development',
    'other',
  ]

  useEffect(() => {
    const checkAuth = async () => {
      // Skip if Supabase not available (build time)
      if (!supabase) {
        console.log('Supabase not available, skipping auth check')
        return
      }

      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/signin')
        } else {
          setUser(user)
          fetchUserProfile()
          fetchServices()
        }
      } catch (error) {
        console.log('Auth check failed, redirecting to signin')
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [router])

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        console.log('Profile data loaded:', { name: data.name, hasImage: !!data.image, image: data.image })
        setUserProfile(data)
        // Also fetch unread message count
        fetchUnreadMessageCount()
        if (!data.schoolId || data.schoolId === 'default') {
          router.push('/onboarding')
        }
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const fetchUnreadMessageCount = async () => {
    try {
      const response = await fetch('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        const newCount = data.totalUnread || 0
        const prevCount = unreadMessageCount

        // Show notification if we have new unread messages (not just on refresh)
        // Only show notification if count increased and we previously had some messages
        if (newCount > prevCount && prevCount >= 0) {
          addNotification({
            type: 'info',
            title: 'New Messages!',
            message: `You have ${newCount} unread message${newCount !== 1 ? 's' : ''}`,
            duration: 5000,
          })
        }
        setUnreadMessageCount(newCount)
      }
    } catch (error) {
      console.error('Error fetching unread message count:', error)
    }
  }

  const fetchServices = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedSchool !== 'all') params.append('schoolId', selectedSchool)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)

      const response = await fetch(`/api/services?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === 'authenticated') {
      fetchServices()
    }
  }, [searchTerm, selectedCategory, selectedSchool, priceRange.min, priceRange.max])

  // Poll for unread message count updates every 30 seconds
  useEffect(() => {
    if (status === 'authenticated') {
      // Initial fetch
      fetchUnreadMessageCount()

      // Set up polling interval
      const interval = setInterval(() => {
        fetchUnreadMessageCount()
      }, 30000) // 30 seconds

      // Cleanup interval on unmount or when status changes
      return () => clearInterval(interval)
    }
  }, [status])

  const getAverageRating = (ratings: Array<{ rating: number }>) => {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  const isUserOwnedListing = (service: Service) => {
    return userProfile && service.user.id === userProfile.id
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-3">
          <div className="mx-auto h-12 w-12 rounded-full border-2 border-primary-400/30 border-t-primary-600 animate-spin" />
            <p className="text-sm font-medium text-gray-900 tracking-wide">
              Checking your session…
            </p>
            <p className="text-xs text-gray-600">
              Loading your campus and services.
            </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white backdrop-blur-md sticky top-0 z-20 border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link
              href="/marketplace"
              className="text-2xl font-bold bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent"
            >
              Campus Marketplace
            </Link>
            <div className="flex items-center gap-4">
            <Link
              href="/marketplace/create"
              className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              Create Listing
            </Link>
            <Link
              href="/marketplace/bookings"
              className="p-2 text-gray-700 hover:text-primary-600 transition-colors"
              title="My Bookings"
            >
              <Calendar className="w-5 h-5" />
            </Link>
            <Link
              href="/marketplace/messages"
              className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors"
              title="Messages"
            >
              <MessageSquare className="w-5 h-5" />
              {unreadMessageCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] shadow-sm">
                  {unreadMessageCount > 99 ? '99+' : unreadMessageCount}
                </span>
              )}
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                title="Edit profile"
              >
                {userProfile?.image ? (
                  <img
                    src={userProfile.image}
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full cursor-pointer"
                    onError={(e) => {
                      console.log('Profile image failed to load:', userProfile.image)
                      // Hide broken image and show fallback
                      e.currentTarget.style.display = 'none'
                      e.currentTarget.nextElementSibling?.classList.remove('hidden')
                    }}
                  />
                ) : null}
                {!userProfile?.image || userProfile?.image?.includes('undefined') ? (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                ) : userProfile?.image ? (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer hidden">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center cursor-pointer">
                    <User className="w-5 h-5 text-primary-600" />
                  </div>
                )}
              </Link>
              <button
                onClick={async () => {
                  if (supabase) {
                    await supabase.auth.signOut()
                  }
                  router.push('/')
                }}
                className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                title="Sign out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex">
            <Link
              href="/marketplace"
              className="px-6 py-4 text-sm font-medium border-b-2 border-primary-500 text-primary-600"
            >
              Services
            </Link>
            <Link
              href="/marketplace/items"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              Items for Sale
            </Link>
            <Link
              href="/marketplace/events"
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 transition-colors"
            >
              Campus Events
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Min Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                    placeholder="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-1">
                    Max Price
                  </label>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="text-center py-12 space-y-3">
            <div className="mx-auto h-10 w-10 rounded-full border-2 border-primary-400/30 border-t-primary-600 animate-spin" />
            <p className="text-gray-700 text-sm font-medium">
              Loading services…
            </p>
            <p className="text-gray-500 text-xs">
              We&apos;re fetching listings from your campus.
            </p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
            <p className="text-gray-900 text-lg font-semibold">No services found</p>
            <p className="text-gray-600 mt-2">
              Try adjusting your filters or be the first to create a listing!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
            {services.map((service) => {
                const isOwned = isUserOwnedListing(service)
                let images = []
                try {
                  images = service.images ? JSON.parse(service.images) : []
                } catch (error) {
                  console.error('Error parsing images for service:', service.id, error)
                  images = []
                }
                const mainImage = images.length > 0 ? images[0] : null

                return (
                <Link
                  key={service.id}
                  href={`/marketplace/${service.id}`}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden group ${
                    isOwned
                      ? 'border-primary-300 bg-primary-50/50'
                      : 'border-gray-200'
                  }`}
                >
                  {/* Main Content - Service Details as Primary Focus */}
                  <div className="p-6">
                      {/* Header with badges */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                            {service.title}
                          </h3>
                          <div className="flex gap-2 mb-3">
                            {isOwned && (
                              <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full">
                                📋 Your Listing
                              </span>
                            )}
                            {service.boosted && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                                ⚡ Boosted
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                        {service.description}
                      </p>

                      {/* School info */}
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm text-gray-600">{service.school.logoUrl}</span>
                        <span className="text-sm text-gray-600">{service.school.name}</span>
                      </div>

                      {/* Price and Rating - Prominent */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl font-bold text-primary-600">
                            {service.pricingModel === 'free' ? (
                              'FREE'
                            ) : service.pricingModel === 'hourly' ? (
                              `$${service.price}/hr`
                            ) : (
                              `$${service.price}`
                            )}
                          </span>
                          {service.ratings.length > 0 && (
                            <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium text-gray-900">
                                {getAverageRating(service.ratings)}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Category - Clear and prominent */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                          {service.category}
                        </span>
                        <span className="text-xs text-gray-500 group-hover:text-primary-600 transition-colors">
                          View Details →
                        </span>
                      </div>

                      {/* Service Images - At the bottom */}
                      {mainImage && (
                        <div className="border-t border-gray-100 pt-4">
                          <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm">
                            <img
                              src={mainImage}
                              alt={service.title}
                              className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                              onClick={(e) => {
                                e.preventDefault()
                                setSelectedImage(mainImage)
                                setSelectedImageTitle(service.title)
                              }}
                            />
                            {images.length > 1 && (
                              <div className="absolute bottom-3 right-3 bg-black bg-opacity-70 text-white text-sm px-2 py-1 rounded-full">
                                +{images.length - 1} more
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-200 flex items-center justify-center">
                              <span className="text-white font-medium opacity-0 hover:opacity-100 transition-opacity duration-200">
                                Click to enlarge
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

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

