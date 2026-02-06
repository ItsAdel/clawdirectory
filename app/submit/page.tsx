'use client'

import * as React from 'react'
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

      // Validate form
      if (!formData.name || !formData.website || !formData.description) {
        throw new Error('Please fill in all required fields')
      }

      // Generate slug
      const slug = generateSlug(formData.name)

      // Check if slug already exists
      const { data: existing } = await supabase
        .from('platforms')
        .select('id')
        .eq('slug', slug)
        .single()

      if (existing) {
        throw new Error('A platform with this name already exists')
      }

      // Parse tags
      const tags = formData.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0)

      // Parse MRR
      const mrr = formData.mrr ? parseInt(formData.mrr) : null

      // Insert platform
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
      
      // Reset form
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

      // Redirect after 3 seconds
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
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-orange-700">🦞 Loading...</p>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 mx-auto text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-orange-900 mb-4">🦞 Submission Received!</h1>
          <p className="text-lg text-orange-700 mb-8">
            Thanks for submitting your platform! We'll review it within 24 hours and notify
            you once it's approved. 🎉
          </p>
          <Button onClick={() => router.push('/')}>🦞 Back to Directory</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-orange-900 mb-4">
          🦞 Submit Your Platform
        </h1>
        <p className="text-lg text-orange-700 mb-8">
          Add your OpenClaw platform or tool to the directory. Get a free backlink and
          reach the OpenClaw community! 🚀
        </p>

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <Label htmlFor="name">
              Platform Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="SimpleClaw"
              value={formData.name}
              onChange={handleChange}
              required
              className="mt-1.5"
            />
          </div>

          {/* Website */}
          <div>
            <Label htmlFor="website">
              Website URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="website"
              name="website"
              type="url"
              placeholder="https://simpleclaw.com"
              value={formData.website}
              onChange={handleChange}
              required
              className="mt-1.5"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your platform in a few sentences..."
              value={formData.description}
              onChange={handleChange}
              required
              className="mt-1.5"
              rows={4}
            />
            <p className="mt-1.5 text-sm text-orange-600">
              {formData.description.length} characters
            </p>
          </div>

          {/* Category */}
          <div>
            <Label htmlFor="category">
              Category <span className="text-red-500">*</span>
            </Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="mt-1.5"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Tags */}
          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              name="tags"
              type="text"
              placeholder="docker, telegram, one-click (comma-separated)"
              value={formData.tags}
              onChange={handleChange}
              className="mt-1.5"
            />
            <p className="mt-1.5 text-sm text-orange-600">
              Separate multiple tags with commas
            </p>
          </div>

          {/* Logo URL */}
          <div>
            <Label htmlFor="logo_url">Logo URL</Label>
            <Input
              id="logo_url"
              name="logo_url"
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logo_url}
              onChange={handleChange}
              className="mt-1.5"
            />
            <p className="mt-1.5 text-sm text-orange-600">
              Direct link to your logo image. Leave empty for placeholder.
            </p>
          </div>

          {/* MRR */}
          <div>
            <Label htmlFor="mrr">💰 Monthly Recurring Revenue (MRR)</Label>
            <Input
              id="mrr"
              name="mrr"
              type="number"
              placeholder="3500"
              value={formData.mrr}
              onChange={handleChange}
              className="mt-1.5"
            />
            <p className="mt-1.5 text-sm text-orange-600">
              Optional. Showing your MRR builds trust (like TrustMRR)!
            </p>
          </div>

          {/* Twitter */}
          <div>
            <Label htmlFor="twitter">🐦 Twitter Handle</Label>
            <Input
              id="twitter"
              name="twitter"
              type="text"
              placeholder="@simpleclaw"
              value={formData.twitter}
              onChange={handleChange}
              className="mt-1.5"
            />
          </div>

          {/* GitHub */}
          <div>
            <Label htmlFor="github">💻 GitHub Repository</Label>
            <Input
              id="github"
              name="github"
              type="text"
              placeholder="simpleclaw/simpleclaw"
              value={formData.github}
              onChange={handleChange}
              className="mt-1.5"
            />
            <p className="mt-1.5 text-sm text-orange-600">
              Format: username/repo-name
            </p>
          </div>

          {/* Location Section */}
          <div className="pt-4 border-t border-orange-200">
            <h3 className="text-lg font-semibold text-orange-900 mb-4">
              📍 Location (Optional)
            </h3>
            <p className="text-sm text-orange-700 mb-4">
              Show where your platform was launched on our world map! 🌍
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Country */}
              <div>
                <Label htmlFor="location_country">Country</Label>
                <Input
                  id="location_country"
                  name="location_country"
                  type="text"
                  placeholder="United States"
                  value={formData.location_country}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>

              {/* City */}
              <div>
                <Label htmlFor="location_city">City</Label>
                <Input
                  id="location_city"
                  name="location_city"
                  type="text"
                  placeholder="San Francisco"
                  value={formData.location_city}
                  onChange={handleChange}
                  className="mt-1.5"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? '🦞 Submitting...' : '🦞 Submit Platform'}
            </Button>
          </div>

          <p className="text-sm text-orange-600 text-center">
            By submitting, you agree that your platform will be manually reviewed before
            appearing in the directory. ✨
          </p>
        </form>
      </div>
    </div>
  )
}
