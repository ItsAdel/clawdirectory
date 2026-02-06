'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { Badge } from '@/components/ui/badge'
import { formatMRR } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

type Platform = Database['public']['Tables']['platforms']['Row']

export default function ComparePage() {
  const searchParams = useSearchParams()
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || []

  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
    if (ids.length >= 2) {
      fetchPlatforms()
    } else {
      setLoading(false)
    }
  }, [])

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .in('id', ids)

      if (error) throw error
      // Preserve the order from URL params
      const ordered = ids
        .map((id) => (data || []).find((p: any) => p.id === id))
        .filter(Boolean) as Platform[]
      setPlatforms(ordered)
    } catch (error) {
      console.error('Error fetching platforms:', error)
    } finally {
      setLoading(false)
    }
  }

  const getCategory = (value: string) =>
    CATEGORIES.find((c) => c.value === value)

  if (loading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center py-20">
          <div className="inline-flex items-center gap-3 text-orange-500">
            <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
            <span className="text-sm">Loading comparison...</span>
          </div>
        </div>
      </div>
    )
  }

  if (platforms.length < 2) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="text-center py-20">
          <p className="text-orange-400 mb-4">Select at least 2 platforms to compare.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium hover:bg-orange-600 transition-colors"
          >
            Back to Directory
          </Link>
        </div>
      </div>
    )
  }

  const rows: { label: string; render: (p: Platform) => React.ReactNode }[] = [
    {
      label: 'Category',
      render: (p) => {
        const cat = getCategory(p.category)
        return (
          <Badge variant="secondary">
            {cat?.emoji} {cat?.label.replace(/^.\s/, '')}
          </Badge>
        )
      },
    },
    {
      label: 'Description',
      render: (p) => (
        <p className="text-sm text-orange-700 leading-relaxed">{p.description}</p>
      ),
    },
    {
      label: 'MRR',
      render: (p) => (
        <span className="text-sm font-semibold text-orange-800">{formatMRR(p.mrr)}</span>
      ),
    },
    {
      label: 'Upvotes',
      render: (p) => (
        <div className="inline-flex items-center gap-1.5 text-sm font-medium text-orange-700">
          <svg className="w-4 h-4 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
          </svg>
          {p.upvote_count}
        </div>
      ),
    },
    {
      label: 'Tags',
      render: (p) => (
        <div className="flex flex-wrap gap-1.5">
          {p.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/60 text-xs text-orange-600"
            >
              {tag}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: 'Website',
      render: (p) => (
        <a
          href={p.website}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
        >
          Visit
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      ),
    },
  ]

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      {/* Header */}
      <div
        className={`mb-8 transition-all duration-700 ease-out ${
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
          Compare Platforms
        </h1>
        <p className="text-sm text-orange-600/60 mt-1">
          Side-by-side comparison of {platforms.length} platforms
        </p>
      </div>

      {/* Comparison Table */}
      <div
        className={`transition-all duration-700 delay-200 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Desktop: table layout */}
        <div className="hidden md:block rounded-2xl bg-white/60 border border-orange-200/40 shadow-sm overflow-hidden">
          <table className="w-full">
            {/* Platform headers */}
            <thead>
              <tr className="border-b border-orange-200/40">
                <th className="w-40 lg:w-48 py-5 px-5 text-left">
                  <span className="text-xs text-orange-500 font-medium tracking-wide uppercase">
                    Platform
                  </span>
                </th>
                {platforms.map((p) => (
                  <th key={p.id} className="py-5 px-5 text-center">
                    <Link href={`/platforms/${p.slug}`} className="group inline-flex flex-col items-center gap-2">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white border border-orange-200/40 shadow-sm">
                        <Image
                          src={p.logo_url}
                          alt={`${p.name} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-semibold text-orange-900 group-hover:text-orange-500 transition-colors">
                        {p.name}
                      </span>
                    </Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.label}
                  className={i !== rows.length - 1 ? 'border-b border-orange-200/20' : ''}
                >
                  <td className="py-4 px-5">
                    <span className="text-xs text-orange-500 font-medium tracking-wide uppercase">
                      {row.label}
                    </span>
                  </td>
                  {platforms.map((p) => (
                    <td key={p.id} className="py-4 px-5 text-center">
                      <div className="flex justify-center">{row.render(p)}</div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile: stacked cards */}
        <div className="md:hidden space-y-4">
          {platforms.map((p) => {
            const cat = getCategory(p.category)
            return (
              <div
                key={p.id}
                className="rounded-2xl bg-white/60 border border-orange-200/40 shadow-sm p-5"
              >
                <Link href={`/platforms/${p.slug}`} className="flex items-center gap-3 mb-4 group">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-white border border-orange-200/40 shrink-0">
                    <Image
                      src={p.logo_url}
                      alt={`${p.name} logo`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold text-orange-900 group-hover:text-orange-500 transition-colors">
                      {p.name}
                    </h3>
                    <Badge variant="secondary" className="text-xs">
                      {cat?.emoji} {cat?.label.replace(/^.\s/, '')}
                    </Badge>
                  </div>
                </Link>

                <p className="text-sm text-orange-700 leading-relaxed mb-3">
                  {p.description}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-xs text-orange-400 uppercase tracking-wide">MRR</span>
                    <p className="font-semibold text-orange-800">{formatMRR(p.mrr)}</p>
                  </div>
                  <div>
                    <span className="text-xs text-orange-400 uppercase tracking-wide">Upvotes</span>
                    <p className="font-semibold text-orange-800">{p.upvote_count}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-3">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-md bg-orange-50 border border-orange-200/60 text-xs text-orange-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <a
                  href={p.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-orange-500 hover:text-orange-600 font-medium transition-colors"
                >
                  Visit Website
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
