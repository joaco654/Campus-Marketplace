'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, MessageSquare, Star, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'

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
    major?: string
  }
  school: {
    name: string
    logoUrl?: string
  }
}

export default function ItemDetailPage() {
  const { data: session, status } = useSession()
  const params = useParams()
  const router = useRouter()
  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedImageTitle, setSelectedImageTitle] = useState<string>('')

  useEffect(() => {
    if (params.id) {
      fetchItem()
    }
  }, [params.id])

  const fetchItem = async () => {
    try {
      const response = await fetch(`/api/items/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setItem(data)

        // Parse images
        try {
          const parsedImages = data.images ? JSON.parse(data.images) : []
          setImages(parsedImages)
          if (parsedImages.length > 0) {
            setSelectedImage(parsedImages[0])
            setSelectedImageTitle(data.title)
          }
        } catch (error) {
          console.error('Error parsing images:', error)
          setImages([])
        }
      } else {
        setError('Item not found')
      }
    } catch (error) {
      console.error('Error fetching item:', error)
      setError('Failed to load item')
    } finally {
      setLoading(false)
    }
  }

  const handleContactSeller = () => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    // Navigate to messages with item details
    router.push(`/marketplace/messages?itemId=${item?.id}&userId=${item?.user.id}`)
  }

  const handleDeleteItem = async () => {
    if (!confirm('Are you sure you want to delete this item? This action cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/items/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/marketplace/items')
      } else {
        const data = await response.json()
        setError(data.error || 'Failed to delete item')
      }
    } catch (error) {
      setError('Failed to delete item')
    }
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

  const isOwner = session?.user && item?.user.id === session.user.id

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading item...</p>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Item Not Found</h1>
          <p className="text-gray-600 mb-6">{error || 'The item you\'re looking for doesn\'t exist.'}</p>
          <Link
            href="/marketplace/items"
            className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Items
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/marketplace/items"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Items
            </Link>
            <div className="flex items-center gap-4">
              {isOwner && (
                <>
                  <Link
                    href={`/marketplace/items/create?id=${item.id}`}
                    className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Item
                  </Link>
                  <button
                    onClick={handleDeleteItem}
                    className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto p-8">
          <div className={`grid gap-8 ${images.length > 0 ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {/* Details - Takes up 2/3 on large screens */}
            <div className={images.length > 0 ? 'lg:col-span-2' : ''}>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <div className="flex items-center gap-2 text-gray-600 mb-4">
                  <MapPin className="w-4 h-4" />
                  <span>{item.school.logoUrl} {item.school.name}</span>
                </div>
              </div>
            </div>

            {/* Price and Condition */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-4xl font-bold text-primary-600">${item.price}</span>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getConditionColor(item.condition)}`}>
                {item.condition}
              </span>
            </div>

            {/* Category */}
            <div className="mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                {item.category.charAt(0).toUpperCase() + item.category.slice(1).replace('-', ' ')}
              </span>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Seller Info */}
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-4">
                {item.user.image ? (
                  <img
                    src={item.user.image}
                    alt={item.user.name}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                    <span className="text-primary-600 font-semibold">
                      {item.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-gray-900">{item.user.name}</h3>
                  {item.user.major && (
                    <p className="text-sm text-gray-600">{item.user.major}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {item.status === 'available' && (
              <div className="space-y-4">
                {!isOwner && (
                  <button
                    onClick={handleContactSeller}
                    className="w-full bg-primary-600 text-white py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageSquare className="w-5 h-5" />
                    Contact Seller
                  </button>
                )}

                <div className="text-center text-sm text-gray-600">
                  <p>💰 Payment handled peer-to-peer</p>
                  <p>Arrange pickup/delivery directly with the seller</p>
                </div>
              </div>
            )}

            {item.status !== 'available' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
                <p className="text-yellow-800 font-medium">
                  {item.status === 'sold' ? 'This item has been sold' : 'This item is reserved'}
                </p>
              </div>
            )}

            {/* Posted date */}
            <div className="mt-8 text-sm text-gray-500">
              Posted {new Date(item.createdAt).toLocaleDateString()}
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
                          alt={`${item.title} photo ${idx + 1}`}
                          className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform duration-200"
                          onClick={() => {
                            setSelectedImage(img)
                            setSelectedImageTitle(item.title)
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
