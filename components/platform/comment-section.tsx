'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/types/database'
import { timeAgo } from '@/lib/utils'

type Comment = Database['public']['Tables']['comments']['Row']

interface CommentSectionProps {
  platformId: string
  onAuthRequired: () => void
}

export function CommentSection({ platformId, onAuthRequired }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  useEffect(() => {
    fetchComments()
    fetchUser()
  }, [])

  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUserId(user.id)
      setUserEmail(user.email ?? null)
    }
  }

  const fetchComments = async () => {
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('platform_id', platformId)
        .order('created_at', { ascending: true })

      if (error) throw error
      setComments((data as unknown as Comment[]) || [])
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!newComment.trim() || submitting) return

    if (!userId || !userEmail) {
      onAuthRequired()
      return
    }

    setSubmitting(true)
    const body = newComment.trim()

    // Optimistic insert
    const optimisticComment: Comment = {
      id: `temp-${Date.now()}`,
      platform_id: platformId,
      user_id: userId,
      user_email: userEmail,
      body,
      created_at: new Date().toISOString(),
    }
    setComments((prev) => [...prev, optimisticComment])
    setNewComment('')

    try {
      const { data, error } = await supabase
        .from('comments')
        .insert({
          platform_id: platformId,
          user_id: userId,
          user_email: userEmail,
          body,
        } as any)
        .select()
        .single()

      if (error) throw error

      // Replace optimistic with real
      setComments((prev) =>
        prev.map((c) => (c.id === optimisticComment.id ? (data as unknown as Comment) : c))
      )
    } catch (error) {
      console.error('Error posting comment:', error)
      // Rollback
      setComments((prev) => prev.filter((c) => c.id !== optimisticComment.id))
      setNewComment(body)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (commentId: string) => {
    const prev = [...comments]
    setComments((c) => c.filter((comment) => comment.id !== commentId))

    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error
    } catch (error) {
      console.error('Error deleting comment:', error)
      setComments(prev)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit()
    }
  }

  const getInitials = (email: string) =>
    email.split('@')[0].substring(0, 2).toUpperCase()

  const getDisplayName = (email: string) =>
    email.split('@')[0]

  return (
    <div className="mt-10">
      <div className="flex items-center gap-3 mb-5">
        <h2 className="text-xs text-orange-500 font-medium tracking-wide uppercase">
          Discussion
        </h2>
        {comments.length > 0 && (
          <span className="text-[11px] text-orange-400 bg-orange-100/60 px-2 py-0.5 rounded-full font-medium">
            {comments.length}
          </span>
        )}
      </div>

      {/* Comments list */}
      <div className="space-y-0">
        {loading ? (
          <div className="py-8 text-center">
            <div className="inline-flex items-center gap-3 text-orange-400">
              <div className="w-3.5 h-3.5 border-2 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
              <span className="text-xs">Loading comments...</span>
            </div>
          </div>
        ) : comments.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm text-orange-400/60">No comments yet. Be the first.</p>
          </div>
        ) : (
          comments.map((comment, i) => (
            <div
              key={comment.id}
              className={`group flex gap-3 py-4 animate-view-enter ${
                i !== comments.length - 1 ? 'border-b border-orange-200/30' : ''
              }`}
            >
              {/* Avatar */}
              <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 text-[11px] font-semibold flex items-center justify-center">
                {getInitials(comment.user_email)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-orange-900">
                    {getDisplayName(comment.user_email)}
                  </span>
                  <span className="text-[11px] text-orange-400">
                    {timeAgo(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-orange-800/70 leading-relaxed whitespace-pre-wrap break-words">
                  {comment.body}
                </p>
              </div>

              {/* Delete */}
              {userId === comment.user_id && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-50 text-orange-300 hover:text-red-500"
                  title="Delete comment"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input area */}
      <div className="mt-4 pt-4 border-t border-orange-200/30">
        {userId ? (
          <div>
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Share your thoughts..."
              maxLength={2000}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-orange-200/50 bg-white/40 text-sm text-orange-900 placeholder:text-orange-400/50 focus:outline-none focus:ring-2 focus:ring-orange-400/50 focus:border-transparent resize-none transition-all"
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-orange-400">
                {newComment.length > 0 && `${newComment.length}/2000`}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-orange-300 hidden sm:block">
                  {navigator.platform?.includes('Mac') ? '⌘' : 'Ctrl'}+Enter to submit
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting || !newComment.trim()}
                  className="px-4 py-1.5 rounded-lg bg-orange-500 text-white text-xs font-medium hover:bg-orange-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Posting...' : 'Comment'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={onAuthRequired}
            className="w-full py-3 rounded-xl border border-dashed border-orange-200/60 text-sm text-orange-500 hover:text-orange-700 hover:border-orange-300 transition-colors"
          >
            Sign in to join the discussion
          </button>
        )}
      </div>
    </div>
  )
}
