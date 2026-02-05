-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create platforms table
CREATE TABLE IF NOT EXISTS public.platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT NOT NULL,
    website TEXT NOT NULL,
    logo_url TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('deployment', 'hosting', 'marketplace', 'analytics', 'education', 'services', 'tools', 'business')),
    tags TEXT[] DEFAULT '{}',
    mrr INTEGER,
    upvote_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    submitted_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    approved BOOLEAN DEFAULT FALSE,
    featured BOOLEAN DEFAULT FALSE,
    twitter TEXT,
    github TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create upvotes table
CREATE TABLE IF NOT EXISTS public.upvotes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform_id UUID NOT NULL REFERENCES public.platforms(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(platform_id, user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_platforms_approved ON public.platforms(approved);
CREATE INDEX IF NOT EXISTS idx_platforms_category ON public.platforms(category);
CREATE INDEX IF NOT EXISTS idx_platforms_slug ON public.platforms(slug);
CREATE INDEX IF NOT EXISTS idx_platforms_upvote_count ON public.platforms(upvote_count DESC);
CREATE INDEX IF NOT EXISTS idx_platforms_submitted_at ON public.platforms(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_upvotes_platform_id ON public.upvotes(platform_id);
CREATE INDEX IF NOT EXISTS idx_upvotes_user_id ON public.upvotes(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_platforms_updated_at BEFORE UPDATE ON public.platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.upvotes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for platforms table

-- Anyone can read approved platforms
CREATE POLICY "Anyone can view approved platforms"
    ON public.platforms FOR SELECT
    USING (approved = true);

-- Authenticated users can view their own submissions (even if not approved)
CREATE POLICY "Users can view their own submissions"
    ON public.platforms FOR SELECT
    USING (auth.uid() = submitted_by);

-- Authenticated users can insert platforms
CREATE POLICY "Authenticated users can submit platforms"
    ON public.platforms FOR INSERT
    WITH CHECK (auth.uid() = submitted_by);

-- Users can update their own platforms (but can't change approval status)
CREATE POLICY "Users can update their own platforms"
    ON public.platforms FOR UPDATE
    USING (auth.uid() = submitted_by)
    WITH CHECK (auth.uid() = submitted_by);

-- RLS Policies for upvotes table

-- Anyone can view upvotes
CREATE POLICY "Anyone can view upvotes"
    ON public.upvotes FOR SELECT
    TO public
    USING (true);

-- Authenticated users can insert upvotes
CREATE POLICY "Authenticated users can upvote"
    ON public.upvotes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own upvotes
CREATE POLICY "Users can remove their own upvotes"
    ON public.upvotes FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to increment upvote count
CREATE OR REPLACE FUNCTION increment_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.platforms
    SET upvote_count = upvote_count + 1
    WHERE id = NEW.platform_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to decrement upvote count
CREATE OR REPLACE FUNCTION decrement_upvote_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.platforms
    SET upvote_count = upvote_count - 1
    WHERE id = OLD.platform_id;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for upvote count
CREATE TRIGGER upvote_added
    AFTER INSERT ON public.upvotes
    FOR EACH ROW EXECUTE FUNCTION increment_upvote_count();

CREATE TRIGGER upvote_removed
    AFTER DELETE ON public.upvotes
    FOR EACH ROW EXECUTE FUNCTION decrement_upvote_count();

-- Create function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(platform_slug TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.platforms
    SET view_count = view_count + 1
    WHERE slug = platform_slug AND approved = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
