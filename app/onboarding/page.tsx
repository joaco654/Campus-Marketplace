'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Search, GraduationCap, ArrowLeft, ArrowRight, MapPin } from 'lucide-react'
import { STATES_AND_SCHOOLS, getStateByCode } from '@/lib/states-and-schools'

export default function OnboardingPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [step, setStep] = useState<'state' | 'school'>('state')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedSchool, setSelectedSchool] = useState<string | null>(null)
  const [selectedSchools, setSelectedSchools] = useState<string[]>([])
  const [multiSelectMode, setMultiSelectMode] = useState(false)
  const [major, setMajor] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [checkingProfile, setCheckingProfile] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    }
  }, [status, router])

  useEffect(() => {
    // Check if user already has a school selected with proper state information
    const checkUserProfile = async () => {

      if (status === 'authenticated' && session?.user?.email) {
        try {
          const response = await fetch('/api/user/profile')
          if (response.ok) {
            const data = await response.json()

            // Only redirect if user has completed onboarding with NEW format
            // New format: "ST-SCHOOLID" (e.g., "FL-uf" for University of Florida)
            // Old format: "fau", "uf", etc. - these should go through onboarding again
            if (data.schoolId && data.schoolId !== 'default') {
              // Check if it's in the new format (contains state code prefix like "FL-uf")
              const hasStatePrefix = /^[A-Z]{2}-/.test(data.schoolId)

              // Also check if school has state info in the database (for edge cases)
              const hasStateInfo = data.school?.stateCode || data.school?.stateName

              // Only redirect if school has proper state information (new format)
              // Old format school IDs (like "fau", "uf") should go through onboarding
              if (hasStatePrefix || hasStateInfo) {
                // User has completed onboarding
                // Check if they want to change their school (from profile/settings)
                const urlParams = new URLSearchParams(window.location.search)
                const allowChange = urlParams.get('change') === 'true'

                if (!allowChange) {
                  // Normal case - redirect to marketplace
                  router.push('/marketplace')
                  return // Exit early to prevent further rendering
                }
                // Allow them to stay on onboarding page to change their school
              }
              // If school ID is old format without state info, user stays on onboarding page
              // This allows users with old accounts to update their school with state info
            }
            // If schoolId is 'default' or doesn't exist, user stays on onboarding page
            setCheckingProfile(false)
          } else {
            console.error('Failed to fetch profile during onboarding check:', response.status)
            setCheckingProfile(false)
          }
        } catch (error) {
          console.error('Error checking profile:', error)
          setCheckingProfile(false)
        }
      } else if (status === 'unauthenticated') {
        setCheckingProfile(false)
      }
    }

    if (status !== 'loading') {
      checkUserProfile()
    }
  }, [status, session, router])

  const handleStateSelect = (stateCode: string) => {
    setSelectedState(stateCode)
    setError('')
  }

  const handleSchoolSelect = (schoolId: string) => {
    if (multiSelectMode) {
      setSelectedSchools(prev =>
        prev.includes(schoolId)
          ? prev.filter(id => id !== schoolId)
          : [...prev, schoolId]
      )
    } else {
      setSelectedSchool(selectedSchool === schoolId ? null : schoolId)
    }
    setError('')
  }

  const removeSelectedSchool = (schoolId: string) => {
    setSelectedSchools(prev => prev.filter(id => id !== schoolId))
  }

  const toggleMultiSelect = () => {
    setMultiSelectMode(!multiSelectMode)
    setSelectedSchool(null)
    setSelectedSchools([])
    setError('')
  }

  const handleContinueToSchools = () => {
    if (!selectedState) {
      setError('Please select your state')
      return
    }
    setStep('school')
    setError('')
  }

  const handleComplete = async () => {
    if (!selectedState) {
      setError('Please select your state')
      setStep('state')
      return
    }

    const primarySchool = multiSelectMode ? selectedSchools[0] : selectedSchool

    if (!primarySchool) {
      setError(multiSelectMode ? 'Please select at least one school' : 'Please select your school')
      return
    }

    console.log('Onboarding: Completing setup', {
      multiSelectMode,
      selectedSchools,
      primarySchool,
      selectedState
    })

    setLoading(true)
    setError('')

    try {
      const state = getStateByCode(selectedState)
      if (!state) {
        throw new Error('State not found')
      }

      const school = state.schools.find((s) => s.id === primarySchool)
      if (!school) {
        throw new Error('School not found')
      }

      // First, ensure the state exists (we'll store it with the school)
      const stateName = state.name

      // Create or get school in database (include state info)
      const schoolResponse = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: `${selectedState}-${primarySchool}`,
          name: school.name,
          logoUrl: school.logo,
          stateCode: selectedState,
          stateName: stateName,
        }),
      })

      if (!schoolResponse.ok) {
        const data = await schoolResponse.json()
        if (data.error && !data.error.includes('already exists')) {
          throw new Error(data.error)
        }
      }

      // Update user profile
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolId: `${selectedState}-${primarySchool}`,
          major: major || undefined,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      // Check if user was changing their school selection
      const urlParams = new URLSearchParams(window.location.search)
      const wasChanging = urlParams.get('change') === 'true'

      router.push(wasChanging ? '/profile' : '/marketplace')
    } catch (error: any) {
      setError(error.message || 'An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || checkingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return null
  }

  const currentState = selectedState ? getStateByCode(selectedState) : null
  const filteredStates = STATES_AND_SCHOOLS.filter((state) =>
    state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    state.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSchools = currentState
    ? currentState.schools.filter(
        (school) =>
          school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) ||
          school.abbreviation.toLowerCase().includes(schoolSearchTerm.toLowerCase())
      )
    : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Step Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div
                className={`flex items-center gap-2 ${
                  step === 'state' ? 'text-primary-600' : 'text-primary-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'state' ? 'bg-primary-600 text-white' : 'bg-primary-200 text-primary-600'
                  }`}
                >
                  1
                </div>
                <span className="font-semibold">Select State</span>
              </div>
              <div className="w-16 h-1 bg-gray-200">
                <div
                  className={`h-full transition-all ${
                    step === 'school' ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                  style={{ width: step === 'school' ? '100%' : '0%' }}
                ></div>
              </div>
              <div
                className={`flex items-center gap-2 ${
                  step === 'school' ? 'text-primary-600' : 'text-gray-400'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step === 'school' ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  2
                </div>
                <span className="font-semibold">Select School</span>
              </div>
            </div>
          </div>

          {/* State Selection Step */}
          {step === 'state' && (
            <>
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <MapPin className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {new URLSearchParams(window.location.search).get('change') === 'true'
                    ? 'Change Your School'
                    : 'Select Your State'
                  }
                </h1>
                <p className="text-gray-600">
                  {new URLSearchParams(window.location.search).get('change') === 'true'
                    ? 'Update your school and state information'
                    : 'Choose the state where your school is located'
                  }
                </p>
              </div>

              {/* State Search */}
                  <div className="mb-6">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search states..."
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* State List */}
                  <div className="mb-6 max-h-96 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {filteredStates.map((state) => (
                      <button
                        key={state.code}
                        onClick={() => handleStateSelect(state.code)}
                        className={`p-4 rounded-lg border-2 transition-all text-left ${
                          selectedState === state.code
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{state.mascot}</span>
                          <div>
                            <div className="font-semibold text-gray-900">{state.name}</div>
                            <div className="text-sm text-gray-500">{state.code}</div>
                          </div>
                          {selectedState === state.code && (
                            <div className="ml-auto w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>

                  {selectedState && (
                    <div className="mb-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">
                            {currentState?.mascot}
                          </span>
                          <div>
                            <div className="font-semibold text-gray-900">
                              Selected: {currentState?.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {currentState?.schools.length} schools available
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={handleContinueToSchools}
                          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                        >
                          Continue <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

          {/* School Selection Step */}
          {step === 'school' && (
            <>
              <div className="text-center mb-8">
                <button
                  onClick={() => setStep('state')}
                  className="absolute left-8 top-8 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
                  <GraduationCap className="w-8 h-8 text-primary-600" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Your School</h1>
                <p className="text-gray-600">
                  Choose your school in {currentState?.name}
                </p>
              </div>

              {/* School Search and Toggle */}
              <div className="mb-6 space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={schoolSearchTerm}
                    onChange={(e) => setSchoolSearchTerm(e.target.value)}
                    placeholder="Search for your school..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                {/* Multi-select Toggle */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700">
                      {multiSelectMode ? 'Multi-select mode' : 'Single selection mode'}
                    </span>
                    <button
                      onClick={toggleMultiSelect}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        multiSelectMode ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          multiSelectMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  {multiSelectMode && (
                    <span className="text-sm text-gray-500">
                      {selectedSchools.length} school{selectedSchools.length !== 1 ? 's' : ''} selected
                    </span>
                  )}
                </div>
              </div>

              {/* Selected Schools (Multi-select mode) */}
              {multiSelectMode && selectedSchools.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Selected Schools</h3>
                  <div className="space-y-2">
                    {selectedSchools.map((schoolId) => {
                      const school = filteredSchools.find(s => s.id === schoolId)
                      return school ? (
                        <div
                          key={schoolId}
                          className="flex items-center justify-between p-3 bg-primary-50 border border-primary-200 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{school.logo}</span>
                            <div>
                              <div className="font-medium text-gray-900">{school.name}</div>
                              <div className="text-sm text-gray-600">{school.abbreviation}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => removeSelectedSchool(schoolId)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
              )}

              {/* School List */}
              <div className="mb-6 max-h-96 overflow-y-auto space-y-2">
                {filteredSchools.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No schools found matching "{schoolSearchTerm}"
                  </div>
                ) : (
                  filteredSchools.map((school) => {
                    const isSelected = multiSelectMode
                      ? selectedSchools.includes(school.id)
                      : selectedSchool === school.id

                    return (
                      <button
                        key={school.id}
                        onClick={() => handleSchoolSelect(school.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                          isSelected
                            ? 'border-primary-500 bg-primary-50'
                            : 'border-gray-200 hover:border-primary-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">{school.logo}</div>
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900">{school.name}</div>
                            <div className="text-sm text-gray-500">{school.abbreviation}</div>
                          </div>
                          {isSelected && (
                            <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                              <svg
                                className="w-4 h-4 text-white"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })
                )}
              </div>

              {/* Major (Optional) */}
              {(selectedSchool || selectedSchools.length > 0) && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Major (Optional)
                  </label>
                  <input
                    type="text"
                    value={major}
                    onChange={(e) => setMajor(e.target.value)}
                    placeholder="e.g., Computer Science, Business, Psychology..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  {multiSelectMode && selectedSchools.length > 1 && (
                    <p className="text-xs text-gray-500 mt-1">
                      Your primary school will be {filteredSchools.find(s => s.id === selectedSchools[0])?.name}
                    </p>
                  )}
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  {error}
                </div>
              )}

              {/* Complete Button */}
              <button
                onClick={handleComplete}
                disabled={(!selectedSchool && selectedSchools.length === 0) || loading}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Setting up...'
                ) : (
                  <>
                    {multiSelectMode && selectedSchools.length > 1
                      ? `Complete Setup (${selectedSchools.length} schools)`
                      : 'Complete Setup'
                    }
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
