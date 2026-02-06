'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { generateSlug } from '@/lib/utils'
import { CATEGORIES } from '@/lib/constants'

export default function SubmitPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const [formData, setFormData] = useState({
    name: '',
    website: '',
    description: '',
    category: 'deployment',
    tags: '',
    logo_url: '',
    mrr: '',
    twitter: '',
    github: '',
    location_country: '',
    location_city: '',
  })

  useEffect(() => {
    setMounted(true)
    checkUser()
  }, [])

  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
    } else {
      setUser(user)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (!user) {
        throw new Error('You must be signed in to submit a platform')
      }

      if (!formData.name || !formData.website || !formData.description) {
        throw new Error('Please fill in all required fields')
      }

      const slug = generateSlug(formData.name)

      const { data: existing } = await supabase
        .from('platforms')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existing) {
        throw new Error('A platform with this name already exists')
      }

      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      const mrr = formData.mrr ? parseInt(formData.mrr) : null

      const { error: insertError } = await supabase.from('platforms').insert({
        name: formData.name,
        slug,
        website: formData.website,
        description: formData.description,
        category: formData.category as any,
        tags,
        logo_url: formData.logo_url || 'https://via.placeholder.com/150',
        mrr,
        twitter: formData.twitter || null,
        github: formData.github || null,
        location_country: formData.location_country || null,
        location_city: formData.location_city || null,
        submitted_by: user.id,
        approved: false,
      } as any)

      if (insertError) throw insertError

      setSuccess(true)

      setFormData({
        name: '',
        website: '',
        description: '',
        category: 'deployment',
        tags: '',
        logo_url: '',
        mrr: '',
        twitter: '',
        github: '',
        location_country: '',
        location_city: '',
      })

      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="inline-flex items-center gap-3 text-orange-500">
            <div className="w-4 h-4 border-2 border-orange-300 border-t-orange-600 rounded-full animate-spin" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
        <div className="max-w-md mx-auto text-center animate-view-enter">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-orange-950 mb-3">Submission received</h1>
          <p className="text-orange-700/70 mb-8">
            We'll review your platform within 24 hours. Redirecting you back...
          </p>
          <button
            onClick={() => router.push('/')}
            className="text-sm text-orange-500 hover:text-orange-700 font-medium transition-colors"
          >
            Back to directory
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12">
      <div
        className={`max-w-xl mx-auto transition-all duration-700 ease-out ${
          mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-700 transition-colors mb-6 font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <h1 className="text-3xl font-bold text-orange-950 tracking-tight mb-2">
            Submit a platform
          </h1>
          <p className="text-orange-700/60">
            Add your OpenClaw platform to the directory. Free backlink included.
          </p>
        </div>

        {error && (
          <div className="mb-6 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700 animate-view-enter">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name">
              Platform name <span className="text-red-400">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="SimpleClaw"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label htmlFor="website">
              Website <span className="text-red-400">*</span>
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://simpleclaw.com"
              value={formData.website}
              onChange={handleChange}
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description">
              Description <span className="text-red-400">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your platform in a few sentences..."
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
            />
            <p className="text-xs text-orange-400">
              {formData.description.length} characters
            </p>
          </div>

          {/* Category + Tags row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="category">
                Category <span className="text-red-400">*</span>
              </Label>
              <Select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                {CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                name="tags"
                type="text"
                placeholder="docker, telegram"
                value={formData.tags}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Logo + MRR row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="logo_url">Logo URL</Label>
              <Input
                id="logo_url"
                name="logo_url"
                type="url"
                placeholder="https://example.com/logo.png"
                value={formData.logo_url}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mrr">MRR ($)</Label>
              <Input
                id="mrr"
                name="mrr"
                type="number"
                placeholder="3500"
                value={formData.mrr}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Social row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                name="twitter"
                type="text"
                placeholder="@simpleclaw"
                value={formData.twitter}
                onChange={handleChange}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                name="github"
                type="text"
                placeholder="user/repo"
                value={formData.github}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Location */}
          <div className="pt-4 border-t border-orange-200/50">
            <p className="text-xs text-orange-500 font-medium tracking-wide uppercase mb-3">
              Location (optional)
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="location_country">Country</Label>
                <Input
                  id="location_country"
                  name="location_country"
                  type="text"
                  placeholder="United States"
                  value={formData.location_country}
                  onChange={handleChange}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="location_city">City</Label>
                <Input
                  id="location_city"
                  name="location_city"
                  type="text"
                  placeholder="San Francisco"
                  value={formData.location_city}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit platform'
              )}
            </Button>
          </div>

          <p className="text-[11px] text-orange-400 text-center">
            Your platform will be manually reviewed before appearing in the directory.
          </p>
        </form>
      </div>
    </div>
  )
}
