-- ============================================================================
--  Catalogo Wha · Esquema completo de Supabase
--  Ejecutar entero en el SQL Editor. Es idempotente: se puede repetir sin error.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. TABLAS
-- ---------------------------------------------------------------------------

-- Negocios ------------------------------------------------------------------
create table if not exists public.businesses (
  id             uuid primary key default gen_random_uuid(),
  owner_id       uuid references auth.users(id) on delete set null,
  owner_email    text,
  name           text not null default 'Mi negocio',
  slug           text unique,
  description    text,
  whatsapp       text,
  country        text default 'MA',
  currency       text default 'MAD',
  timezone       text default 'Africa/Casablanca',
  brand_color    text default '#5B1A80',
  logo_url       text,
  hero_enabled   boolean default false,
  hero_title     text,
  hero_desc      text,
  hero_image     text,
  delivery       text default 'whatsapp',      -- whatsapp | custom
  delivery_fee   numeric(12,2) default 0,
  delivery_time  text,
  delivery_notes text,
  payments       jsonb default '[]'::jsonb,
  payment_notes  text,
  seo_title      text,
  seo_description text,
  seo_keywords   text,
  seo_image      text,
  published      boolean default false,
  plan           text default 'free',
  max_products   int default 15,
  max_storage_mb int default 100,
  open_time      text default '09:00',
  close_time     text default '18:00',
  slot_minutes   int default 30,
  work_days      jsonb default '[1,2,3,4,5,6]'::jsonb, -- 0=domingo .. 6=sábado
  onboarded      boolean default false,
  created_at     timestamptz default now()
);
create index if not exists businesses_owner_idx on public.businesses(owner_id);

-- Categorías ----------------------------------------------------------------
create table if not exists public.categories (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  name         text not null,
  slug         text,
  sort_order   int default 0,
  image_url    text,
  alt          text,
  kind         text default 'product' check (kind in ('product','service')),
  created_at   timestamptz default now()
);
create index if not exists categories_business_idx on public.categories(business_id);

-- Productos / Servicios -----------------------------------------------------
create table if not exists public.products (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  category_id  uuid references public.categories(id) on delete set null,
  name         text not null,
  slug         text,
  description  text,
  price        numeric(12,2) default 0,
  promo_price  numeric(12,2),
  sort_order   int default 0,
  active       boolean default true,
  images       jsonb default '[]'::jsonb,
  views        int default 0,
  kind         text default 'product' check (kind in ('product','service')),
  duration     text,
  modality     text,
  bookable     boolean default false,
  created_at   timestamptz default now()
);
create index if not exists products_business_idx on public.products(business_id);
create index if not exists products_category_idx on public.products(category_id);

-- Pedidos -------------------------------------------------------------------
create table if not exists public.orders (
  id               uuid primary key default gen_random_uuid(),
  business_id      uuid not null references public.businesses(id) on delete cascade,
  code             text,
  customer_name    text,
  customer_phone   text,
  customer_address text,
  customer_city    text,
  note             text,
  items            jsonb default '[]'::jsonb,
  total            numeric(12,2) default 0,
  status           text default 'new' check (status in ('new','confirmed','delivered','cancelled')),
  appointment_at   timestamptz,
  created_at       timestamptz default now()
);
create index if not exists orders_business_idx on public.orders(business_id);
create index if not exists orders_status_idx on public.orders(status);

-- Biblioteca de imágenes ----------------------------------------------------
create table if not exists public.library (
  id           uuid primary key default gen_random_uuid(),
  business_id  uuid not null references public.businesses(id) on delete cascade,
  url          text not null,
  name         text,
  size_bytes   bigint default 0,
  created_at   timestamptz default now()
);
create index if not exists library_business_idx on public.library(business_id);

-- Super administradores -----------------------------------------------------
create table if not exists public.admins (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  created_at timestamptz default now()
);

-- Cobertura: miembros/colaboradores con acceso a un negocio ------------------
-- Permite al admin (o al dueño) dar cobertura a otros usuarios o negocios.
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
create index if not exists business_members_user_idx on public.business_members(user_id);

-- Auditoría de acciones del admin (cobertura, cambios, borrados) ------------
create table if not exists public.admin_audit (
  id          uuid primary key default gen_random_uuid(),
  admin_email text,
  action      text,
  target      text,
  detail      jsonb default '{}'::jsonb,
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------------
-- 2. FUNCIONES DE SEGURIDAD (SECURITY DEFINER → sin recursión de RLS)
-- ---------------------------------------------------------------------------
create or replace function public.is_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (select 1 from public.admins a where a.user_id = auth.uid());
$$;

create or replace function public.owns_business(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.businesses b
    where b.id = bid and b.owner_id = auth.uid()
  );
$$;

-- Acceso a un negocio = dueño, admin, o miembro de cobertura.
create or replace function public.can_access_business(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select
    public.is_admin()
    or exists (select 1 from public.businesses b where b.id = bid and b.owner_id = auth.uid())
    or exists (select 1 from public.business_members m where m.business_id = bid and m.user_id = auth.uid());
$$;

-- Solo dueño o admin pueden escribir (los "support" leen, no editan).
create or replace function public.can_manage_business(bid uuid)
returns boolean language sql security definer stable set search_path = public as $$
  select
    public.is_admin()
    or exists (select 1 from public.businesses b where b.id = bid and b.owner_id = auth.uid())
    or exists (select 1 from public.business_members m where m.business_id = bid and m.user_id = auth.uid() and m.role in ('owner','manager'));
$$;

grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.owns_business(uuid) to anon, authenticated;
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

-- Incrementa las vistas de un producto (lo puede llamar cualquiera).
create or replace function public.increment_product_views(pid uuid)
returns void language sql security definer set search_path = public as $$
  update public.products set views = coalesce(views,0) + 1 where id = pid;
$$;
grant execute on function public.increment_product_views(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 3. TRIGGERS
-- ---------------------------------------------------------------------------

-- Crea el negocio automáticamente al registrarse.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  bname text;
  bslug text;
begin
  bname := coalesce(nullif(new.raw_user_meta_data->>'business_name',''), split_part(new.email,'@',1));
  bslug := coalesce(nullif(new.raw_user_meta_data->>'slug',''), regexp_replace(lower(bname), '[^a-z0-9]+', '-', 'g'));
  if bslug is null or bslug = '' then bslug := 'negocio-' || substr(new.id::text,1,8); end if;
  -- garantiza unicidad
  while exists (select 1 from public.businesses where slug = bslug) loop
    bslug := bslug || '-' || floor(random()*900+100)::int;
  end loop;

  insert into public.businesses (owner_id, owner_email, name, slug)
  values (new.id, new.email, bname, bslug)
  on conflict do nothing;

  insert into public.categories (business_id, name, slug, sort_order, kind)
  select id, 'Otros', 'otros', 0, 'product' from public.businesses where owner_id = new.id
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Si te añaden como miembro de cobertura y ya tienes cuenta, enlaza user_id.
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

-- ---------------------------------------------------------------------------
-- 4. RLS
-- ---------------------------------------------------------------------------
alter table public.businesses      enable row level security;
alter table public.categories      enable row level security;
alter table public.products        enable row level security;
alter table public.orders          enable row level security;
alter table public.library         enable row level security;
alter table public.admins          enable row level security;
alter table public.business_members enable row level security;
alter table public.admin_audit     enable row level security;

-- businesses ----------------------------------------------------------------
drop policy if exists "biz public read"   on public.businesses;
create policy "biz public read" on public.businesses
  for select using (published = true or can_access_business(id));

drop policy if exists "biz insert self"   on public.businesses;
create policy "biz insert self" on public.businesses
  for insert with check (owner_id = auth.uid() or is_admin());

drop policy if exists "biz update access" on public.businesses;
create policy "biz update access" on public.businesses
  for update using (can_manage_business(id)) with check (can_manage_business(id));

drop policy if exists "biz delete owner"  on public.businesses;
create policy "biz delete owner" on public.businesses
  for delete using (owner_id = auth.uid() or is_admin());

-- categories ----------------------------------------------------------------
drop policy if exists "cat public read"   on public.categories;
create policy "cat public read" on public.categories
  for select using (
    exists (select 1 from public.businesses b where b.id = business_id and b.published = true)
    or can_access_business(business_id)
  );

drop policy if exists "cat write"         on public.categories;
create policy "cat write" on public.categories
  for all using (can_manage_business(business_id)) with check (can_manage_business(business_id));

-- products ------------------------------------------------------------------
drop policy if exists "prod public read"  on public.products;
create policy "prod public read" on public.products
  for select using (
    (active = true and exists (select 1 from public.businesses b where b.id = business_id and b.published = true))
    or can_access_business(business_id)
  );

drop policy if exists "prod write"        on public.products;
create policy "prod write" on public.products
  for all using (can_manage_business(business_id)) with check (can_manage_business(business_id));

-- orders --------------------------------------------------------------------
-- Cualquiera puede crear un pedido (cliente anónimo). Solo dueño/admin lee.
drop policy if exists "order public insert" on public.orders;
create policy "order public insert" on public.orders
  for insert with check (true);

drop policy if exists "order read access"   on public.orders;
create policy "order read access" on public.orders
  for select using (can_access_business(business_id));

drop policy if exists "order update access" on public.orders;
create policy "order update access" on public.orders
  for update using (can_manage_business(business_id)) with check (can_manage_business(business_id));

drop policy if exists "order delete access" on public.orders;
create policy "order delete access" on public.orders
  for delete using (can_manage_business(business_id));

-- library -------------------------------------------------------------------
drop policy if exists "lib public read"   on public.library;
create policy "lib public read" on public.library
  for select using (
    exists (select 1 from public.businesses b where b.id = business_id and b.published = true)
    or can_access_business(business_id)
  );

drop policy if exists "lib write"         on public.library;
create policy "lib write" on public.library
  for all using (can_manage_business(business_id)) with check (can_manage_business(business_id));

-- admins --------------------------------------------------------------------
drop policy if exists "admins read self"  on public.admins;
create policy "admins read self" on public.admins
  for select using (user_id = auth.uid() or is_admin());

drop policy if exists "admins admin all"  on public.admins;
create policy "admins admin all" on public.admins
  for all using (is_admin()) with check (is_admin());

-- business_members (cobertura) ---------------------------------------------
drop policy if exists "members read"      on public.business_members;
create policy "members read" on public.business_members
  for select using (can_access_business(business_id) or user_id = auth.uid());

drop policy if exists "members write"     on public.business_members;
create policy "members write" on public.business_members
  for all using (can_manage_business(business_id)) with check (can_manage_business(business_id));

-- admin_audit ---------------------------------------------------------------
drop policy if exists "audit read admin"  on public.admin_audit;
create policy "audit read admin" on public.admin_audit
  for select using (is_admin());

drop policy if exists "audit write admin" on public.admin_audit;
create policy "audit write admin" on public.admin_audit
  for insert with check (is_admin());

-- ---------------------------------------------------------------------------
-- 5. STORAGE · bucket público "catalog-images"
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('catalog-images', 'catalog-images', true)
on conflict (id) do nothing;

drop policy if exists "storage public read" on storage.objects;
create policy "storage public read" on storage.objects
  for select using (bucket_id = 'catalog-images');

drop policy if exists "storage auth upload" on storage.objects;
create policy "storage auth upload" on storage.objects
  for insert to authenticated with check (bucket_id = 'catalog-images');

drop policy if exists "storage owner update" on storage.objects;
create policy "storage owner update" on storage.objects
  for update to authenticated using (bucket_id = 'catalog-images' and owner = auth.uid());

drop policy if exists "storage owner delete" on storage.objects;
create policy "storage owner delete" on storage.objects
  for delete to authenticated using (bucket_id = 'catalog-images' and owner = auth.uid());

-- ============================================================================
-- Cómo hacerte super administrador (sustituye el correo):
--   insert into public.admins (user_id, email)
--   select id, email from auth.users where email = 'tucorreo@ejemplo.com'
--   on conflict (user_id) do nothing;
-- ============================================================================
