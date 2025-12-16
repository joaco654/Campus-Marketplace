'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Tag } from 'lucide-react'
import Link from 'next/link'
import { useNotifications } from '../../components/notifications/NotificationContext'

const CATEGORIES = [
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

export default function CreateListingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { addNotification } = useNotifications()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [suggestedPrice, setSuggestedPrice] = useState<number | null>(null)
  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    pricingModel: 'fixed', // 'fixed', 'hourly', 'free'
    images: [] as File[],
  })
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      // Check if we're editing an existing listing
      const urlParams = new URLSearchParams(window.location.search)
      const editId = urlParams.get('edit')
      if (editId) {
        setIsEditing(true)
        setEditingId(editId)
        loadListingForEdit(editId)
      }
    }
  }, [status, router])

  const handleDescriptionChange = async (description: string) => {
    setFormData({ ...formData, description })

    // AI auto-tagging and price suggestion
    if (description.length > 20) {
      try {
        const response = await fetch('/api/ai/suggest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ description }),
        })

        if (response.ok) {
          const data = await response.json()
          if (data.category && !formData.category) {
            setSuggestedCategory(data.category)
          }
          if (data.price) {
            setSuggestedPrice(data.price)
          }
        }
      } catch (error) {
        console.error('Error getting AI suggestions:', error)
      }
    }
  }

  const validateImageFile = (file: File): string | null => {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      return 'Please select a valid image file (JPEG, PNG, or WebP)'
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      return 'Image file size must be less than 5MB'
    }

    // Basic content protection - check filename for inappropriate keywords
    const fileName = file.name.toLowerCase()
    const inappropriateKeywords = ['nsfw', 'adult', 'porn', 'naked', 'sex', 'explicit', 'xxx']
    const hasInappropriateContent = inappropriateKeywords.some(keyword =>
      fileName.includes(keyword)
    )

    if (hasInappropriateContent) {
      return 'Image filename suggests inappropriate content. Please choose a different image.'
    }

    return null // Valid file
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const maxImages = 5

    if (files.length + formData.images.length > maxImages) {
      setError(`You can upload a maximum of ${maxImages} images`)
      return
    }

    const validFiles: File[] = []
    const newPreviews: string[] = []

    for (const file of files) {
      const validationError = validateImageFile(file)
      if (validationError) {
        setError(validationError)
        return
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          setImagePreviews(prev => [...prev, e.target!.result as string])
        }
      }
      reader.readAsDataURL(file)
    }

    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...validFiles]
    }))
    setError('')
  }

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const loadListingForEdit = async (listingId: string) => {
    try {
      const response = await fetch(`/api/services/${listingId}`)
      if (response.ok) {
        const listing = await response.json()

        // Check if user owns this listing
        const userResponse = await fetch('/api/user/me')
        if (userResponse.ok) {
          const userData = await userResponse.json()
          if (listing.user.id !== userData.id) {
            setError('You can only edit your own listings')
            router.push('/profile')
            return
          }
        }

        setFormData({
          title: listing.title || '',
          description: listing.description || '',
          category: listing.category || '',
          price: listing.price?.toString() || '',
          pricingModel: listing.pricingModel || 'fixed',
          images: [],
        })

        // Load existing images if any
        if (listing.images) {
          try {
            const existingImages = JSON.parse(listing.images)
            setImagePreviews(existingImages)
          } catch (e) {
            console.error('Error parsing existing images:', e)
          }
        }
      } else {
        setError('Failed to load listing for editing')
        router.push('/profile')
      }
    } catch (error) {
      console.error('Error loading listing:', error)
      setError('Failed to load listing for editing')
      router.push('/profile')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Images are now optional

    try {
      const price = formData.pricingModel === 'free' ? 0 : parseFloat(formData.price || '0')

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('price', price.toString())
      formDataToSend.append('pricingModel', formData.pricingModel)

      // Add images
      formData.images.forEach((image, index) => {
        formDataToSend.append(`image_${index}`, image)
      })

      console.log('Creating service with form data:', {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price,
        pricingModel: formData.pricingModel,
        imageCount: formData.images.length
      })

      const response = await fetch(isEditing && editingId ? `/api/services/${editingId}` : '/api/services', {
        method: isEditing ? 'PATCH' : 'POST',
        body: formDataToSend,
      })

      console.log('API response status:', response.status)

      const data = await response.json()
      console.log('API response data:', data)

      if (!response.ok) {
        setError(data.error || `Failed to ${isEditing ? 'update' : 'create'} listing`)
        addNotification({
          type: 'error',
          title: `Failed to ${isEditing ? 'update' : 'create'} listing`,
          message: data.error || 'Please try again.',
          duration: 5000,
        })
      } else {
        addNotification({
          type: 'success',
          title: `Listing ${isEditing ? 'updated' : 'created'} successfully!`,
          message: `Your service has been ${isEditing ? 'updated' : 'published'} on the marketplace.`,
          duration: 4000,
        })
        router.push(`/marketplace/${isEditing ? editingId : data.id}`)
      }
    } catch (error) {
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/marketplace"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            {isEditing ? 'Edit Service Listing' : 'Create Service Listing'}
          </h1>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="e.g., Math Tutoring for Calculus I"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Describe your service in detail..."
              />
              {suggestedCategory && !formData.category && (
                <div className="mt-2 flex items-center gap-2 text-sm text-primary-600">
                  <Tag className="w-4 h-4" />
                  <span>AI suggests category: </span>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, category: suggestedCategory })}
                    className="font-semibold underline"
                  >
                    {suggestedCategory}
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Select a category</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pricing Model *
              </label>
              <select
                required
                value={formData.pricingModel}
                onChange={(e) => setFormData({ ...formData, pricingModel: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="fixed">Fixed Price - One-time service</option>
                <option value="hourly">Hourly Rate</option>
                <option value="free">Free Service</option>
              </select>
            </div>

            {formData.pricingModel !== 'free' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (USD) *
                  {formData.pricingModel === 'hourly' && ' per hour'}
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    $
                  </span>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="0.00"
                  />
                  {suggestedPrice && !formData.price && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-primary-600">
                    <Tag className="w-4 h-4" />
                    <span>AI suggests price: </span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, price: suggestedPrice.toString() })}
                        className="font-semibold underline"
                      >
                        ${suggestedPrice}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {formData.pricingModel === 'free' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-green-800">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">Free Service</span>
                </div>
                <p className="text-sm text-green-700 mt-1">
                  You're offering this service for free. Great way to help your community!
                </p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Images (Optional)
              </label>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 mt-0.5">📸</div>
                  <div className="text-sm text-blue-800">
                    <strong>Pro tip:</strong> Add high-quality photos to showcase your service and attract more customers! Services with images typically get more bookings.
                  </div>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center"
                  >
                    <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">Click to upload images</span>
                    <span className="text-xs text-gray-500 mt-1">
                      PNG, JPG, WebP up to 5MB each (max 5 images)
                    </span>
                  </label>
                </div>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length > 0 && (
                  <p className="text-xs text-gray-500">
                    {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} selected
                  </p>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Listing' : 'Create Listing')}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

