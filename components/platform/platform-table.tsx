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
        <p className="text-orange-700 text-lg">🦞 No platforms found. Try adjusting your filters!</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      {/* Desktop Table View */}
      <table className="w-full hidden md:table bg-white rounded-lg shadow-md overflow-hidden">
        <thead>
          <tr className="border-b-2 border-orange-300 bg-orange-50">
            <th className="text-left py-4 px-4 text-sm font-medium text-orange-700">Platform</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-orange-700">Category</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-orange-700">MRR</th>
            <th className="text-left py-4 px-4 text-sm font-medium text-orange-700">Upvotes</th>
            <th className="text-right py-4 px-4 text-sm font-medium text-orange-700">Action</th>
          </tr>
        </thead>
        <tbody>
          {platforms.map((platform) => {
            const category = CATEGORIES.find((c) => c.value === platform.category)
            const isPending = !platform.approved
            return (
              <tr
                key={platform.id}
                className={`border-b border-orange-200 transition-colors ${
                  isPending 
                    ? 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300' 
                    : 'bg-white hover:bg-orange-50'
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
                        <h3 className={`font-medium group-hover:text-orange-500 transition-colors ${
                          isPending ? 'text-orange-700' : 'text-orange-900'
                        }`}>
                          {platform.name}
                        </h3>
                        {isPending && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 border border-yellow-400">
                            ⏳ Pending
                          </span>
                        )}
                      </div>
                      <p className={`text-sm line-clamp-1 max-w-md ${
                        isPending ? 'text-orange-600' : 'text-orange-700'
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
                  <span className="text-orange-800 font-medium">
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
                    className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 transition-colors font-medium"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Visit 🔗
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
              className={`block p-4 rounded-lg border transition-colors shadow-sm ${
                isPending
                  ? 'bg-yellow-100/50 border-yellow-300 hover:bg-yellow-100'
                  : 'bg-white border-orange-200 hover:bg-orange-50'
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
                    <h3 className={`font-medium ${isPending ? 'text-orange-700' : 'text-orange-900'}`}>
                      {platform.name}
                    </h3>
                    {isPending && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-200 text-yellow-800 border border-yellow-400">
                        ⏳ Pending
                      </span>
                    )}
                  </div>
                  <Badge variant="secondary" className={`text-xs ${isPending ? 'opacity-60' : ''}`}>
                    {category?.emoji} {category?.label.replace(/^.\s/, '')}
                  </Badge>
                </div>
              </div>
              <p className={`text-sm mb-3 line-clamp-2 ${
                isPending ? 'text-orange-600' : 'text-orange-700'
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
                  <span className="text-sm text-orange-700 font-medium">
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
