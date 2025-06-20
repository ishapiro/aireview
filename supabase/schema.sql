-- Last updated: 2024-06-13 20:13 UTC (update this comment with each change)

-- Begin transaction
begin;

-- Safe drops: Only drop triggers and policies if their tables exist
do $$
begin
    -- Drop triggers only if their tables exist
    if exists (select 1 from information_schema.tables where table_name = 'users' and table_schema = 'auth') then
        drop trigger if exists on_auth_user_created on auth.users;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'profiles' and table_schema = 'public') then
        drop trigger if exists update_profiles_updated_at on public.profiles;
        drop policy if exists "Public profiles are viewable by everyone" on public.profiles;
        drop policy if exists "Users can update own profile" on public.profiles;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'categories' and table_schema = 'public') then
        drop trigger if exists update_categories_updated_at on public.categories;
        drop trigger if exists on_category_activity on public.categories;
        drop policy if exists "Categories are viewable by everyone" on public.categories;
        drop policy if exists "Only admins can insert categories" on public.categories;
        drop policy if exists "Only admins can update categories" on public.categories;
        drop policy if exists "Only admins can delete categories" on public.categories;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'reviews' and table_schema = 'public') then
        drop trigger if exists update_reviews_updated_at on public.reviews;
        drop trigger if exists on_review_activity on public.reviews;
        drop policy if exists "Published reviews are viewable by everyone" on public.reviews;
        drop policy if exists "Users can view their own unpublished reviews" on public.reviews;
        drop policy if exists "Users can create reviews" on public.reviews;
        drop policy if exists "Users can update own reviews" on public.reviews;
        drop policy if exists "Users can delete own reviews" on public.reviews;
        drop policy if exists "Anyone can increment view count" on public.reviews;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'comments' and table_schema = 'public') then
        drop trigger if exists update_comments_updated_at on public.comments;
        drop trigger if exists on_comment_activity on public.comments;
        drop policy if exists "Comments are viewable by everyone" on public.comments;
        drop policy if exists "Users can create comments" on public.comments;
        drop policy if exists "Users can update own comments" on public.comments;
        drop policy if exists "Users can delete own comments" on public.comments;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'helpful_votes' and table_schema = 'public') then
        drop trigger if exists handle_helpful_votes on public.helpful_votes;
        drop policy if exists "Helpful votes are viewable by everyone" on public.helpful_votes;
        drop policy if exists "Users can create helpful votes" on public.helpful_votes;
        drop policy if exists "Users can delete own helpful votes" on public.helpful_votes;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'activity_log' and table_schema = 'public') then
        drop trigger if exists update_activity_log_updated_at on public.activity_log;
        drop policy if exists "Activity logs are viewable by admins" on public.activity_log;
        drop policy if exists "System can insert activity logs" on public.activity_log;
    end if;

    if exists (select 1 from information_schema.tables where table_name = 'review_categories' and table_schema = 'public') then
        drop policy if exists "Review categories are viewable by everyone" on public.review_categories;
        drop policy if exists "Users can manage categories for their own reviews" on public.review_categories;
        drop policy if exists "Admins can manage all review categories" on public.review_categories;
    end if;
end $$;

-- Drop existing functions (safe to do even if tables don't exist)
drop function if exists public.handle_new_user() cascade;
drop function if exists public.increment_view_count(uuid) cascade;
drop function if exists public.update_updated_at_column() cascade;
drop function if exists public.handle_helpful_vote() cascade;
drop function if exists public.handle_activity_log() cascade;
drop function if exists public.update_review_with_categories(uuid, text, text, text, integer, boolean, boolean, uuid[]) cascade;
drop function if exists public.create_review_with_categories(text, text, text, integer, boolean, boolean, uuid[], uuid) cascade;
drop function if exists public.slugify(text) cascade;

-- Safe migrations: Create or modify tables
do $$ 
begin
    -- Create tables if they don't exist
    create table if not exists public.profiles (
        id uuid references auth.users on delete cascade primary key,
        full_name text,
        email text unique,
        bio text,
        avatar_url text,
        phone text,
        website text,
        is_admin boolean default false,
        is_premium boolean default false,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    create table if not exists public.categories (
        id uuid default gen_random_uuid() primary key,
        name text not null,
        slug text unique not null,
        description text,
        image_url text,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    create table if not exists public.reviews (
        id uuid default gen_random_uuid() primary key,
        title text not null,
        slug text unique not null,
        summary text,
        content text not null,
        rating integer not null check (rating >= 1 and rating <= 5),
        user_id uuid references public.profiles(id) on delete cascade not null,
        helpful_count integer default 0,
        views_count integer default 0,
        is_published boolean default true,
        ai_generated boolean default false,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    create table if not exists public.review_categories (
        review_id uuid not null references public.reviews(id) on delete cascade,
        category_id uuid not null references public.categories(id) on delete cascade,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        primary key (review_id, category_id)
    );

    create table if not exists public.comments (
        id uuid default gen_random_uuid() primary key,
        content text not null,
        user_id uuid references public.profiles(id) on delete cascade not null,
        review_id uuid references public.reviews(id) on delete cascade not null,
        helpful_count integer default 0,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    create table if not exists public.helpful_votes (
        id uuid default gen_random_uuid() primary key,
        user_id uuid references public.profiles(id) on delete cascade not null,
        review_id uuid references public.reviews(id) on delete cascade,
        comment_id uuid references public.comments(id) on delete cascade,
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        constraint one_vote_per_item check (
            (review_id is not null and comment_id is null) or
            (review_id is null and comment_id is not null)
        ),
        constraint unique_vote unique (user_id, review_id, comment_id)
    );

    create table if not exists public.activity_log (
        id uuid default gen_random_uuid() primary key,
        user_id uuid references public.profiles(id) on delete cascade,
        type text not null check (
            type in (
                'review_created',
                'review_updated',
                'review_deleted',
                'comment_added',
                'comment_deleted',
                'user_registered',
                'category_created',
                'category_updated',
                'category_deleted'
            )
        ),
        description text not null,
        metadata jsonb default '{}',
        created_at timestamp with time zone default timezone('utc'::text, now()) not null,
        updated_at timestamp with time zone default timezone('utc'::text, now()) not null
    );

    -- Add columns if they don't exist
    -- Profiles table
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'phone') then
        alter table public.profiles add column phone text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'website') then
        alter table public.profiles add column website text;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_admin') then
        alter table public.profiles add column is_admin boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'is_premium') then
        alter table public.profiles add column is_premium boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'profiles' and column_name = 'updated_at') then
        alter table public.profiles add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
    end if;

    -- Activity log table
    if not exists (select 1 from information_schema.columns where table_name = 'activity_log' and column_name = 'updated_at') then
        alter table public.activity_log add column updated_at timestamp with time zone default timezone('utc'::text, now()) not null;
    end if;

    -- Reviews table
    if not exists (select 1 from information_schema.columns where table_name = 'reviews' and column_name = 'ai_generated') then
        alter table public.reviews add column ai_generated boolean default false;
    end if;
    if not exists (select 1 from information_schema.columns where table_name = 'reviews' and column_name = 'summary') then
        alter table public.reviews add column summary text;
    end if;
end $$;

-- Enable Row Level Security (safe to run multiple times)
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.reviews enable row level security;
alter table public.comments enable row level security;
alter table public.helpful_votes enable row level security;
alter table public.activity_log enable row level security;
alter table public.review_categories enable row level security;

-- Create policies (safe to run after dropping existing ones)
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

create policy "Categories are viewable by everyone"
    on public.categories for select
    using (true);

create policy "Only admins can insert categories"
    on public.categories for insert
    with check (exists (
        select 1 from public.profiles
        where id = auth.uid() and is_admin = true
    ));

create policy "Only admins can update categories"
    on public.categories for update
    using (exists (
        select 1 from public.profiles
        where id = auth.uid() and is_admin = true
    ));

create policy "Only admins can delete categories"
    on public.categories for delete
    using (exists (
        select 1 from public.profiles
        where id = auth.uid() and is_admin = true
    ));

create policy "Review categories are viewable by everyone"
    on public.review_categories for select
    using (true);

create policy "Users can manage categories for their own reviews"
    on public.review_categories for all
    using (exists (
        select 1 from public.reviews
        where reviews.id = review_categories.review_id and reviews.user_id = auth.uid()
    ));

create policy "Admins can manage all review categories"
    on public.review_categories for all
    using (exists (
        select 1 from public.profiles
        where profiles.id = auth.uid() and profiles.is_admin = true
    ));

create policy "Published reviews are viewable by everyone"
    on public.reviews for select
    using (is_published = true);

create policy "Users can view their own unpublished reviews"
    on public.reviews for select
    using (auth.uid() = user_id);

create policy "Users can create reviews"
    on public.reviews for insert
    with check (auth.uid() = user_id);

create policy "Users can update own reviews"
    on public.reviews for update
    using (auth.uid() = user_id);

create policy "Users can delete own reviews"
    on public.reviews for delete
    using (auth.uid() = user_id);

create policy "Anyone can increment view count"
    on public.reviews for update
    using (true)
    with check (
        -- Only allow updating the views_count column and incrementing by 1
        views_count = (select views_count + 1 from public.reviews where id = id)
    );

create policy "Comments are viewable by everyone"
    on public.comments for select
    using (true);

create policy "Users can create comments"
    on public.comments for insert
    with check (auth.uid() = user_id);

create policy "Users can update own comments"
    on public.comments for update
    using (auth.uid() = user_id);

create policy "Users can delete own comments"
    on public.comments for delete
    using (auth.uid() = user_id);

create policy "Helpful votes are viewable by everyone"
    on public.helpful_votes for select
    using (true);

create policy "Users can create helpful votes"
    on public.helpful_votes for insert
    with check (auth.uid() = user_id);

create policy "Users can delete own helpful votes"
    on public.helpful_votes for delete
    using (auth.uid() = user_id);

create policy "Activity logs are viewable by admins"
    on public.activity_log for select
    using (exists (
        select 1 from public.profiles
        where id = auth.uid() and is_admin = true
    ));

create policy "System can insert activity logs"
    on public.activity_log for insert
    with check (true);

-- Create functions (safe to run after dropping existing ones)
create function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, email, phone, website, avatar_url)
    values (
        new.id, 
        new.raw_user_meta_data->>'full_name', 
        new.email,
        new.raw_user_meta_data->>'phone',
        new.raw_user_meta_data->>'website',
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

create function public.increment_view_count(review_id uuid)
returns void as $$
begin
    update public.reviews
    set views_count = views_count + 1
    where id = review_id;
end;
$$ language plpgsql security definer;

create function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

create function public.handle_helpful_vote()
returns trigger as $$
begin
    if tg_op = 'INSERT' then
        -- Increment helpful_count
        if new.review_id is not null then
            update public.reviews
            set helpful_count = helpful_count + 1
            where id = new.review_id;
        else
            update public.comments
            set helpful_count = helpful_count + 1
            where id = new.comment_id;
        end if;
    elsif tg_op = 'DELETE' then
        -- Decrement helpful_count
        if old.review_id is not null then
            update public.reviews
            set helpful_count = helpful_count - 1
            where id = old.review_id;
        else
            update public.comments
            set helpful_count = helpful_count - 1
            where id = old.comment_id;
        end if;
    end if;
    return null;
end;
$$ language plpgsql security definer;

create function public.handle_activity_log()
returns trigger as $$
declare
    activity_type text;
    activity_description text;
    user_name text;
begin
    -- Get user name
    select full_name into user_name
    from public.profiles
    where id = auth.uid();

    -- Set activity type and description based on the table and operation
    case TG_TABLE_NAME
        when 'reviews' then
            case TG_OP
                when 'INSERT' then
                    activity_type := 'review_created';
                    activity_description := format('Review "%s" created by %s', NEW.title, user_name);
                when 'UPDATE' then
                    activity_type := 'review_updated';
                    activity_description := format('Review "%s" updated by %s', NEW.title, user_name);
                when 'DELETE' then
                    activity_type := 'review_deleted';
                    activity_description := format('Review "%s" deleted by %s', OLD.title, user_name);
            end case;
        when 'comments' then
            case TG_OP
                when 'INSERT' then
                    activity_type := 'comment_added';
                    activity_description := format('New comment added by %s', user_name);
                when 'DELETE' then
                    activity_type := 'comment_deleted';
                    activity_description := format('Comment deleted by %s', user_name);
            end case;
        when 'categories' then
            case TG_OP
                when 'INSERT' then
                    activity_type := 'category_created';
                    activity_description := format('Category "%s" created by %s', NEW.name, user_name);
                when 'UPDATE' then
                    activity_type := 'category_updated';
                    activity_description := format('Category "%s" updated by %s', NEW.name, user_name);
                when 'DELETE' then
                    activity_type := 'category_deleted';
                    activity_description := format('Category "%s" deleted by %s', OLD.name, user_name);
            end case;
    end case;

    
    insert into public.activity_log (user_id, type, description, metadata)
    values (
        auth.uid(),
        activity_type,
        activity_description,
        case TG_OP
            when 'DELETE' then jsonb_build_object('old_data', to_jsonb(OLD))
            when 'UPDATE' then jsonb_build_object('old_data', to_jsonb(OLD), 'new_data', to_jsonb(NEW))
            else jsonb_build_object('data', to_jsonb(NEW))
        end
    );

    return null;
end;
$$ language plpgsql security definer;

create or replace function public.update_review_with_categories(
    review_id uuid,
    new_title text,
    new_summary text,
    new_content text,
    new_rating integer,
    new_is_published boolean,
    new_ai_generated boolean,
    new_category_ids uuid[]
)
returns void as $$
begin
    -- Update the review details in the reviews table
    update public.reviews
    set
        title = new_title,
        summary = new_summary,
        content = new_content,
        rating = new_rating,
        is_published = new_is_published,
        ai_generated = new_ai_generated,
        updated_at = timezone('utc'::text, now())
    where id = review_id;

    -- Remove existing category associations for this review
    delete from public.review_categories
    where review_categories.review_id = update_review_with_categories.review_id;

    -- Insert new category associations
    if array_length(new_category_ids, 1) > 0 then
        insert into public.review_categories (review_id, category_id)
        select update_review_with_categories.review_id, unnest(new_category_ids);
    end if;
end;
$$ language plpgsql;

create or replace function public.create_review_with_categories(
    new_title text,
    new_summary text,
    new_content text,
    new_rating integer,
    new_is_published boolean,
    new_ai_generated boolean,
    new_category_ids uuid[],
    author_id uuid
)
returns uuid as $$
declare
    new_review_id uuid;
    new_slug text;
begin
    -- Generate slug from title
    new_slug := slugify(new_title);

    -- Insert the review and get its ID
    insert into public.reviews (title, summary, content, rating, is_published, ai_generated, user_id, slug)
    values (new_title, new_summary, new_content, new_rating, new_is_published, new_ai_generated, author_id, new_slug)
    returning id into new_review_id;

    -- Insert category associations
    if array_length(new_category_ids, 1) > 0 then
        insert into public.review_categories (review_id, category_id)
        select new_review_id, unnest(new_category_ids);
    end if;

    return new_review_id;
end;
$$ language plpgsql;

-- Create triggers (safe to run after dropping existing ones)
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

create trigger update_profiles_updated_at
    before update on public.profiles
    for each row execute procedure public.update_updated_at_column();

create trigger update_categories_updated_at
    before update on public.categories
    for each row execute procedure public.update_updated_at_column();

create trigger update_reviews_updated_at
    before update on public.reviews
    for each row execute procedure public.update_updated_at_column();

create trigger update_comments_updated_at
    before update on public.comments
    for each row execute procedure public.update_updated_at_column();

create trigger handle_helpful_votes
    after insert or delete on public.helpful_votes
    for each row execute procedure public.handle_helpful_vote();

create trigger on_review_activity
    after insert or update or delete on public.reviews
    for each row execute procedure public.handle_activity_log();

create trigger on_comment_activity
    after insert or delete on public.comments
    for each row execute procedure public.handle_activity_log();

create trigger on_category_activity
    after insert or update or delete on public.categories
    for each row execute procedure public.handle_activity_log();

create trigger update_activity_log_updated_at
    before update on public.activity_log
    for each row execute procedure public.update_updated_at_column();

-- Commit transaction
commit;

-- Create storage bucket if it doesn't exist (outside transaction)
insert into storage.buckets (id, name, public)
values ('reviews', 'reviews', true)
on conflict (id) do nothing;

-- Drop existing storage policies if they exist

DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload files" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own files" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete temp files" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous users can upload temp files" ON storage.objects;

-- Create storage policies for the reviews bucket (outside transaction)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'reviews' );

create policy "Authenticated users can upload files"
on storage.objects for insert
with check ( bucket_id = 'reviews' AND auth.role() = 'authenticated' );

create policy "Users can update own files"
on storage.objects for update
using (
  bucket_id = 'reviews'
  AND (
    name LIKE ('avatars/' || auth.uid()::text || '-%')
    OR
    name LIKE (auth.uid()::text || '/%')
  )
);

create policy "Users can delete own files"
on storage.objects for delete
using (
  bucket_id = 'reviews'
  AND (
    name LIKE ('avatars/' || auth.uid()::text || '-%')
    OR
    name LIKE (auth.uid()::text || '/%')
  )
);

create policy "Users can delete temp files"
on storage.objects for delete
using (
  bucket_id = 'reviews'
  AND name LIKE 'avatars/temp-%'
);

--
-- Slugify Function
--
CREATE OR REPLACE FUNCTION public.slugify(
  v TEXT
) RETURNS TEXT AS $$
BEGIN
  -- Remove accents
  v := translate(v, 'àáâãäåāăąçćčđďèéêëēĕėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż', 'aaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz');
  --
  -- Replace anything that's not a letter, number, hyphen or underscore with a hyphen
  v := lower(regexp_replace(v, '[^a-z0-9_-]+', '-', 'g'));
  --
  -- Replace multiple hyphens with a single hyphen
  v := regexp_replace(v, '[-]+', '-', 'g');
  --
  -- Remove leading and trailing hyphens
  v := regexp_replace(v, '^-|-$', '', 'g');
  RETURN v;
END;
$$ LANGUAGE plpgsql;