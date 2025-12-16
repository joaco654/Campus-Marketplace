'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Search, Plus, Filter, User, LogOut, MessageSquare, Star, Calendar } from 'lucide-react'
import { signOut } from 'next-auth/react'

interface Item {
  id: string
  title: string
  description: string
  category: string
  condition: string
  price: number
  images?: string | null
  status: string
  createdAt: string
  user: {
    id: string
    name: string
    image?: string
  }
  school: {
    name: string
    logoUrl?: string
  }
}

export default function ItemsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedCondition, setSelectedCondition] = useState('all')
  const [selectedSchool, setSelectedSchool] = useState('all')
  const [priceRange, setPriceRange] = useState({ min: '', max: '' })
  const [showFilters, setShowFilters] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [unreadMessageCount, setUnreadMessageCount] = useState(0)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('')

  const categories = [
    'all',
    'books',
    'calculators',
    'lab-supplies',
    'dorm-supplies',
    'electronics',
    'furniture',
    'clothing',
    'other',
  ]

  const conditions = [
    'all',
    'new',
    'like-new',
    'good',
    'fair',
    'poor',
  ]

  useEffect(() => {
    if (status === 'authenticated') {
      fetchItems()
      fetchUserProfile()
      fetchUnreadMessageCount()
    }
  }, [searchTerm, selectedCategory, selectedCondition, selectedSchool, priceRange.min, priceRange.max])

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

  const fetchItems = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append('search', searchTerm)
      if (selectedCategory !== 'all') params.append('category', selectedCategory)
      if (selectedCondition !== 'all') params.append('condition', selectedCondition)
      if (selectedSchool !== 'all') params.append('schoolId', selectedSchool)
      if (priceRange.min) params.append('minPrice', priceRange.min)
      if (priceRange.max) params.append('maxPrice', priceRange.max)

      const response = await fetch(`/api/items?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setItems(data)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setUserProfile(data)
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    }
  }

  const fetchUnreadMessageCount = async () => {
    try {
      const response = await fetch('/api/messages/conversations')
      if (response.ok) {
        const data = await response.json()
        setUnreadMessageCount(data.totalUnread || 0)
      }
    } catch (error) {
      console.error('Error fetching unread message count:', error)
    }
  }

  const getAverageRating = (ratings: Array<{ rating: number }>) => {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  const isUserOwnedListing = (item: Item) => {
    return userProfile && item.user.id === userProfile.id
  }

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'new': return 'bg-green-100 text-green-800'
      case 'like-new': return 'bg-blue-100 text-blue-800'
      case 'good': return 'bg-yellow-100 text-yellow-800'
      case 'fair': return 'bg-orange-100 text-orange-800'
      case 'poor': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/marketplace" className="text-2xl font-bold text-primary-600">
              Campus Marketplace
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/marketplace/items/create"
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Sell Item
              </Link>
              <Link
                href="/marketplace/bookings"
                className="p-2 text-gray-600 hover:text-primary-600 transition-colors"
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
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]">
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
                  onClick={() => signOut({ callbackUrl: '/' })}
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
              className="px-6 py-4 text-sm font-medium text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300"
            >
              Services
            </Link>
            <Link
              href="/marketplace/items"
              className="px-6 py-4 text-sm font-medium border-b-2 border-primary-500 text-primary-600"
            >
              Items for Sale
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items for sale..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Condition */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condition
                  </label>
                  <select
                    value={selectedCondition}
                    onChange={(e) => setSelectedCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                  >
                    {conditions.map((condition) => (
                      <option key={condition} value={condition}>
                        {condition === 'all' ? 'All Conditions' : condition.charAt(0).toUpperCase() + condition.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="0"
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({ ...priceRange, min: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      placeholder="1000"
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value })}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading items...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">📦</div>
            <p className="text-gray-500 text-lg">No items found</p>
            <p className="text-gray-400 mt-2">Try adjusting your filters or be the first to sell items!</p>
            <Link
              href="/marketplace/items/create"
              className="inline-flex items-center gap-2 mt-4 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              List Your First Item
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const isOwned = isUserOwnedListing(item)
              let images = []
              try {
                images = item.images ? JSON.parse(item.images) : []
              } catch (error) {
                console.error('Error parsing images for item:', item.id, error)
                images = []
              }
              const mainImage = images.length > 0 ? images[0] : null

              return (
                <Link
                  key={item.id}
                  href={`/marketplace/items/${item.id}`}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border overflow-hidden group ${
                    isOwned ? 'border-primary-300 bg-primary-50/50' : 'border-gray-200'
                  }`}
                >
                  {/* Main Content - Item Details as Primary Focus */}
                  <div className="p-6">
                    {/* Header with badges */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-primary-600 transition-colors">
                          {item.title}
                        </h3>
                        <div className="flex gap-2 mb-3">
                          {isOwned && (
                            <span className="bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded-full">
                              📋 Your Listing
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-700 text-sm mb-4 line-clamp-3 leading-relaxed">
                      {item.description}
                    </p>

                    {/* School info */}
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-sm text-gray-600">{item.school.logoUrl}</span>
                      <span className="text-sm text-gray-600">{item.school.name}</span>
                    </div>

                    {/* Price and Condition - Prominent */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-primary-600">
                          ${item.price}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getConditionColor(item.condition)}`}>
                          {item.condition}
                        </span>
                      </div>
                    </div>

                    {/* Category - Clear and prominent */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                        {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 group-hover:text-primary-600 transition-colors">
                        View Details →
                      </span>
                    </div>

                    {/* Item Images - At the bottom */}
                    {mainImage && (
                      <div className="border-t border-gray-100 pt-4">
                        <div className="relative w-full h-48 rounded-lg overflow-hidden shadow-sm">
                          <img
                            src={mainImage}
                            alt={item.title}
                            className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                            onClick={(e) => {
                              e.preventDefault()
                              setSelectedImage(mainImage)
                              setSelectedImageTitle(item.title)
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


