-- Sessions whose photos were removed by the retention job, so the gallery can say "expired"
create table public.expired_galleries (
  sid text primary key,
  expired_at timestamptz not null default now()
);
alter table public.expired_galleries enable row level security;

-- Files older than the retention window (service_role only; used by the cleanup function)
create or replace function public.expired_gallery_files(days int)
returns table (name text)
language sql
stable
security definer
set search_path = ''
as $$
  select o.name
  from storage.objects o
  where o.bucket_id = 'gallery'
    and o.created_at < now() - make_interval(days => days)
  order by o.created_at
  limit 1000;
$$;
revoke all on function public.expired_gallery_files(int) from public, anon, authenticated;
grant execute on function public.expired_gallery_files(int) to service_role;

-- Public check: was this session's gallery removed by the retention job?
create or replace function public.gallery_expired(sid text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.expired_galleries e where e.sid = gallery_expired.sid);
$$;
revoke all on function public.gallery_expired(text) from public;
grant execute on function public.gallery_expired(text) to anon, authenticated;

create extension if not exists pg_cron;
create extension if not exists pg_net;

-- Run the cleanup function every hour (uses the public anon key; the function
-- only ever deletes files past its fixed retention window).
-- select cron.schedule('gallery-cleanup-hourly', '17 * * * *', $$
--   select net.http_post(
--     url := 'https://<project-ref>.supabase.co/functions/v1/gallery-cleanup',
--     headers := jsonb_build_object('Content-Type', 'application/json', 'Authorization', 'Bearer <anon key>'),
--     body := '{}'::jsonb,
--     timeout_milliseconds := 60000
--   );
-- $$);
