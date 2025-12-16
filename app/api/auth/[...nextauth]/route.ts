// NextAuth disabled - using Supabase auth instead
import { NextResponse } from 'next/server'

const handler = () => NextResponse.json({ error: 'Auth not available' }, { status: 404 })

export { handler as GET, handler as POST }

