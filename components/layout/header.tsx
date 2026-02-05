'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { UserMenu } from '@/components/auth/user-menu'
import { AuthModal } from '@/components/auth/auth-modal'

export function Header() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)

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
                href="/submit"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                Submit
              </Link>
              <Link
                href="/about"
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                About
              </Link>
            </nav>

            {/* User Menu */}
            <div className="flex items-center">
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
