export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      platforms: {
        Row: {
          id: string
          name: string
          slug: string
          description: string
          website: string
          logo_url: string
          category: 'deployment' | 'hosting' | 'marketplace' | 'analytics' | 'education' | 'services' | 'tools' | 'business'
          tags: string[]
          mrr: number | null
          upvote_count: number
          view_count: number
          submitted_by: string
          submitted_at: string
          approved: boolean
          featured: boolean
          twitter: string | null
          github: string | null
          claimed_by: string | null
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description: string
          website: string
          logo_url: string
          category: 'deployment' | 'hosting' | 'marketplace' | 'analytics' | 'education' | 'services' | 'tools' | 'business'
          tags: string[]
          mrr?: number | null
          upvote_count?: number
          view_count?: number
          submitted_by: string
          submitted_at?: string
          approved?: boolean
          featured?: boolean
          twitter?: string | null
          github?: string | null
          claimed_by?: string | null
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string
          website?: string
          logo_url?: string
          category?: 'deployment' | 'hosting' | 'marketplace' | 'analytics' | 'education' | 'services' | 'tools' | 'business'
          tags?: string[]
          mrr?: number | null
          upvote_count?: number
          view_count?: number
          submitted_by?: string
          submitted_at?: string
          approved?: boolean
          featured?: boolean
          twitter?: string | null
          github?: string | null
          claimed_by?: string | null
        }
      }
      upvotes: {
        Row: {
          id: string
          platform_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          platform_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          platform_id?: string
          user_id?: string
          created_at?: string
        }
      }
      comments: {
        Row: {
          id: string
          platform_id: string
          user_id: string
          user_email: string
          body: string
          created_at: string
        }
        Insert: {
          id?: string
          platform_id: string
          user_id: string
          user_email: string
          body: string
          created_at?: string
        }
        Update: {
          id?: string
          platform_id?: string
          user_id?: string
          user_email?: string
          body?: string
          created_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          display_name: string
          avatar_url: string | null
          bio: string | null
          created_at: string
        }
        Insert: {
          id: string
          display_name: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          display_name?: string
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
        }
      }
      bookmarks: {
        Row: {
          id: string
          user_id: string
          platform_id: string
          collection_name: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          platform_id: string
          collection_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          platform_id?: string
          collection_name?: string
          created_at?: string
        }
      }
      platform_claims: {
        Row: {
          id: string
          platform_id: string
          user_id: string
          status: 'pending' | 'approved' | 'rejected'
          proof_url: string
          created_at: string
        }
        Insert: {
          id?: string
          platform_id: string
          user_id: string
          status?: 'pending' | 'approved' | 'rejected'
          proof_url: string
          created_at?: string
        }
        Update: {
          id?: string
          platform_id?: string
          user_id?: string
          status?: 'pending' | 'approved' | 'rejected'
          proof_url?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
