-- ============================================================
-- 1. PROFILES TABLE
-- ============================================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  bio text check (char_length(bio) <= 500),
  created_at timestamptz not null default now()
);

create index idx_profiles_display_name on public.profiles(display_name);

alter table public.profiles enable row level security;

create policy "Anyone can view profiles"
  on public.profiles for select using (true);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Auto-create profile on new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name, avatar_url)
  values (
    new.id,
    coalesce(split_part(new.email, '@', 1), 'user'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill existing users
insert into public.profiles (id, display_name, avatar_url)
select
  id,
  coalesce(split_part(email, '@', 1), 'user'),
  raw_user_meta_data->>'avatar_url'
from auth.users
on conflict (id) do nothing;

-- ============================================================
-- 2. BOOKMARKS TABLE
-- ============================================================
create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  platform_id uuid not null references public.platforms(id) on delete cascade,
  collection_name text not null default 'Saved',
  created_at timestamptz not null default now(),
  unique(user_id, platform_id, collection_name)
);

create index idx_bookmarks_user_id on public.bookmarks(user_id);
create index idx_bookmarks_platform_id on public.bookmarks(platform_id);

alter table public.bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

-- ============================================================
-- 3. PLATFORM CLAIMS TABLE + platforms.claimed_by
-- ============================================================
alter table public.platforms
  add column if not exists claimed_by uuid references auth.users(id) on delete set null;

create table public.platform_claims (
  id uuid primary key default gen_random_uuid(),
  platform_id uuid not null references public.platforms(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  proof_url text not null,
  created_at timestamptz not null default now(),
  unique(platform_id, user_id)
);

create index idx_platform_claims_platform_id on public.platform_claims(platform_id);
create index idx_platform_claims_user_id on public.platform_claims(user_id);
create index idx_platform_claims_status on public.platform_claims(status);

alter table public.platform_claims enable row level security;

create policy "Anyone can view approved claims"
  on public.platform_claims for select
  using (status = 'approved');

create policy "Users can view own claims"
  on public.platform_claims for select
  using (auth.uid() = user_id);

create policy "Users can submit claims"
  on public.platform_claims for insert
  with check (auth.uid() = user_id);

-- Auto-set platforms.claimed_by when claim is approved
create or replace function public.handle_claim_approved()
returns trigger as $$
begin
  if new.status = 'approved' and (old.status is null or old.status != 'approved') then
    update public.platforms
    set claimed_by = new.user_id
    where id = new.platform_id;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_claim_status_change
  after insert or update on public.platform_claims
  for each row execute function public.handle_claim_approved();
