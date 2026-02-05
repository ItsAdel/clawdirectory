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
  const [showPending, setShowPending] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  
  const supabase = createClient()

  useEffect(() => {
    checkAdmin()
    fetchPlatforms()
    fetchUserUpvotes()
  }, [])

  useEffect(() => {
    fetchPlatforms()
  }, [showPending])

  useEffect(() => {
    applyFiltersAndSort()
  }, [platforms, searchQuery, categoryFilter, sortBy])

  const checkAdmin = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    // For MVP, everyone can see the toggle (even logged out users)
    // You can change this to only show for admins later
    setIsAdmin(true)
  }

  const fetchPlatforms = async () => {
    try {
      let query = supabase.from('platforms').select('*')

      if (showPending) {
        // Show ALL platforms (both approved and pending) when toggle is on
        // No filter - fetch everything
      } else {
        // Show only approved platforms when toggle is off
        query = query.eq('approved', true)
      }

      const { data, error } = await query

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
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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

          {/* Pending Toggle - Only show if user is logged in */}
          {isAdmin && (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPending(!showPending)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showPending
                    ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                    : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
                }`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                  showPending ? 'border-yellow-400 bg-yellow-500/20' : 'border-white/30'
                }`}>
                  {showPending && (
                    <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                Show Your Pending Approvals
              </button>
              {showPending && (
                <span className="text-xs text-yellow-400/80">
                  {filteredPlatforms.filter(p => !p.approved).length} pending
                </span>
              )}
            </div>
          )}
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
