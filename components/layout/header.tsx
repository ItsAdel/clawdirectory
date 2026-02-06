'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import { AuthModal } from '@/components/auth/auth-modal'

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const checkAuth = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    setIsLoggedIn(!!user)
  }

  const handleSubmitClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isLoggedIn) {
      setIsAuthModalOpen(true)
    } else {
      router.push('/submit')
    }
  }

  return (
    <>
      <header
        className={`fixed top-0 z-40 w-full transition-all duration-500 ${
          scrolled
            ? 'bg-white/70 backdrop-blur-xl border-b border-orange-200/50 shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="group flex items-center gap-2.5">
              <span className="text-2xl transition-transform duration-300 group-hover:rotate-12">
                🦞
              </span>
              <span className="text-lg font-semibold text-orange-900 tracking-tight">
                ClawDirectory
              </span>
            </Link>

            {/* Right Side */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleSubmitClick}
                className="hidden md:inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-orange-700 hover:text-orange-900 rounded-full hover:bg-orange-100/60 transition-all duration-300"
              >
                Submit
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <UserMenu onSignInClick={() => setIsAuthModalOpen(true)} />
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
