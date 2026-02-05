import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Fetch all approved platforms
  const { data: platforms } = await supabase
    .from('platforms')
    .select('slug, updated_at')
    .eq('approved', true)

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://clawdirectory.com'

  const platformUrls =
    platforms?.map((platform: any) => ({
      url: `${baseUrl}/platforms/${platform.slug}`,
      lastModified: new Date(platform.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || []

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...platformUrls,
  ]
}
