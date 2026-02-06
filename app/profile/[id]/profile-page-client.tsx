'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { formatDate, formatMRR } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

type Profile = Database['public']['Tables']['profiles']['Row']
type Platform = Database['public']['Tables']['platforms']['Row']

interface ProfilePageClientProps {
  profile: Profile
  platforms: Platform[]
  upvoteCount: number
  commentCount: number
}

export function ProfilePageClient({
  profile,
  platforms,
  upvoteCount,
  commentCount,
}: ProfilePageClientProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const initials = profile.display_name.substring(0, 2).toUpperCase()

  return (
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

      {/* Profile Header */}
      <div
        className={`transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="flex items-start gap-5 mb-8">
          {profile.avatar_url ? (
            <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border-2 border-orange-200">
              <Image
                src={profile.avatar_url}
                alt={profile.display_name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange-100 text-orange-600 text-lg font-bold flex items-center justify-center shrink-0 border-2 border-orange-200">
              {initials}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-orange-950 tracking-tight">
              {profile.display_name}
            </h1>
            {profile.bio && (
              <p className="text-sm text-orange-700/60 mt-1 leading-relaxed max-w-lg">
                {profile.bio}
              </p>
            )}
            <p className="text-xs text-orange-400 mt-2">
              Joined {formatDate(profile.created_at)}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-10 max-w-md">
          <div className="p-4 rounded-xl bg-white/60 border border-orange-200/40 text-center">
            <p className="text-xl font-bold text-orange-900">{platforms.length}</p>
            <p className="text-xs text-orange-500 mt-0.5">Platforms</p>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-orange-200/40 text-center">
            <p className="text-xl font-bold text-orange-900">{upvoteCount}</p>
            <p className="text-xs text-orange-500 mt-0.5">Upvotes</p>
          </div>
          <div className="p-4 rounded-xl bg-white/60 border border-orange-200/40 text-center">
            <p className="text-xl font-bold text-orange-900">{commentCount}</p>
            <p className="text-xs text-orange-500 mt-0.5">Comments</p>
          </div>
        </div>
      </div>

      {/* Submitted Platforms */}
      <div
        className={`transition-all duration-700 delay-200 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-4">
          Submitted Platforms
        </h2>

        {platforms.length === 0 ? (
          <p className="text-sm text-orange-400/60 py-8 text-center">
            No platforms submitted yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const category = CATEGORIES.find((c) => c.value === platform.category)
              return (
                <Link
                  key={platform.id}
                  href={`/platforms/${platform.slug}`}
                  className="group block p-4 rounded-xl bg-white/60 border border-orange-200/40 hover:bg-orange-50/50 transition-colors"
                >
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
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
