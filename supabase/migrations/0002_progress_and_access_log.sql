-- Progress tracking + course access log.
-- Run via Supabase CLI (`supabase db push`) or paste into the SQL editor.
--
-- Three tables:
--   * training_progress  — per-(user, path, module) status + jsonb blobs.
--                          Mirrors the upsert shape used by progress-tracker.js.
--   * certificates       — per-(user, path, module) issued certificates.
--   * access_log         — append-only audit trail of course-material opens.
--
-- All three are RLS-protected so a signed-in user can only see/write
-- their own rows. access_log is insert-only for users; reads are reserved
-- for the project owner via the service role / Supabase SQL editor.

-- ── training_progress ────────────────────────────────────────────

create table if not exists public.training_progress (
    user_id          uuid        not null references auth.users(id) on delete cascade,
    path_id          text        not null,
    module_id        text        not null,
    status           text        not null default 'not_started',
    started_at       timestamptz,
    completed_at     timestamptz,
    content_progress jsonb       not null default '{}'::jsonb,
    quiz_scores      jsonb       not null default '{}'::jsonb,
    updated_at       timestamptz not null default now(),
    primary key (user_id, path_id, module_id)
);

comment on table public.training_progress is
    'Per-(user, path, module) progress synced from progress-tracker.js localStorage.';

alter table public.training_progress enable row level security;

drop policy if exists "training_progress self read"   on public.training_progress;
drop policy if exists "training_progress self write"  on public.training_progress;
drop policy if exists "training_progress self update" on public.training_progress;

create policy "training_progress self read"
    on public.training_progress for select
    to authenticated using (user_id = auth.uid());

create policy "training_progress self write"
    on public.training_progress for insert
    to authenticated with check (user_id = auth.uid());

create policy "training_progress self update"
    on public.training_progress for update
    to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ── certificates ─────────────────────────────────────────────────

create table if not exists public.certificates (
    id               bigserial   primary key,
    user_id          uuid        not null references auth.users(id) on delete cascade,
    path_id          text        not null,
    module_id        text        not null,
    certificate_type text        not null default 'module',
    title            text        not null,
    issued_at        timestamptz not null default now(),
    unique (user_id, path_id, module_id, certificate_type)
);

comment on table public.certificates is
    'Issued certificates synced from progress-tracker.js.';

alter table public.certificates enable row level security;

drop policy if exists "certificates self read"  on public.certificates;
drop policy if exists "certificates self write" on public.certificates;

create policy "certificates self read"
    on public.certificates for select
    to authenticated using (user_id = auth.uid());

create policy "certificates self write"
    on public.certificates for insert
    to authenticated with check (user_id = auth.uid());

-- ── access_log ───────────────────────────────────────────────────

create table if not exists public.access_log (
    id          bigserial   primary key,
    user_id     uuid        not null references auth.users(id) on delete cascade,
    user_email  text        not null,
    course_slug text        not null,
    file_path   text        not null,
    mode        text        not null default 'inline',
    accessed_at timestamptz not null default now()
);

comment on table public.access_log is
    'Append-only audit trail of course-material opens. Insert-only for users; '
    'reads via service role / Supabase SQL editor.';

create index if not exists access_log_course_time_idx
    on public.access_log (course_slug, accessed_at desc);
create index if not exists access_log_user_time_idx
    on public.access_log (user_id, accessed_at desc);

alter table public.access_log enable row level security;

drop policy if exists "access_log self insert" on public.access_log;
-- Deliberately no select policy: end users cannot read the log.
-- The project owner queries via the Supabase SQL editor (service role).
create policy "access_log self insert"
    on public.access_log for insert
    to authenticated
    with check (
        user_id = auth.uid()
        and lower(user_email) = lower(auth.jwt() ->> 'email')
    );
