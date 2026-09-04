-- ==============================================================================
-- 90 DAYS SPOKEN ENGLISH FLUENCY - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- It will create all tables, indexes, RLS policies, storage bucket, and seed data.

-- 1. PROFILES TABLE (Stores user profile, Google auth info, and admin status)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-create profile upon auth.users signup/OAuth login
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url, is_admin)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', ''),
    false
  )
  on conflict (id) do update
  set
    email = excluded.email,
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert or update on auth.users
  for each row execute function public.handle_new_user();

-- 2. DAYS TABLE (Admin-managed learning days)
create table if not exists public.days (
  id uuid default gen_random_uuid() primary key,
  day_number int unique not null,
  topic text not null,
  youtube_url text not null,
  youtube_title text default '',
  story_content text not null,
  pdf_url text,
  pdf_filename text,
  lesson_context text,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. TRANSLATION SENTENCES TABLE (30 sentences per day)
create table if not exists public.translation_sentences (
  id serial primary key,
  day_number int not null references public.days(day_number) on delete cascade,
  sentence_order int not null,
  hindi text not null,
  english text not null,
  alternatives text[] default '{}',
  hint text,
  key_grammar text,
  difficulty text default 'Beginner',
  created_at timestamptz default now(),
  unique(day_number, sentence_order)
);

-- 4. USER DAY PROGRESS TABLE (Per-user persistent state)
create table if not exists public.user_day_progress (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  day_number int not null,
  listening_completed boolean default false,
  reading_completed boolean default false,
  translation_completed boolean default false,
  completed_sentence_ids int[] default '{}',
  ai_conversation_completed boolean default false,
  day_completed boolean default false,
  score int default 0,
  completed_at timestamptz,
  updated_at timestamptz default now(),
  unique(user_id, day_number)
);

-- 5. TRANSLATION ATTEMPTS TABLE (Stores individual translation submissions)
create table if not exists public.translation_attempts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  day_number int not null,
  sentence_id int not null,
  user_input text not null,
  is_correct boolean not null,
  feedback text,
  created_at timestamptz default now()
);

-- 6. AI CONVERSATION SESSIONS TABLE (Stores transcript and context)
create table if not exists public.ai_conversation_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  day_number int not null,
  messages jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, day_number)
);

-- 7. AI SCORES TABLE (Stores final speaking evaluation out of 100)
create table if not exists public.ai_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  day_number int not null,
  overall_score int not null,
  grammar_score int not null,
  vocabulary_score int not null,
  fluency_score int not null,
  sentence_structure_score int not null,
  relevance_score int not null,
  feedback_strengths text,
  feedback_mistakes text,
  feedback_improvements text,
  feedback_corrections jsonb default '[]'::jsonb,
  created_at timestamptz default now()
);

-- 8. STORAGE BUCKET FOR LESSON PDFS
insert into storage.buckets (id, name, public)
values ('lesson-pdfs', 'lesson-pdfs', true)
on conflict (id) do update set public = true;

-- Allow public read access to lesson-pdfs bucket
create policy "Public Access to Lesson PDFs"
  on storage.objects for select
  using ( bucket_id = 'lesson-pdfs' );

-- Allow authenticated users / admins to upload lesson PDFs
create policy "Authenticated Users Can Upload Lesson PDFs"
  on storage.objects for insert
  with check ( bucket_id = 'lesson-pdfs' and auth.role() = 'authenticated' );

-- 9. ENABLE ROW LEVEL SECURITY (RLS)
alter table public.profiles enable row level security;
alter table public.days enable row level security;
alter table public.translation_sentences enable row level security;
alter table public.user_day_progress enable row level security;
alter table public.translation_attempts enable row level security;
alter table public.ai_conversation_sessions enable row level security;
alter table public.ai_scores enable row level security;

-- Policies for public.profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

-- Policies for public.days (Anyone can read published days, authenticated/admins can insert/update)
create policy "Anyone can read published days" on public.days
  for select using (is_published = true or auth.uid() in (select id from public.profiles where is_admin = true));

create policy "Admins can insert days" on public.days
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update days" on public.days
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete days" on public.days
  for delete using (auth.role() = 'authenticated');

-- Policies for public.translation_sentences
create policy "Anyone can read translation sentences" on public.translation_sentences
  for select using (true);

create policy "Admins can insert translation sentences" on public.translation_sentences
  for insert with check (auth.role() = 'authenticated');

create policy "Admins can update translation sentences" on public.translation_sentences
  for update using (auth.role() = 'authenticated');

create policy "Admins can delete translation sentences" on public.translation_sentences
  for delete using (auth.role() = 'authenticated');

-- Policies for user progress tables
create policy "Users manage their own day progress" on public.user_day_progress
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their translation attempts" on public.translation_attempts
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their AI conversation sessions" on public.ai_conversation_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users manage their AI scores" on public.ai_scores
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- 10. INDEXES FOR HIGH-SPEED QUERYING
create index if not exists idx_days_number on public.days(day_number);
create index if not exists idx_sentences_day_order on public.translation_sentences(day_number, sentence_order);
create index if not exists idx_user_progress_user_day on public.user_day_progress(user_id, day_number);
create index if not exists idx_ai_scores_user_day on public.ai_scores(user_id, day_number);

-- ==============================================================================
-- 11. SEED DEFAULT LESSON DAYS (Day 1 and Day 2)
-- ==============================================================================

-- Seed Day 1
insert into public.days (day_number, topic, youtube_url, youtube_title, story_content, lesson_context, is_published)
values (
  1,
  'Morning Routines & Habit Loops',
  'https://www.youtube.com/watch?v=RcGyVTAoXEU',
  'How to make stress your friend | Kelly McGonigal',
  'The dawn broke over the city in a soft wash of amber and steel-grey light. While the neighborhood was still wrapped in silence, Rohan woke up at 6:00 AM. He immediately resisted the urge to reach for his smartphone. Instead, he drank a large glass of lukewarm water to kick-start his metabolism and stood beside the open window, inhaling the crisp morning air. Over the past month, he had replaced chaos with quiet intention. He used to stay up late browsing social media, but now he prioritized physical and mental clarity. By preparing his mind and embracing challenge with courage, every morning became an architectural foundation for genuine productivity.',
  'Focus on daily morning habits, waking up without friction, reframing stress as a source of courage, and using phrasal verbs like "wake up", "kick-start", "used to", and "reach out".',
  true
)
on conflict (day_number) do update set
  topic = excluded.topic,
  youtube_url = excluded.youtube_url,
  youtube_title = excluded.youtube_title,
  story_content = excluded.story_content,
  lesson_context = excluded.lesson_context;

-- Seed Day 2 (User Example: A Boy Who Rescued an Injured Bird)
insert into public.days (day_number, topic, youtube_url, youtube_title, story_content, lesson_context, is_published)
values (
  2,
  'A Boy Who Rescued an Injured Bird',
  'https://www.youtube.com/watch?v=kOuV4kKq5_I',
  'The Power of Kindness and Empathy',
  'On a brisk autumn afternoon, a ten-year-old boy named Aarav was walking through the park when he noticed something fluttering helplessly in the bushes. Moving closer, he discovered a small sparrow with a fractured wing. Remembering what his grandfather had taught him about gentle care, Aarav carefully scooped up the bird in his woolen cap and brought it home. He prepared a warm shoebox with soft cotton, fed it tiny droplets of fresh water with a dropper, and protected it from winter drafts. Over three weeks of patient nourishment, the wing slowly healed. One sunny morning, Aarav opened his bedroom window. The sparrow fluttered its wings, looked back with gratitude, and soared into the sky. Aarav realized that compassion requires patience, but its freedom brings immense joy.',
  'Story about empathy, saving wildlife, caring for an injured creature, nursing it back to health, and letting it fly free with gratitude.',
  true
)
on conflict (day_number) do update set
  topic = excluded.topic,
  youtube_url = excluded.youtube_url,
  youtube_title = excluded.youtube_title,
  story_content = excluded.story_content,
  lesson_context = excluded.lesson_context;
