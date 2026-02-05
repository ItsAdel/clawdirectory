'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { Button } from '@/components/ui/button'
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
  const supabase = createClient()

  useEffect(() => {
    // Increment view count
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to directory
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Header */}
            <div className="flex items-start gap-6 mb-8">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-white/5 flex-shrink-0">
                <Image
                  src={platform.logo_url}
                  alt={`${platform.name} logo`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="text-3xl md:text-4xl font-bold text-white">
                    {platform.name}
                  </h1>
                  <UpvoteButton
                    platformId={platform.id}
                    initialUpvoteCount={platform.upvote_count}
                    initialIsUpvoted={initialIsUpvoted}
                    onAuthRequired={() => setIsAuthModalOpen(true)}
                  />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  {category && (
                    <Badge variant="default">
                      {category.emoji} {category.label.replace(/^.\s/, '')}
                    </Badge>
                  )}
                  {platform.featured && (
                    <Badge variant="outline" className="text-cyan-400 border-cyan-500/50">
                      ⭐ Featured
                    </Badge>
                  )}
                </div>
                <p className="text-lg text-white/80 leading-relaxed">
                  {platform.description}
                </p>
              </div>
            </div>

            {/* Tags */}
            {platform.tags && platform.tags.length > 0 && (
              <div className="mb-8">
                <h2 className="text-sm font-semibold text-white/60 mb-3 uppercase tracking-wide">
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

            {/* Category Description */}
            {category && (
              <div className="mb-8 p-4 rounded-lg bg-white/5 border border-white/10">
                <h2 className="text-sm font-semibold text-white mb-2">
                  About {category.label.replace(/^.\s/, '')} Platforms
                </h2>
                <p className="text-sm text-white/60">
                  {CATEGORY_DESCRIPTIONS[platform.category]}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* CTA */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-500/5 border border-cyan-500/30">
                <Button
                  className="w-full mb-3"
                  onClick={() => window.open(platform.website, '_blank')}
                >
                  Visit Website
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </Button>
                <a
                  href={platform.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-center text-cyan-400/80 hover:text-cyan-400 transition-colors truncate"
                >
                  {platform.website}
                </a>
              </div>

              {/* Stats */}
              <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">
                  Stats
                </h3>
                <div className="space-y-4">
                  {platform.mrr !== null && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-white/60">MRR</span>
                      <span className="text-lg font-semibold text-white">
                        {formatMRR(platform.mrr)}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Upvotes</span>
                    <span className="text-lg font-semibold text-cyan-400">
                      {platform.upvote_count}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white/60">Views</span>
                    <span className="text-lg font-semibold text-white">
                      {platform.view_count}
                    </span>
                  </div>
                  <div className="pt-4 border-t border-white/10">
                    <span className="text-xs text-white/40">
                      Added {formatDate(platform.submitted_at)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              {(platform.twitter || platform.github) && (
                <div className="p-6 rounded-xl bg-white/5 border border-white/10">
                  <h3 className="text-sm font-semibold text-white/60 mb-4 uppercase tracking-wide">
                    Connect
                  </h3>
                  <div className="space-y-3">
                    {platform.twitter && (
                      <a
                        href={`https://twitter.com/${platform.twitter.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
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
                        className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path
                            fillRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                            clipRule="evenodd"
                          />
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
