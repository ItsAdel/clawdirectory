'use client'

import * as React from 'react'
import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { Button } from '@/components/ui/button'

interface UserMenuProps {
  onSignInClick: () => void
}

export function UserMenu({ onSignInClick }: UserMenuProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
    window.location.href = '/'
  }

  if (!user) {
    return (
      <Button onClick={onSignInClick} variant="primary" size="sm">
        🦞 Sign In
      </Button>
    )
  }

  const initials = user.email
    ?.split('@')[0]
    .substring(0, 2)
    .toUpperCase() || 'U'

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-400 text-white font-semibold text-sm hover:bg-orange-500 transition-colors shadow-md"
      >
        {initials}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-lg bg-white border border-orange-200 shadow-xl py-2 z-50">
          <div className="px-4 py-3 border-b border-orange-200">
            <p className="text-sm font-medium text-orange-900 truncate">
              {user.email}
            </p>
          </div>

          <button
            onClick={() => {
              window.location.href = `/profile/${user.id}`
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-orange-800 hover:bg-orange-50 transition-colors"
          >
            My Profile
          </button>

          <button
            onClick={() => {
              window.location.href = '/bookmarks'
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-orange-800 hover:bg-orange-50 transition-colors"
          >
            Saved
          </button>

          <button
            onClick={() => {
              window.location.href = '/submit'
              setIsOpen(false)
            }}
            className="w-full text-left px-4 py-2 text-sm text-orange-800 hover:bg-orange-50 transition-colors"
          >
            Submit Platform
          </button>

          <div className="border-t border-orange-200 my-1" />

          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
