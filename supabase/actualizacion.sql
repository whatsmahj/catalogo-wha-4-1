-- ============================================================================
--  Catalogo Wha · Actualización incremental
--  Solo cambios. Ejecuta DESPUÉS del schema.sql base. Es idempotente.
-- ============================================================================

-- 1. Columnas nuevas en businesses (planes y cuotas) -------------------------
alter table public.businesses add column if not exists plan           text default 'free';
alter table public.businesses add column if not exists max_products   int  default 15;
alter table public.businesses add column if not exists max_storage_mb int  default 100;
alter table public.businesses add column if not exists onboarded      boolean default false;
alter table public.businesses add column if not exists payments       jsonb default '[]'::jsonb;
alter table public.businesses add column if not exists seo_image      text;

-- 2. Cobertura: colaboradores por negocio -----------------------------------
create table if not exists public.business_members (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  user_id      uuid references auth.users(id) on delete cascade,
  email        text not null,
  role         text default 'support' check (role in ('owner','manager','support')),
  note         text,
  created_at   timestamptz default now(),
  unique (business_id, email)
);
create index if not exists business_members_business_idx on public.business_members(business_id);
create index if not exists business_members_user_idx     on public.business_members(user_id);

-- 3. Auditoría de administración --------------------------------------------
create table if not exists public.admin_audit (
  id          uuid primary key default gen_random_uuid(),
  admin_email text,
  action      text,
  target      text,
  detail      jsonb default '{}'::jsonb,
  created_at  timestamptz default now()
);

-- 4. Funciones de acceso con cobertura --------------------------------------
create or replace function public.can_access_business(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select public.is_admin()
    or exists (select 1 from public.businesses b where b.id = bid and b.owner_id = auth.uid())
    or exists (select 1 from public.business_members m where m.business_id = bid and m.user_id = auth.uid());
$$;

create or replace function public.can_manage_business(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select public.is_admin()
    or exists (select 1 from public.businesses b where b.id = bid and b.owner_id = auth.uid())
    or exists (select 1 from public.business_members m where m.business_id = bid and m.user_id = auth.uid() and m.role in ('owner','manager'));
$$;

grant execute on function public.can_access_business(uuid) to anon, authenticated;
grant execute on function public.can_manage_business(uuid) to anon, authenticated;

-- Convierte en super administrador a un usuario por su correo (solo admin).
create or replace function public.make_admin(admin_email text)
returns void language plpgsql security definer set search_path = public as $$
declare uid uuid;
begin
  if not public.is_admin() then raise exception 'not authorized'; end if;
  select id into uid from auth.users where lower(email) = lower(admin_email) limit 1;
  if uid is null then raise exception 'user not found'; end if;
  insert into public.admins (user_id, email) values (uid, admin_email)
  on conflict (user_id) do nothing;
end;
$$;
grant execute on function public.make_admin(text) to authenticated;

-- Incrementa las vistas de un producto.
create or replace function public.increment_product_views(pid uuid)
returns void language sql security definer set search_path = public as $$
  update public.products set views = coalesce(views,0) + 1 where id = pid;
$$;
grant execute on function public.increment_product_views(uuid) to anon, authenticated;

-- 5. Enlazar user_id de un miembro cuando su correo ya existe ----------------
create or replace function public.link_member()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.user_id is null then
    select id into new.user_id from auth.users where lower(email) = lower(new.email) limit 1;
  end if;
  return new;
end;
$$;
drop trigger if exists trg_link_member on public.business_members;
create trigger trg_link_member
  before insert or update on public.business_members
  for each row execute function public.link_member();

-- 6. RLS de las tablas nuevas -----------------------------------------------
alter table public.business_members enable row level security;
alter table public.admin_audit      enable row level security;

drop policy if exists "members read"  on public.business_members;
create policy "members read" on public.business_members
  for select using (can_access_business(business_id) or user_id = auth.uid());

drop policy if exists "members write" on public.business_members;
create policy "members write" on public.business_members
  for all using (can_manage_business(business_id)) with check (can_manage_business(business_id));

drop policy if exists "audit read admin"  on public.admin_audit;
create policy "audit read admin" on public.admin_audit for select using (is_admin());
drop policy if exists "audit write admin" on public.admin_audit;
create policy "audit write admin" on public.admin_audit for insert with check (is_admin());

-- 7. La biblioteca guarda el tamaño en bytes (para el consumo de plan) -------
alter table public.library add column if not exists size_bytes bigint default 0;

-- 8. Ajustes globales del sitio (imágenes de la home) ----------------------
create table if not exists public.site_settings (
  key        text primary key,
  value      jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);
alter table public.site_settings enable row level security;

drop policy if exists "site public read" on public.site_settings;
create policy "site public read" on public.site_settings for select using (true);

drop policy if exists "site admin write" on public.site_settings;
create policy "site admin write" on public.site_settings
  for all using (public.is_admin()) with check (public.is_admin());
