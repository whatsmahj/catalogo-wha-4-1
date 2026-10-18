# Catalogo Wha

Plataforma web multiusuario donde cualquier comercio crea su **catálogo online** y recibe los pedidos **por WhatsApp**. Sin pasarela de pago: el pedido se envía como mensaje estructurado al número del negocio.

- HTML, CSS y JavaScript puros. **Sin paso de compilación.**
- Backend **Supabase** (Postgres + Auth + Storage) — opcional.
- **Modo demo** con `localStorage`: funciona sin configurar nada.
- PWA (manifest + service worker), listo para **Vercel**.
- Multilenguaje: **español, francés y árabe (RTL)**.
- Panel de negocio + **panel de administración con cobertura de usuarios y negocios**.

---

## 1. Estructura del proyecto

```
index.html              Landing pública
login.html              Registro / inicio de sesión
dashboard.html          Panel del negocio
catalogo.html           Catálogo público
manifest.webmanifest
sw.js
vercel.json
robots.txt
sitemap.xml
assets/css/styles.css
assets/js/config.js     Claves y ajustes
assets/js/i18n.js       Traducciones (es / fr / ar)
assets/js/store.js      Capa de datos (Supabase + demo)
assets/js/common.js     Utilidades, idioma, sesión, PWA, WhatsApp
assets/js/auth.js       Autenticación
assets/js/dashboard.js  Panel del negocio y administración
assets/js/catalog.js    Catálogo público
supabase/schema.sql     Esquema completo (idempotente)
supabase/actualizacion.sql  Migraciones incrementales
```

---

## 2. Probar en local (modo demo, sin configurar nada)

1. Descarga o clona la carpeta del proyecto.
2. Abre `index.html` en el navegador **o** sirve la carpeta con cualquier servidor estático:

   ```bash
   # Opción rápida con Python
   python3 -m http.server 8080
   # Luego abre http://localhost:8080
   ```

3. Crea una cuenta desde **Crear cuenta**. Los datos se guardan solo en tu navegador (modo demo).
4. El **asistente de configuración** aparece tras el registro. Complétalo.
5. Para ver un catálogo de ejemplo sin cuenta: abre `catalogo.html?b=demo`.

> El modo demo se activa automáticamente cuando `SUPABASE_URL` y `SUPABASE_ANON_KEY` están vacías.

---

## 3. Configurar Supabase paso a paso

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. Ve a **SQL Editor → New query**, pega el contenido de `supabase/schema.sql` y pulsa **Run**.
   - El script es idempotente: puedes ejecutarlo varias veces sin errores.
   - Crea las tablas, RLS, funciones (`is_admin`, `owns_business`, `can_access_business`, `can_manage_business`), el trigger `handle_new_user()`, el bucket público `catalog-images` y la tabla de **cobertura** `business_members`.
3. Copia la **URL** y la **anon key** del proyecto (Settings → API).
4. Edita `assets/js/config.js`:

   ```js
   SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
   SUPABASE_ANON_KEY: 'eyJhbGciOi...',
   publicDomain: 'tudominio.com'   // solo el host, sin https:// ni barra final
   ```

5. Recarga. La app detecta el backend y desactiva el modo demo.
6. (Opcional) Si ya tenías una versión anterior, ejecuta también `supabase/actualizacion.sql`.

### Storage
El bucket `catalog-images` se crea como **público**. Las políticas permiten lectura pública y subida/borrado a usuarios autenticados.

---

## 4. Hacerse super administrador

En Supabase → SQL Editor, ejecuta (cambia el correo por el tuyo):

```sql
insert into public.admins (user_id, email)
select id, email from auth.users where email = 'tucorreo@ejemplo.com'
on conflict (user_id) do nothing;
```

Vuelve a iniciar sesión en la app. Aparecerá la sección **🛡️ Administración** en el panel.

En modo demo, el admin se puede conceder desde la pestaña **Administración → Super administradores**. En Supabase, esa misma pestaña usa la función RPC `make_admin(correo)` incluida en el esquema.

> **Nota sobre el registro:** para probar sin fricción, desactiva la confirmación por correo en Supabase → Authentication → Providers → Email ("Confirm email"). Si la dejas activada, el usuario deberá confirmar su correo antes de entrar y, hasta entonces, `getMyBusiness()` no devolverá negocio.

---

## 5. Desplegar en Vercel

1. Sube el proyecto a un repositorio de GitHub.
2. En [vercel.com](https://vercel.com) → **Add New → Project** e importa el repo.
3. Framework preset: **Other**. No hay build command ni output dir (son archivos estáticos).
4. Deploy. `vercel.json` ya aplica `cleanUrls: true`, `trailingSlash: false` y las cabeceras de caché para `/sw.js`, el manifest y `/assets/*`.
5. Añade tu dominio y actualiza `publicDomain` en `assets/js/config.js` con el host final.
6. Tras cada despliegue, sube el número de versión en los enlaces `?v=N` del HTML y en `CACHE_VERSION` de `sw.js`.

---

## 6. Panel de administración y cobertura

La sección **Administración** (solo super admin) tiene cinco pestañas:

| Pestaña | Qué hace |
|---|---|
| **Cuentas** | Todas las cuentas con propietario, estado, contadores, buscador, detalle, editar, publicar/ocultar y eliminar. |
| **Cobertura** | Da acceso a **otros usuarios o negocios**: añade colaboradores por correo con rol *Soporte* (solo lectura) o *Gestor* (puede editar), retíralos y **transfiere la propiedad**. |
| **Métricas** | Altas por mes, ranking de cuentas por pedidos y productos más vistos. |
| **Super administradores** | Añade o quita otros super administradores. |
| **Auditoría** | Registro reciente de acciones de administración. |

### Cómo funciona la cobertura
- Tabla `business_members` (`business_id`, `user_id`, `email`, `role`, `note`).
- Funciones SQL:
  - `can_access_business(bid)` → admin, dueño o miembro (lectura).
  - `can_manage_business(bid)` → admin, dueño o miembro con rol `manager`/`owner` (escritura).
- Cuando añades un correo que ya tiene cuenta, un trigger (`link_member`) enlaza automáticamente el `user_id`.
- Cada acción de cobertura se guarda en `admin_audit`.

---

## 7. Modelo de datos (resumen)

| Tabla | Contenido |
|---|---|
| `businesses` | Un negocio por cuenta: identidad, WhatsApp, moneda, marca, entrega, pagos, SEO, plan y cuotas. |
| `categories` | Categorías de producto o servicio (`kind`). |
| `products` | Productos y servicios: precio, promoción, hasta 5 imágenes, duración, modalidad, reservable. |
| `orders` | Pedidos con ítems (`jsonb`), total, estado y cita. |
| `library` | Biblioteca de imágenes (URL y tamaño). |
| `admins` | Super administradores. |
| `business_members` | **Cobertura**: colaboradores con acceso a un negocio. |
| `admin_audit` | Auditoría de acciones del admin. |

RLS activado en todas las tablas. El catálogo público lee sin sesión; cualquiera puede **crear** un pedido, pero solo el dueño/admin/miembro puede leerlos.

---

## 8. Mensaje de pedido por WhatsApp

Estructura por bloques, negrita nativa (`*texto*`) y **sin emojis**. Bloques: pedido, cliente, cita (solo si hay servicios reservables), productos, resumen (subtotal solo si hay tarifa de entrega; el TOTAL incluye la entrega), entrega y forma de pago. Los servicios se marcan con `(Servicio)`; si el precio es 0 se escribe «A consultar».

---

## 9. Lista de comprobación final

- [x] Registro, inicio de sesión y modo demo funcionando
- [x] El asistente de configuración aparece tras registrarse y se puede completar (5 pasos)
- [x] Categorías de producto y de servicio; artículos de los dos tipos
- [x] El catálogo público muestra productos y servicios con **tarjetas distintas**
- [x] El filtro de tipo y los dos filtros de categoría funcionan y **no mezclan tipos**
- [x] El contador de artículos aparece en los desplegables de categoría (`Ropa (12)`)
- [x] La ficha de detalle abre, cambia de imagen y se cierra con Escape
- [x] Elegir una imagen de la biblioteca **se ve claramente marcado** (borde, capa y ✓) con barra fija
- [x] En el carrito **siempre se ven los artículos** (formulario a dos columnas y pie limitado)
- [x] El pedido exige nombre y teléfono; pide fecha si hay servicios reservables
- [x] El mensaje de WhatsApp sale **estructurado y sin emojis**
- [x] Compartir un artículo genera un texto con precio, descripción y datos
- [x] La agenda agrupa las citas por día
- [x] El resumen de ventas calcula y exporta a CSV
- [x] Los pedidos se filtran por fecha y se exportan a CSV
- [x] Se puede configurar el horario y el catálogo solo ofrece esas horas
- [x] Todo funciona en español, francés y árabe con RTL
- [x] Diseño sin desbordamiento horizontal a 390 px
- [x] **Administración con cobertura de usuarios y negocios**

---

## 10. Problemas frecuentes

| Problema | Causa probable | Solución |
|---|---|---|
| No aparece la sección Administración | Tu usuario no está en `admins` | Ejecuta el `insert into public.admins` de la sección 4 y vuelve a entrar. |
| La app sigue en modo demo | `SUPABASE_URL`/`SUPABASE_ANON_KEY` vacías | Rellénalas en `assets/js/config.js`. |
| Error `permission denied for table` | RLS activo sin política para la operación | Ejecuta `schema.sql`/`actualizacion.sql` completos. |
| Las imágenes no suben | Bucket o políticas de Storage ausentes | Verifica el bucket público `catalog-images` y sus políticas. |
| Al registrarse no se crea el negocio | Falta el trigger `handle_new_user()` | Ejecuta el bloque de triggers de `schema.sql`. |
| El catálogo no carga en producción | `publicDomain` mal configurado o `published=false` | Corrige `publicDomain` y publica el negocio desde el panel. |
| Tras desplegar veo la versión antigua | Caché del service worker | Sube `CACHE_VERSION` y los `?v=N`, y recarga. |
| Los enlaces abren con `.html` en producción | `cleanUrls` no aplicado | Revisa `vercel.json`; en local es normal ver `.html`. |
| El árabe no se refleja | `dir` no aplicado | Se aplica desde `i18n.js`; recarga la página. |
| El precio muestra «A consultar» | El precio es 0 | Es el comportamiento esperado para servicios sin precio. |
| Tras registrarme no entro / no hay negocio | Confirmación de correo activada en Supabase | Confirma el correo o desactiva "Confirm email" en Authentication. |
| La transferencia de propiedad no cambia el dueño real | El correo no tiene cuenta o no figura como miembro | Añade primero el correo en **Cobertura** (queda enlazado por el trigger `link_member`) y luego transfiere. |

---

## 11. Licencia

Uso libre para tu proyecto. Ajústalo a tu marca y necesidades.
