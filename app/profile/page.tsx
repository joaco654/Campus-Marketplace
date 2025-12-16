'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Camera, Save, User, GraduationCap, MapPin, Briefcase, Star, Edit, Trash2, Plus, Bell } from 'lucide-react'
import Link from 'next/link'
import { NotificationSettings } from '../components/notifications/NotificationSettings'

interface UserProfile {
  id: string
  name: string
  email: string
  image?: string
  major?: string
  schoolId?: string
  school?: {
    name: string
    stateName?: string
  }
}

interface Service {
  id: string
  title: string
  description: string
  category: string
  price: number
  pricingModel: string
  boosted: boolean
  ratings: Array<{ rating: number }>
  school: {
    name: string
    logoUrl: string
  }
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [major, setMajor] = useState('')
  const [bio, setBio] = useState('')
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  // Listings state
  const [userListings, setUserListings] = useState<Service[]>([])
  const [listingsLoading, setListingsLoading] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchProfile()
      fetchUserListings()
    }
  }, [status, router])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
        setName(data.name || '')
        setMajor(data.major || '')
        setImagePreview(data.image || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserListings = async () => {
    setListingsLoading(true)
    try {
      const response = await fetch('/api/services?user=true')
      if (response.ok) {
        const data = await response.json()
        setUserListings(data)
      }
    } catch (error) {
      console.error('Error fetching user listings:', error)
    } finally {
      setListingsLoading(false)
    }
  }

  const handleDeleteListing = async (listingId: string) => {
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/services/${listingId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setUserListings(prev => prev.filter(listing => listing.id !== listingId))
        setError('Listing deleted successfully!')
        setTimeout(() => setError(''), 3000)
      } else {
        setError('Failed to delete listing')
      }
    } catch (error) {
      console.error('Error deleting listing:', error)
      setError('Failed to delete listing')
    }
  }

  const getAverageRating = (ratings: Array<{ rating: number }>) => {
    if (ratings.length === 0) return 0
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0)
    return (sum / ratings.length).toFixed(1)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('major', major)
      if (imageFile) {
        formData.append('image', imageFile)
      }

      console.log('Profile: Saving profile data:', { name, major, hasImage: !!imageFile })

      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        body: formData,
      })

      console.log('Profile: API response status:', response.status)

      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}`
        try {
          const data = await response.json()
          errorMessage = data.error || errorMessage
        } catch (parseError) {
          console.error('Profile: Failed to parse error response:', parseError)
          const textResponse = await response.text()
          console.error('Profile: Error response text:', textResponse)
        }
        throw new Error(errorMessage)
      }

      // Refresh profile data
      await fetchProfile()
      setError('Profile updated successfully!')
    } catch (error: any) {
      console.error('Profile: Save error:', error)
      setError(error.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  const handleChangeSchool = () => {
    router.push('/onboarding?change=true')
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <h1 className="text-xl font-semibold text-gray-900">Edit Profile</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          {error && (
            <div className={`p-4 border-b ${
              error.includes('successfully')
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {error}
            </div>
          )}

          <div className="p-6 space-y-6">
            {/* Profile Picture */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile"
                    className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200">
                    <User className="w-12 h-12 text-gray-400" />
                  </div>
                )}
                <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                  <Camera className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-sm text-gray-500">Click the camera to update your profile picture</p>
            </div>

            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Major
                </label>
                <input
                  type="text"
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="e.g., Computer Science, Business"
                />
              </div>
            </div>

            {/* Current School Info */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-900 mb-3">School Information</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <GraduationCap className="w-4 h-4" />
                  <span>{profile?.school?.name || 'No school selected'}</span>
                </div>
                {profile?.school?.stateName && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{profile.school.stateName}</span>
                  </div>
                )}
              </div>
              <button
                onClick={handleChangeSchool}
                className="mt-3 text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                Change school/state selection →
              </button>
            </div>

            {/* Notification Settings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
                </div>
                <button
                  onClick={() => setShowNotificationSettings(true)}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Manage Settings →
                </button>
              </div>
              <p className="text-sm text-gray-600">
                Control when you receive notifications for messages, bookings, and offers.
                Stay updated on your marketplace activity.
              </p>
            </div>

            {/* My Listings */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">My Listings</h3>
                <Link
                  href="/marketplace/create"
                  className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Create New Listing
                </Link>
              </div>

              {listingsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
                  <span className="ml-2 text-gray-600">Loading listings...</span>
                </div>
              ) : userListings.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't created any listings yet.</p>
                  <Link
                    href="/marketplace/create"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Create Your First Listing
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="bg-white p-4 rounded-lg border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{listing.title}</h4>
                            {listing.boosted && (
                              <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded">
                                ⚡ Boosted
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">{listing.description}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Link
                            href={`/marketplace/${listing.id}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            View
                          </Link>
                          <button
                            onClick={() => router.push(`/marketplace/create?edit=${listing.id}`)}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="text-red-600 hover:text-red-700 text-sm font-medium"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-primary-600">
                            {listing.pricingModel === 'free' ? (
                              'FREE'
                            ) : listing.pricingModel === 'hourly' ? (
                              `$${listing.price}/hr`
                            ) : (
                              `$${listing.price}`
                            )}
                          </span>
                          {listing.ratings.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                              <span className="text-sm text-gray-600">
                                {getAverageRating(listing.ratings)}
                              </span>
                            </div>
                          )}
                        </div>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          {listing.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Items for Sale */}
              <div className="bg-gray-50 p-4 rounded-lg mt-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">My Items for Sale</h3>
                  <Link
                    href="/marketplace/items/create"
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Sell Item
                  </Link>
                </div>

                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">Items for sale feature coming soon!</p>
                  <Link
                    href="/marketplace/items"
                    className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors"
                  >
                    Browse Items
                  </Link>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings Modal */}
      {showNotificationSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
        </div>
      )}
    </div>
  )
}
