-- Create profiles table
create table if not exists public.profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text,
    email text unique,
    bio text,
    avatar_url text,
    is_admin boolean default false,
    is_premium boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create categories table
create table if not exists public.categories (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    slug text unique not null,
    description text,
    image_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create reviews table
create table if not exists public.reviews (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    slug text unique not null,
    content text not null,
    rating integer not null check (rating >= 1 and rating <= 5),
    user_id uuid references public.profiles(id) on delete cascade not null,
    category_id uuid references public.categories(id) on delete set null,
    helpful_count integer default 0,
    views_count integer default 0,
    is_published boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create comments table
create table if not exists public.comments (
    id uuid default gen_random_uuid() primary key,
    content text not null,
    user_id uuid references public.profiles(id) on delete cascade not null,
    review_id uuid references public.reviews(id) on delete cascade not null,
    helpful_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create helpful_votes table to track user votes on reviews and comments
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

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.reviews enable row level security;
alter table public.comments enable row level security;
alter table public.helpful_votes enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
    on public.profiles for select
    using (true);

create policy "Users can update own profile"
    on public.profiles for update
    using (auth.uid() = id);

-- Categories policies
create policy "Categories are viewable by everyone"
    on public.categories for select
    using (true);

create policy "Only admins can insert categories"
    on public.categories for insert
    using (exists (
        select 1 from public.profiles
        where id = auth.uid() and is_admin = true
    ));

create policy "Only admins can update categories"
    on public.categories for update
    using (exists (
        select 1 from public.profiles
        where id = auth.uid() and is_admin = true
    ));

-- Reviews policies
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

-- Comments policies
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

-- Helpful votes policies
create policy "Helpful votes are viewable by everyone"
    on public.helpful_votes for select
    using (true);

create policy "Users can create helpful votes"
    on public.helpful_votes for insert
    with check (auth.uid() = user_id);

create policy "Users can delete own helpful votes"
    on public.helpful_votes for delete
    using (auth.uid() = user_id);

-- Create functions and triggers
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, full_name, email, avatar_url)
    values (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        new.raw_user_meta_data->>'avatar_url'
    );
    return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Add updated_at triggers to all tables
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

-- Function to handle helpful votes
create or replace function public.handle_helpful_vote()
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

create trigger handle_helpful_votes
    after insert or delete on public.helpful_votes
    for each row execute procedure public.handle_helpful_vote(); 