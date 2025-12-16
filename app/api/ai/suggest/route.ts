import { NextResponse } from 'next/server'

// Category keywords mapping
const CATEGORY_KEYWORDS: Record<string, string[]> = {
  tutoring: ['tutor', 'tutoring', 'teach', 'help with', 'study', 'homework', 'exam', 'test'],
  'essay editing': ['essay', 'paper', 'writing', 'edit', 'proofread', 'grammar', 'thesis'],
  'moving help': ['move', 'moving', 'furniture', 'luggage', 'transport', 'carry'],
  'resume review': ['resume', 'cv', 'cover letter', 'job application', 'career'],
  'graphic design': ['design', 'logo', 'poster', 'flyer', 'graphic', 'photoshop', 'illustrator'],
  'class notes': ['notes', 'lecture', 'class', 'study guide', 'summary'],
  photography: ['photo', 'photography', 'pictures', 'photos', 'camera', 'shoot'],
  'web development': ['website', 'web', 'coding', 'programming', 'app', 'developer'],
}

// Price ranges by category (in USD)
const CATEGORY_PRICES: Record<string, { min: number; max: number; avg: number }> = {
  tutoring: { min: 15, max: 50, avg: 30 },
  'essay editing': { min: 20, max: 100, avg: 50 },
  'moving help': { min: 25, max: 150, avg: 75 },
  'resume review': { min: 15, max: 75, avg: 40 },
  'graphic design': { min: 30, max: 200, avg: 100 },
  'class notes': { min: 5, max: 30, avg: 15 },
  photography: { min: 50, max: 300, avg: 150 },
  'web development': { min: 50, max: 500, avg: 200 },
}

export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      )
    }

    const lowerDescription = description.toLowerCase()

    // Auto-detect category
    let detectedCategory: string | null = null
    let maxMatches = 0

    for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
      const matches = keywords.filter((keyword) => lowerDescription.includes(keyword)).length
      if (matches > maxMatches) {
        maxMatches = matches
        detectedCategory = category
      }
    }

    // Suggest price based on category
    let suggestedPrice: number | null = null
    if (detectedCategory && CATEGORY_PRICES[detectedCategory]) {
      const priceRange = CATEGORY_PRICES[detectedCategory]
      suggestedPrice = priceRange.avg

      // Adjust based on description length (longer descriptions might indicate more complex work)
      const wordCount = description.split(/\s+/).length
      if (wordCount > 100) {
        suggestedPrice = Math.min(priceRange.max, suggestedPrice * 1.2)
      } else if (wordCount < 30) {
        suggestedPrice = Math.max(priceRange.min, suggestedPrice * 0.8)
      }
    }

    return NextResponse.json({
      category: detectedCategory,
      price: suggestedPrice ? Math.round(suggestedPrice) : null,
    })
  } catch (error) {
    console.error('Error generating AI suggestions:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

