'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { PlatformTable } from '@/components/platform/platform-table'
import { AuthModal } from '@/components/auth/auth-modal'
import { GlobeView } from '@/components/analytics/globe-view'
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
  const [activeView, setActiveView] = useState<'list' | 'globe'>('list')
  const [mounted, setMounted] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    setMounted(true)
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
    setIsAdmin(!!user)
  }

  const fetchPlatforms = async () => {
    try {
      let query = supabase.from('platforms').select('*')

      if (showPending) {
        // Show ALL platforms (both approved and pending) when toggle is on
      } else {
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

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (platform) =>
          platform.name.toLowerCase().includes(query) ||
          platform.description.toLowerCase().includes(query) ||
          platform.tags.some((tag) => tag.toLowerCase().includes(query))
      )
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((platform) => platform.category === categoryFilter)
    }

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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Hero */}
        <div
          className={`text-center mb-10 transition-all duration-700 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100/80 border border-orange-200/60 text-xs text-orange-700 font-medium mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
            </span>
            {platforms.length} platforms and counting
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-orange-950 mb-4 tracking-tight leading-tight">
            Discover OpenClaw
            <br />
            <span className="bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              Platforms
            </span>
          </h1>
          <p className="text-base md:text-lg text-orange-800/60 max-w-lg mx-auto leading-relaxed">
            The directory for tools, services, and infrastructure
            built around the OpenClaw ecosystem.
          </p>
        </div>

        {/* View Toggle */}
        <div
          className={`flex items-center justify-center mb-8 transition-all duration-700 delay-200 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <div className="relative flex bg-white/50 backdrop-blur-sm rounded-full p-1 border border-orange-200/40 shadow-sm">
            <div
              className="absolute top-1 bottom-1 rounded-full bg-orange-500 shadow-lg transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]"
              style={{
                left: activeView === 'list' ? '4px' : 'calc(50%)',
                width: 'calc(50% - 4px)',
              }}
            />
            <button
              onClick={() => setActiveView('list')}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeView === 'list' ? 'text-white' : 'text-orange-600 hover:text-orange-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              Directory
            </button>
            <button
              onClick={() => setActiveView('globe')}
              className={`relative z-10 flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                activeView === 'globe' ? 'text-white' : 'text-orange-600 hover:text-orange-900'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Globe
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div
          className={`transition-all duration-700 delay-300 ease-out ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          {/* Globe View */}
          {activeView === 'globe' && (
            <div className="max-w-5xl mx-auto mb-8 animate-view-enter">
              <GlobeView />
            </div>
          )}

          {/* List View */}
          {activeView === 'list' && (
            <div className="animate-view-enter">
              {/* Filters */}
              <div className="mb-6 space-y-3">
                <div className="flex flex-col md:flex-row gap-3">
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

                {/* Pending Toggle */}
                {isAdmin && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPending(!showPending)}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
                        showPending
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
                          : 'bg-white/60 text-orange-600 border border-orange-200 hover:bg-orange-50'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        showPending ? 'border-yellow-600 bg-yellow-300' : 'border-orange-300'
                      }`}>
                        {showPending && (
                          <svg className="w-2 h-2 text-yellow-800" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </div>
                      Show Pending
                    </button>
                    {showPending && (
                      <span className="text-[11px] text-yellow-700 font-medium">
                        {filteredPlatforms.filter(p => !p.approved).length} pending
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Stats */}
              <div className="mb-5 text-xs text-orange-500 font-medium tracking-wide uppercase">
                {filteredPlatforms.length} of {platforms.length} platforms
              </div>

              {/* Platform List */}
              {loading ? (
                <div className="text-center py-16">
                  <div className="inline-flex items-center gap-3 text-orange-500">
                    <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
                    <span className="text-sm">Loading platforms...</span>
                  </div>
                </div>
              ) : (
                <PlatformTable
                  platforms={filteredPlatforms}
                  onAuthRequired={() => setIsAuthModalOpen(true)}
                  userUpvotes={userUpvotes}
                />
              )}
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
