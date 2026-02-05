'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Database } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { UpvoteButton } from '@/components/platform/upvote-button'
import { formatMRR } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

type Platform = Database['public']['Tables']['platforms']['Row']

interface PlatformTableProps {
  platforms: Platform[]
  onAuthRequired: () => void
  userUpvotes: string[]
}

export function PlatformTable({ platforms, onAuthRequired, userUpvotes }: PlatformTableProps) {
  if (platforms.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/60 text-lg">No platforms found. Try adjusting your filters.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table View */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-4 px-4 text-sm font-medium text-white/60">Platform</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-white/60">Category</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-white/60">MRR</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-white/60">Upvotes</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-white/60">Action</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform) => {
            const category = CATEGORIES.find((c) => c.value === platform.category)
            return (
              <tr
                key={platform.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-4">
                  <Link
                    href={`/platforms/${platform.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                      <Image
                        src={platform.logo_url}
                        alt={`${platform.name} logo`}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium text-white group-hover:text-cyan-400 transition-colors">
                        {platform.name}
                      </h3>
                      <p className="text-sm text-white/60 line-clamp-1 max-w-md">
                        {platform.description}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="secondary">
                    {category?.emoji} {category?.label.replace(/^.\s/, '')}
                  </Badge>
                </td>
                <td className="py-4 px-4">
                  <span className="text-white/80 font-medium">
                    {formatMRR(platform.mrr)}
                  </span>
                </td>
                <td className="py-4 px-4">
                  <UpvoteButton
                    platformId={platform.id}
                    initialUpvoteCount={platform.upvote_count}
                    initialIsUpvoted={userUpvotes.includes(platform.id)}
                    onAuthRequired={onAuthRequired}
                  />
                </td>
                <td className="py-4 px-4 text-right">
                  <a
                    href={platform.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="grid gap-4 md:hidden">
        {platforms.map((platform) => {
          const category = CATEGORIES.find((c) => c.value === platform.category)
          return (
            <Link
              key={platform.id}
              href={`/platforms/${platform.slug}`}
              className="block p-4 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <Image
                    src={platform.logo_url}
                    alt={`${platform.name} logo`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-white mb-1">{platform.name}</h3>
                  <Badge variant="secondary" className="text-xs">
                    {category?.emoji} {category?.label.replace(/^.\s/, '')}
                  </Badge>
                </div>
              </div>
              <p className="text-sm text-white/60 mb-3 line-clamp-2">
                {platform.description}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UpvoteButton
                    platformId={platform.id}
                    initialUpvoteCount={platform.upvote_count}
                    initialIsUpvoted={userUpvotes.includes(platform.id)}
                    onAuthRequired={onAuthRequired}
                  />
                  <span className="text-sm text-white/60">
                    MRR: {formatMRR(platform.mrr)}
                  </span>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
