-- ============================================================================
--  Catalogo Wha · Migrar datos del proyecto VIEJO al proyecto NUEVO
--  Ejecutar en el proyecto NUEVO (wbmpzbshifrvfyxzediz) DESPUÉS de registrarte
--  en la app con tu correo, para que ya exista tu negocio y tu usuario.
--
--  IMPORTANTE: las imágenes apuntan al bucket del proyecto VIEJO
--  (bjcrmhytinbwibhnsmiw). Mientras ese proyecto siga existiendo, se verán.
--  Si lo borras, hay que volver a subir las imágenes desde el panel.
-- ============================================================================

do $$
declare
  v_biz  uuid;
  v_foto uuid;
  v_moda uuid;
begin
  -- Localiza tu negocio (creado automáticamente por el trigger al registrarte)
  select id into v_biz
  from public.businesses
  where lower(owner_email) = lower('hassanmahjoubmanager@gmail.com')
  order by created_at asc
  limit 1;

  if v_biz is null then
    raise exception 'No existe un negocio para ese correo. Regístrate primero en la app y vuelve a ejecutar esto.';
  end if;

  -- 1) Negocio ---------------------------------------------------------------
  update public.businesses set
    name          = 'Catalogo m',
    slug          = 'catalogo-n',
    description   = '',
    whatsapp      = '212',                -- ojo: número incompleto en el original
    country       = 'MA',
    currency      = 'MAD',
    timezone      = 'Africa/Casablanca',
    brand_color   = '#5B1A80',
    delivery      = 'whatsapp',
    published     = true,
    onboarded     = true,
    open_time     = '09:00',
    close_time    = '18:00',
    slot_minutes  = 30,
    work_days     = '[1,2,3,4,5,6]'::jsonb
  where id = v_biz;

  -- 2) Categorías (se limpian las creadas por defecto y se recrean) ----------
  delete from public.categories where business_id = v_biz;

  insert into public.categories (business_id, name, slug, sort_order, image_url, alt, kind)
  values (v_biz, 'Otros', 'otros', 0, null, null, 'product');

  insert into public.categories (business_id, name, slug, sort_order, image_url, alt, kind)
  values (v_biz, 'Fotografía', 'fotografia', 0,
          'https://bjcrmhytinbwibhnsmiw.supabase.co/storage/v1/object/public/catalog-images/335d5c9a-7891-4ac1-999c-f5d765dd07b4/1792335621453-imagen-catalogo__14_.webp',
          'Fotografía', 'service')
  returning id into v_foto;

  insert into public.categories (business_id, name, slug, sort_order, image_url, alt, kind)
  values (v_biz, 'Moda', 'moda', 0, '', '', 'product')
  returning id into v_moda;

  -- 3) Productos -------------------------------------------------------------
  insert into public.products
    (business_id, category_id, name, slug, description, price, promo_price, sort_order,
     active, images, views, kind, duration, modality, bookable)
  values
    (v_biz, null, 'Mecanico', 'mecanico',
     'Lorem ipsum dolor sit amet, sea pertinax pertinacia appellantur in, est ad esse assentior mediocritatem, magna populo menandri cum te. Vel augue menandri eu, at integre appareat splendide duo.',
     100, null, 0, true,
     '["https://bjcrmhytinbwibhnsmiw.supabase.co/storage/v1/object/public/catalog-images/335d5c9a-7891-4ac1-999c-f5d765dd07b4/1792335621451-imagen-catalogo__4_.webp"]'::jsonb,
     1, 'service', '', '', true),

    (v_biz, v_moda, 'Ropa', 'ropa',
     'Lorem ipsum dolor sit amet, sea pertinax pertinacia appellantur in, est ad esse assentior mediocritatem, magna populo menandri cum te. Vel augue menandri eu, at integre appareat splendide duo. Est ne tollit ullamcorper, eu pro falli diceret',
     100, 80, 1, true,
     '["https://bjcrmhytinbwibhnsmiw.supabase.co/storage/v1/object/public/catalog-images/335d5c9a-7891-4ac1-999c-f5d765dd07b4/1792340237424-imagen-catalogo__33_.webp"]'::jsonb,
     1, 'product', '', '', false),

    (v_biz, v_foto, 'Fotografo', 'fotografo',
     'Lorem ipsum dolor sit amet, sea pertinax pertinacia appellantur in, est ad esse assentior mediocritatem, magna populo menandri cum te. Vel augue menandri eu, at integre appareat splendide duo.',
     100, null, 0, true,
     '["https://bjcrmhytinbwibhnsmiw.supabase.co/storage/v1/object/public/catalog-images/335d5c9a-7891-4ac1-999c-f5d765dd07b4/1792335621453-imagen-catalogo__14_.webp"]'::jsonb,
     4, 'service', '20', 'A domicilio', true);

  raise notice 'Migración completada para el negocio %', v_biz;
end $$;
