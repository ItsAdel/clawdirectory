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
            const isPending = !platform.approved
            return (
              <tr
                key={platform.id}
                className={`border-b border-white/5 transition-colors ${
                  isPending 
                    ? 'bg-yellow-500/5 hover:bg-yellow-500/10 border-yellow-500/20' 
                    : 'hover:bg-white/5'
                }`}
              >
                <td className="py-4 px-4">
                  <Link
                    href={`/platforms/${platform.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className={`relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 ${
                      isPending ? 'opacity-60' : ''
                    }`}>
                      <Image
                        src={platform.logo_url}
                        alt={`${platform.name} logo`}
                        fill
                        className="object-cover"
                      />
                      {isPending && (
                        <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px]" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className={`font-medium group-hover:text-cyan-400 transition-colors ${
                          isPending ? 'text-white/70' : 'text-white'
                        }`}>
                          {platform.name}
                        </h3>
                        {isPending && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                            Pending
                          </span>
                        )}
                      </div>
                      <p className={`text-sm line-clamp-1 max-w-md ${
                        isPending ? 'text-white/40' : 'text-white/60'
                      }`}>
                        {platform.description}
                      </p>
                    </div>
                  </Link>
                </td>
                <td className="py-4 px-4">
                  <Badge variant="secondary" className={isPending ? 'opacity-60' : ''}>
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
          const isPending = !platform.approved
          return (
            <Link
              key={platform.id}
              href={`/platforms/${platform.slug}`}
              className={`block p-4 rounded-lg border transition-colors ${
                isPending
                  ? 'bg-yellow-500/5 border-yellow-500/20 hover:bg-yellow-500/10'
                  : 'bg-white/5 border-white/10 hover:bg-white/10'
              }`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className={`relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0 ${
                  isPending ? 'opacity-60' : ''
                }`}>
                  <Image
                    src={platform.logo_url}
                    alt={`${platform.name} logo`}
                    fill
                    className="object-cover"
                  />
                  {isPending && (
                    <div className="absolute inset-0 bg-yellow-500/10 backdrop-blur-[1px]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium ${isPending ? 'text-white/70' : 'text-white'}`}>
                      {platform.name}
                    </h3>
                    {isPending && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
                        Pending
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary" className={`text-xs ${isPending ? 'opacity-60' : ''}`}>
                    {category?.emoji} {category?.label.replace(/^.\s/, '')}
                  </Badge>
                </div>
              </div>
              <p className={`text-sm mb-3 line-clamp-2 ${
                isPending ? 'text-white/40' : 'text-white/60'
              }`}>
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
