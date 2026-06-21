create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  project_type text,
  dimensions jsonb,
  grade text,
  currency text,
  materials jsonb,
  results jsonb,
  created_at timestamptz default now()
);

alter table projects enable row level security;

create policy "Users can only access their own projects"
  on projects for all
  using (auth.uid() = user_id);
