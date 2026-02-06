import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PlatformDetailClient } from './platform-detail-client'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()

  const { data: platform } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  if (!platform) {
    return {
      title: 'Platform Not Found - ClawDirectory',
    }
  }

  return {
    title: `${(platform as any).name} - ClawDirectory`,
    description: (platform as any).description,
    openGraph: {
      title: `${(platform as any).name} - ClawDirectory`,
      description: (platform as any).description,
      images: [(platform as any).logo_url],
    },
  }
}

export default async function PlatformPage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: platform } = await supabase
    .from('platforms')
    .select('*')
    .eq('slug', slug)
    .eq('approved', true)
    .single()

  if (!platform) {
    notFound()
  }

  // Get user's upvote status and bookmark status
  const {
    data: { user },
  } = await supabase.auth.getUser()

  let isUpvoted = false
  let isBookmarked = false
  if (user) {
    const { data: upvote } = await supabase
      .from('upvotes')
      .select('id')
      .eq('platform_id', (platform as any).id)
      .eq('user_id', user.id)
      .single()

    isUpvoted = !!upvote

    const { data: bookmark } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('platform_id', (platform as any).id)
      .eq('user_id', user.id)
      .single()

    isBookmarked = !!bookmark
  }

  // Fetch similar platforms
  const { data: alternatives } = await supabase
    .from('platforms')
    .select('id, name, slug, logo_url, category, description, upvote_count')
    .eq('category', (platform as any).category)
    .eq('approved', true)
    .neq('id', (platform as any).id)
    .order('upvote_count', { ascending: false })
    .limit(4)

  return (
    <PlatformDetailClient
      platform={platform as any}
      initialIsUpvoted={isUpvoted}
      initialIsBookmarked={isBookmarked}
      alternatives={(alternatives as any) || []}
    />
  )
}
