-- Create a table for user profiles containing trial & subscription info
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  subscription_status text default 'trial', -- 'trial', 'active' (paid), or 'expired'
  trial_ends_at timestamp with time zone default (now() + interval '7 days'),
  created_at timestamp with time zone default now()
);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;

create policy "Users can view their own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

-- Trigger to automatically create a profile row on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, subscription_status, trial_ends_at)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'trial',
    now() + interval '7 days'
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
