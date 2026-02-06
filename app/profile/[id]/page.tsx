import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProfilePageClient } from './profile-page-client'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name')
    .eq('id', id)
    .single()

  if (!profile) {
    return { title: 'User Not Found - ClawDirectory' }
  }

  return {
    title: `${(profile as any).display_name} - ClawDirectory`,
    description: `${(profile as any).display_name}'s profile on ClawDirectory`,
  }
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single()

  if (!profile) {
    notFound()
  }

  // Fetch submitted platforms
  const { data: platforms } = await supabase
    .from('platforms')
    .select('*')
    .eq('submitted_by', id)
    .eq('approved', true)
    .order('submitted_at', { ascending: false })

  // Count upvotes given
  const { count: upvoteCount } = await supabase
    .from('upvotes')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', id)

  // Count comments
  const { count: commentCount } = await supabase
    .from('comments')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', id)

  return (
    <ProfilePageClient
      profile={profile as any}
      platforms={(platforms as any) || []}
      upvoteCount={upvoteCount || 0}
      commentCount={commentCount || 0}
    />
  )
}
