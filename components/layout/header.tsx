'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { UserMenu } from '@/components/auth/user-menu'
import { AuthModal } from '@/components/auth/auth-modal'
import { Button } from '@/components/ui/button'

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    checkAuth()
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
      <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-black/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl">🦞</span>
              <span className="text-xl font-bold text-white">
                ClawDirectory
              </span>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                About
              </Link>
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleSubmitClick}
                variant="primary"
                size="sm"
                className="hidden md:inline-flex"
              >
                Submit Platform
              </Button>
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
