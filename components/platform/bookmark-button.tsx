'use client'

import * as React from 'react'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface BookmarkButtonProps {
  platformId: string
  initialIsBookmarked?: boolean
  onAuthRequired: () => void
}

export function BookmarkButton({
  platformId,
  initialIsBookmarked = false,
  onAuthRequired,
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(initialIsBookmarked)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      onAuthRequired()
      return
    }

    if (isLoading) return
    setIsLoading(true)

    try {
      if (isBookmarked) {
        const { error } = await supabase
          .from('bookmarks')
          .delete()
          .eq('platform_id', platformId)
          .eq('user_id', user.id)

        if (error) throw error
        setIsBookmarked(false)
      } else {
        const { error } = await supabase
          .from('bookmarks')
          .insert({ platform_id: platformId, user_id: user.id } as any)

        if (error) throw error
        setIsBookmarked(true)
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      title={isBookmarked ? 'Remove from saved' : 'Save platform'}
      className={cn(
        'flex items-center justify-center w-9 h-9 rounded-lg border transition-colors shadow-sm',
        isBookmarked
          ? 'bg-orange-200 border-orange-400 text-orange-800'
          : 'bg-white border-orange-200 text-orange-400 hover:text-orange-600 hover:bg-orange-50',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <svg
        className="w-4 h-4"
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
        />
      </svg>
    </button>
  )
}
