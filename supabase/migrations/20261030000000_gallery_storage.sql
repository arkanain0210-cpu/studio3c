-- Public bucket: files readable by direct URL, but not listable by anon.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('gallery', 'gallery', true, 15728640, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- Only accounts flagged as station (app_metadata.role = 'station') may upload.
create policy "station can upload gallery"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'gallery'
  and (auth.jwt() -> 'app_metadata' ->> 'role') = 'station'
);

-- Return the files for one customer session only (no bucket-wide listing).
create or replace function public.gallery_files(sid text)
returns table (name text, created_at timestamptz)
language sql
stable
security definer
set search_path = ''
as $$
  select o.name, o.created_at
  from storage.objects o
  where sid ~ '^[a-z0-9]{6,16}$'
    and o.bucket_id = 'gallery'
    and o.name like sid || '/%'
  order by o.created_at;
$$;

revoke all on function public.gallery_files(text) from public;
grant execute on function public.gallery_files(text) to anon, authenticated;
