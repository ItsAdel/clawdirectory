'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { UpvoteButton } from '@/components/platform/upvote-button'
import { AuthModal } from '@/components/auth/auth-modal'
import { formatMRR, formatDate } from '@/lib/utils'
import { CATEGORIES, CATEGORY_DESCRIPTIONS } from '@/lib/constants'

type Platform = Database['public']['Tables']['platforms']['Row']

interface PlatformDetailClientProps {
  platform: Platform
  initialIsUpvoted: boolean
}

export function PlatformDetailClient({
  platform,
  initialIsUpvoted,
}: PlatformDetailClientProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    incrementViewCount()
  }, [])

  const incrementViewCount = async () => {
    try {
      await (supabase.rpc as any)('increment_view_count', {
        platform_slug: platform.slug,
      })
    } catch (error) {
      console.error('Error incrementing view count:', error)
    }
  }

  const category = CATEGORIES.find((c) => c.value === platform.category)

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        {/* Back */}
        <div
          className={`transition-all duration-500 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-700 transition-colors mb-8 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back to directory
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div
            className={`lg:col-span-2 transition-all duration-700 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            {/* Header */}
            <div className="flex items-start gap-5 mb-8">
              <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-orange-50 shrink-0 border border-orange-200/50">
                <Image
                  src={platform.logo_url}
                  alt={`${platform.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h1 className="text-2xl md:text-3xl font-bold text-orange-950 tracking-tight">
                    {platform.name}
                  </h1>
                  <UpvoteButton
                    platformId={platform.id}
                    initialUpvoteCount={platform.upvote_count}
                    initialIsUpvoted={initialIsUpvoted}
                    onAuthRequired={() => setIsAuthModalOpen(true)}
                  />
                </div>
                <div className="flex items-center gap-2 mb-4">
                  {category && (
                    <Badge variant="default">
                      {category.emoji} {category.label.replace(/^.\s/, '')}
                    </Badge>
                  )}
                  {platform.featured && (
                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                      Featured
                    </Badge>
                  )}
                </div>
                <p className="text-orange-800/60 leading-relaxed">
                  {platform.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {platform.tags && platform.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-3">
                  Tags
                </h2>
                <div className="flex flex-wrap gap-2">
                  {platform.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Category info */}
            {category && (
              <div className="p-4 rounded-xl bg-white/50 border border-orange-200/40">
                <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-1.5">
                  About {category.label.replace(/^.\s/, '')} platforms
                </h2>
                <p className="text-sm text-orange-700/60 leading-relaxed">
                  {CATEGORY_DESCRIPTIONS[platform.category]}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div
            className={`lg:col-span-1 transition-all duration-700 delay-200 ease-out ${
              mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="sticky top-24 space-y-4">
              {/* CTA */}
              <div className="p-5 rounded-2xl bg-white/60 border border-orange-200/40">
                <a
                  href={platform.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors shadow-sm mb-3"
                >
                  Visit website
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-[11px] text-orange-400 text-center truncate">
                  {platform.website}
                </p>
              </div>

              {/* Stats */}
              <div className="p-5 rounded-2xl bg-white/60 border border-orange-200/40">
                <h3 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-4">
                  Stats
                </h3>
                <div className="space-y-3">
                  {platform.mrr !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-orange-700/60">MRR</span>
                      <span className="text-sm font-semibold text-orange-900">
                        {formatMRR(platform.mrr)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700/60">Upvotes</span>
                    <span className="text-sm font-semibold text-orange-600">
                      {platform.upvote_count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-orange-700/60">Views</span>
                    <span className="text-sm font-semibold text-orange-900">
                      {platform.view_count}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-orange-200/40">
                    <span className="text-[11px] text-orange-400">
                      Added {formatDate(platform.submitted_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social */}
              {(platform.twitter || platform.github) && (
                <div className="p-5 rounded-2xl bg-white/60 border border-orange-200/40">
                  <h3 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-4">
                    Connect
                  </h3>
                  <div className="space-y-2.5">
                    {platform.twitter && (
                      <a
                        href={`https://twitter.com/${platform.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-orange-600 hover:text-orange-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                        </svg>
                        <span className="text-sm">{platform.twitter}</span>
                      </a>
                    )}
                    {platform.github && (
                      <a
                        href={`https://github.com/${platform.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2.5 text-orange-600 hover:text-orange-900 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm">{platform.github}</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
