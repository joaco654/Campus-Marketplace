import Link from 'next/link'
import { Sparkles, Users, DollarSign, Heart } from 'lucide-react'

export default function WelcomePage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-10">
      {/* Floating glow accents */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-10 mx-auto h-40 max-w-lg rounded-full bg-primary-500/20 blur-3xl" />
      </div>

      <div className="max-w-5xl w-full text-center space-y-10 animate-fade-in">
        {/* Main Heading */}
        <div className="space-y-6">
          <div className="flex justify-center">
            <div className="glass-panel card-shadow-soft rounded-full p-4 animate-scale-in">
              <Sparkles className="w-12 h-12 text-primary-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-balance tracking-tight text-gray-900">
            Earn, Learn, and Help Your
            <br />
            <span className="bg-gradient-to-r from-sky-500 via-emerald-500 to-amber-500 bg-clip-text text-transparent">
              Campus Community
            </span>
          </h1>
          <p className="text-lg md:text-2xl text-gray-700 mt-4 max-w-2xl mx-auto">
            Connect with students on your campus. Offer services, find help, and build relationships that go beyond class.
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 animate-slide-up">
          <div className="glass-panel rounded-2xl p-6 card-shadow-soft hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300">
            <DollarSign className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn on Your Terms</h3>
            <p className="text-gray-700">
              Offer tutoring, design, moving help and more to students who actually need it.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6 card-shadow-soft hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300 delay-75">
            <Users className="w-10 h-10 text-sky-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Find Reliable Help</h3>
            <p className="text-gray-700">
              Search by category, price, and school to find trusted campus talent.
            </p>
          </div>
          <div className="glass-panel rounded-2xl p-6 card-shadow-soft hover:-translate-y-1 hover:shadow-2xl transition-transform duration-300 delay-150">
            <Heart className="w-10 h-10 text-rose-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Build Community</h3>
            <p className="text-gray-700">
              Support classmates, grow your network, and make campus feel smaller.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="mt-10 animate-fade-in-delayed">
          <Link
            href="/auth/signin"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-8 py-4 text-lg font-semibold text-white shadow-xl shadow-primary-500/30 transition-all duration-300 hover:scale-[1.03] hover:bg-primary-700 hover:shadow-2xl"
          >
            Get Started
          </Link>
        </div>

        {/* Footer Note */}
        <p className="text-gray-600 text-sm mt-6">
          Join students across multiple campuses sharing skills, time, and opportunities.
        </p>
      </div>
    </div>
  )
}

