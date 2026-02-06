'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { AuthModal } from '@/components/auth/auth-modal'
import { formatMRR } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

type Platform = Database['public']['Tables']['platforms']['Row']

interface BookmarkWithPlatform {
  id: string
  platform_id: string
  created_at: string
  platforms: Platform
}

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkWithPlatform[]>([])
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    checkAuthAndFetch()
  }, [])

  const checkAuthAndFetch = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    setUserId(user.id)

    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('id, platform_id, created_at, platforms(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setBookmarks((data as unknown as BookmarkWithPlatform[]) || [])
    } catch (error) {
      console.error('Error fetching bookmarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (bookmarkId: string) => {
    const prev = [...bookmarks]
    setBookmarks((b) => b.filter((bm) => bm.id !== bookmarkId))

    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId)

      if (error) throw error
    } catch (error) {
      console.error('Error removing bookmark:', error)
      setBookmarks(prev)
    }
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Header */}
        <div
          className={`transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors mb-4"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Directory
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-orange-950 tracking-tight">
            Saved Platforms
          </h1>
          <p className="text-sm text-orange-600/60 mt-1">
            Your bookmarked platforms in one place.
          </p>
        </div>

        {/* Content */}
        <div
          className={`mt-8 transition-all duration-700 delay-200 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {loading ? (
            <div className="text-center py-20">
              <div className="inline-flex items-center gap-3 text-orange-500">
                <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
                <span className="text-sm">Loading saved platforms...</span>
              </div>
            </div>
          ) : !userId ? (
            <div className="text-center py-20">
              <p className="text-orange-400 mb-4">Sign in to view your saved platforms.</p>
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Sign In
              </button>
            </div>
          ) : bookmarks.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 mx-auto text-orange-200 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p className="text-orange-400 mb-2">No saved platforms yet.</p>
              <p className="text-sm text-orange-400/60 mb-6">Browse the directory to find platforms worth saving.</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
              >
                Browse Directory
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bookmarks.map((bookmark) => {
                const platform = bookmark.platforms
                if (!platform) return null
                const category = CATEGORIES.find((c) => c.value === platform.category)
                return (
                  <div
                    key={bookmark.id}
                    className="group relative block p-4 rounded-xl bg-white/60 border border-orange-200/40 hover:bg-orange-50/50 transition-colors"
                  >
                    <button
                      onClick={() => handleRemove(bookmark.id)}
                      className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-orange-300 hover:text-red-500 hover:bg-red-50"
                      title="Remove from saved"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>

                    <Link href={`/platforms/${platform.slug}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-orange-50 shrink-0 border border-orange-200/40">
                          <Image
                            src={platform.logo_url}
                            alt={`${platform.name} logo`}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-medium text-orange-900 group-hover:text-orange-500 transition-colors truncate">
                            {platform.name}
                          </h3>
                          {category && (
                            <Badge variant="secondary" className="text-xs">
                              {category.emoji} {category.label.replace(/^.\s/, '')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-orange-700/60 line-clamp-2 leading-relaxed">
                        {platform.description}
                      </p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-orange-400">
                        <span>{formatMRR(platform.mrr)}</span>
                        <span>&middot;</span>
                        <span>{platform.upvote_count} upvotes</span>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
