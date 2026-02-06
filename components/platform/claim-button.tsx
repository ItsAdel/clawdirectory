'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { VerifiedBadge } from './verified-badge'

interface ClaimButtonProps {
  platformId: string
  claimedBy: string | null
  onAuthRequired: () => void
}

export function ClaimButton({ platformId, claimedBy, onAuthRequired }: ClaimButtonProps) {
  const [status, setStatus] = useState<'unclaimed' | 'pending' | 'claimed'>('unclaimed')
  const [showForm, setShowForm] = useState(false)
  const [proofUrl, setProofUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    checkStatus()
  }, [])

  const checkStatus = async () => {
    if (claimedBy) {
      setStatus('claimed')
      return
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return
    setUserId(user.id)

    // Check if user has a pending claim
    const { data: claim } = await supabase
      .from('platform_claims')
      .select('status')
      .eq('platform_id', platformId)
      .eq('user_id', user.id)
      .single()

    if (claim) {
      setStatus((claim as any).status === 'pending' ? 'pending' : 'unclaimed')
    }
  }

  const handleSubmit = async () => {
    if (!proofUrl.trim() || submitting) return

    if (!userId) {
      onAuthRequired()
      return
    }

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('platform_claims')
        .insert({
          platform_id: platformId,
          user_id: userId,
          proof_url: proofUrl.trim(),
        } as any)

      if (error) throw error
      setStatus('pending')
      setShowForm(false)
    } catch (error) {
      console.error('Error submitting claim:', error)
    } finally {
      setSubmitting(false)
    }
  }

  if (status === 'claimed') {
    return null // Verified badge shown elsewhere
  }

  if (status === 'pending') {
    return (
      <div className="p-5 rounded-2xl bg-yellow-50/60 border border-yellow-200/60">
        <div className="flex items-center gap-2 text-sm text-yellow-700 font-medium">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Claim Pending Review
        </div>
        <p className="text-xs text-yellow-600/70 mt-1">
          We'll review your claim and verify ownership.
        </p>
      </div>
    )
  }

  return (
    <div className="p-5 rounded-2xl bg-white/60 border border-orange-200/40">
      <h3 className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-3">
        Own this platform?
      </h3>
      {!showForm ? (
        <button
          onClick={() => {
            if (!userId) {
              onAuthRequired()
              return
            }
            setShowForm(true)
          }}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-dashed border-orange-200/60 text-sm text-orange-500 hover:text-orange-700 hover:border-orange-300 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          Claim this platform
        </button>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-orange-600/60">
            Provide a link that proves you own this platform (tweet, DNS record, about page, etc.)
          </p>
          <input
            type="url"
            value={proofUrl}
            onChange={(e) => setProofUrl(e.target.value)}
            placeholder="https://..."
            className="w-full px-3 py-2 rounded-lg border border-orange-200/50 bg-white/40 text-sm text-orange-900 placeholder:text-orange-400/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent"
          />
          <div className="flex gap-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-orange-500 hover:bg-orange-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!proofUrl.trim() || submitting}
              className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Claim'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
