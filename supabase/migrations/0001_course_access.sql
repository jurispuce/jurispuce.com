-- Course access control.
-- Run via Supabase CLI (`supabase db push`) or paste into the SQL editor.
--
-- Model:
--   * course_access holds (email, course_slug) rows maintained manually
--     from the Supabase table editor.
--   * Storage bucket "course-materials" is private; RLS below lets a
--     signed-in user read an object only if a course_access row matches
--     the folder prefix and their JWT email.
--   * Files are stored as <course_slug>/<path>, so the first path segment
--     of storage.objects.name identifies the course.

create table if not exists public.course_access (
    email       text        not null,
    course_slug text        not null,
    granted_at  timestamptz not null default now(),
    granted_by  text,
    note        text,
    primary key (email, course_slug)
);

comment on table public.course_access is
    'Allowlist of emails permitted to read a given course in storage.';

alter table public.course_access enable row level security;

drop policy if exists "course_access self read" on public.course_access;
create policy "course_access self read"
    on public.course_access
    for select
    to authenticated
    using (lower(email) = lower(auth.jwt() ->> 'email'));

drop policy if exists "course-materials allowlist read" on storage.objects;
create policy "course-materials allowlist read"
    on storage.objects
    for select
    to authenticated
    using (
        bucket_id = 'course-materials'
        and exists (
            select 1
            from public.course_access ca
            where lower(ca.email) = lower(auth.jwt() ->> 'email')
              and ca.course_slug = split_part(storage.objects.name, '/', 1)
        )
    );
