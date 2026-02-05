'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { PlatformTable } from '@/components/platform/platform-table'
import { AuthModal } from '@/components/auth/auth-modal'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants'

type Platform = Database['public']['Tables']['platforms']['Row']

export default function Home() {
  const [platforms, setPlatforms] = useState<Platform[]>([])
  const [filteredPlatforms, setFilteredPlatforms] = useState<Platform[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [sortBy, setSortBy] = useState<string>('upvotes')
  const [loading, setLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [userUpvotes, setUserUpvotes] = useState<string[]>([])
  
  const supabase = createClient()

  useEffect(() => {
    fetchPlatforms()
    fetchUserUpvotes()
  }, [])

  useEffect(() => {
    applyFiltersAndSort()
  }, [platforms, searchQuery, categoryFilter, sortBy])

  const fetchPlatforms = async () => {
    try {
      const { data, error } = await supabase
        .from('platforms')
        .select('*')
        .eq('approved', true)

      if (error) throw error
      setPlatforms(data || [])
    } catch (error) {
      console.error('Error fetching platforms:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserUpvotes = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('upvotes')
      .select('platform_id')
      .eq('user_id', user.id)

    if (data && data.length > 0) {
      setUserUpvotes(data.map((upvote: any) => upvote.platform_id))
    }
  }

  const applyFiltersAndSort = () => {
    let filtered = [...platforms]

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (platform) =>
          platform.name.toLowerCase().includes(query) ||
          platform.description.toLowerCase().includes(query) ||
          platform.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    // Apply category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((platform) => platform.category === categoryFilter)
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'upvotes':
          return b.upvote_count - a.upvote_count
        case 'newest':
          return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime()
        case 'mrr':
          return (b.mrr || 0) - (a.mrr || 0)
        default:
          return 0
      }
    })

    setFilteredPlatforms(filtered)
  }

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Discover OpenClaw Platforms
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto">
            The directory of OpenClaw tools and platforms. Discover services, marketplaces, infrastructure, and everything built around OpenClaw.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search platforms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full"
            />
          </div>
          <Select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="md:w-48"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Select>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="md:w-48"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </div>

        {/* Stats */}
        <div className="mb-8 text-sm text-white/60">
          Showing {filteredPlatforms.length} of {platforms.length} platforms
        </div>

        {/* Platform List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-white/60">Loading platforms...</p>
          </div>
        ) : (
          <PlatformTable
            platforms={filteredPlatforms}
            onAuthRequired={() => setIsAuthModalOpen(true)}
            userUpvotes={userUpvotes}
          />
        )}
      </div>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  )
}
