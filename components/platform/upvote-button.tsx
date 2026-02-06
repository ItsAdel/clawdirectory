'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface UpvoteButtonProps {
  platformId: string
  initialUpvoteCount: number
  initialIsUpvoted?: boolean
  onAuthRequired: () => void
}

export function UpvoteButton({
  platformId,
  initialUpvoteCount,
  initialIsUpvoted = false,
  onAuthRequired,
}: UpvoteButtonProps) {
  const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount)
  const [isUpvoted, setIsUpvoted] = useState(initialIsUpvoted)
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    checkUpvoteStatus()
  }, [])

  const checkUpvoteStatus = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('upvotes')
      .select('id')
      .eq('platform_id', platformId)
      .eq('user_id', user.id)
      .single()

    setIsUpvoted(!!data)
  }

  const handleUpvote = async (e: React.MouseEvent) => {
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
      if (isUpvoted) {
        // Remove upvote
        const { error } = await supabase
          .from('upvotes')
          .delete()
          .eq('platform_id', platformId)
          .eq('user_id', user.id)

        if (error) throw error

        setIsUpvoted(false)
        setUpvoteCount((prev) => prev - 1)
      } else {
        // Add upvote
        const { error } = await supabase
          .from('upvotes')
          .insert({ platform_id: platformId, user_id: user.id } as any)

        if (error) throw error

        setIsUpvoted(true)
        setUpvoteCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error toggling upvote:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleUpvote}
      disabled={isLoading}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-colors shadow-sm',
        isUpvoted
          ? 'bg-orange-200 border-orange-400 text-orange-800'
          : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-50',
        isLoading && 'opacity-50 cursor-not-allowed'
      )}
    >
      <svg
        className="w-4 h-4"
        fill={isUpvoted ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <span className="text-sm font-medium">{upvoteCount}</span>
    </button>
  )
}
