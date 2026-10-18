/* ==========================================================================
   Catalogo Wha · i18n.js
   Traducciones es / fr / ar + RTL. Uso:
     CW.i18n.t('login.title')          → texto
     CW.i18n.setLang('ar')             → cambia idioma y aplica dir
     CW.i18n.apply(rootElement)        → traduce nodos [data-i18n]
   ========================================================================== */
(function (window) {
  'use strict';
  var CW = (window.CW = window.CW || {});
  var cfg = CW.config;

  var DICT = {
    es: {
      'app.name': 'Catalogo Wha',
      'common.save': 'Guardar', 'common.cancel': 'Cancelar', 'common.delete': 'Eliminar',
      'common.edit': 'Editar', 'common.back': 'Volver', 'common.next': 'Siguiente',
      'common.prev': 'Anterior', 'common.finish': 'Finalizar', 'common.close': 'Cerrar',
      'common.search': 'Buscar', 'common.all': 'Todos', 'common.loading': 'Cargando…',
      'common.confirm': 'Confirmar', 'common.yes': 'Sí', 'common.no': 'No',
      'common.optional': 'opcional', 'common.required': 'obligatorio', 'common.none': 'Ninguno',
      'common.add': 'Agregar', 'common.actions': 'Acciones', 'common.status': 'Estado',
      'common.name': 'Nombre', 'common.email': 'Correo', 'common.password': 'Contraseña',
      'common.phone': 'Teléfono', 'common.price': 'Precio', 'common.category': 'Categoría',
      'common.image': 'Imagen', 'common.images': 'Imágenes', 'common.order': 'Orden',
      'common.active': 'Activo', 'common.inactive': 'Inactivo', 'common.copy': 'Copiar',
      'common.copied': 'Copiado', 'common.share': 'Compartir', 'common.export': 'Exportar',
      'common.logout': 'Cerrar sesión', 'common.demo': 'Modo demo', 'common.lang': 'Idioma',

      // Landing
      'landing.hero.title': 'Tu catálogo online, pedidos por WhatsApp',
      'landing.hero.sub': 'Crea el catálogo de tu negocio en minutos. Comparte un enlace y recibe los pedidos directamente en tu WhatsApp, sin comisiones.',
      'landing.hero.cta1': 'Crear mi catálogo', 'landing.hero.cta2': 'Ver un ejemplo',
      'landing.problem.title': 'Deja de perder pedidos en el chat',
      'landing.problem.a': 'Pedidos desordenados por chat',
      'landing.problem.a.desc': 'Mensajes sueltos, precios que se olvidan y clientes que se cansan de esperar.',
      'landing.problem.b': 'Catálogo ordenado y siempre listo',
      'landing.problem.b.desc': 'Un enlace con tus productos, precios e imágenes. El cliente arma su pedido y te lo envía.',
      'landing.value.title': 'Todo lo que necesitas para vender',
      'landing.value.1': 'Listo en minutos', 'landing.value.1.desc': 'Sin instalar nada, sin tarjetas, sin complicaciones.',
      'landing.value.2': 'Sin comisiones', 'landing.value.2.desc': 'Tú decides cómo cobrar. El pedido llega a tu WhatsApp.',
      'landing.value.3': 'En 3 idiomas', 'landing.value.3.desc': 'Español, francés y árabe con diseño adaptado.',
      'landing.how.title': 'Cómo funciona',
      'landing.how.1': 'Crea tu cuenta', 'landing.how.1.desc': 'Regístrate y configura tu negocio en el asistente.',
      'landing.how.2': 'Añade productos', 'landing.how.2.desc': 'Sube fotos, precios y categorías de productos y servicios.',
      'landing.how.3': 'Comparte y vende', 'landing.how.3.desc': 'Comparte tu enlace y recibe pedidos por WhatsApp.',
      'landing.features.title': 'Funciones',
      'landing.types.title': 'Para todo tipo de negocio',
      'landing.pricing.title': 'Precios simples',
      'landing.pricing.free': 'Plan Gratuito', 'landing.pricing.free.desc': 'Todo lo esencial para empezar',
      'landing.pricing.cta': 'Empezar gratis',
      'landing.faq.title': 'Preguntas frecuentes',
      'landing.cta.title': 'Empieza a recibir pedidos hoy',
      'landing.cta.sub': 'Crea tu catálogo gratis y comparte tu enlace.',
      'landing.cta.button': 'Crear mi catálogo',

      // Login
      'login.signin': 'Iniciar sesión', 'login.signup': 'Crear cuenta',
      'login.business': 'Nombre del negocio', 'login.email': 'Correo electrónico',
      'login.password': 'Contraseña', 'login.forgot': '¿Olvidaste tu contraseña?',
      'login.submit': 'Entrar', 'login.create': 'Crear mi cuenta',
      'login.have': '¿Ya tienes cuenta?', 'login.no': '¿No tienes cuenta?',
      'login.welcome': 'Bienvenido de nuevo', 'login.start': 'Crea tu catálogo gratis',
      'login.demo.note': 'Estás en modo demo: los datos se guardan solo en este navegador.',

      // Dashboard nav
      'nav.principal': 'Principal', 'nav.catalog': 'Catálogo', 'nav.business': 'Mi negocio',
      'nav.home': 'Inicio', 'nav.orders': 'Pedidos', 'nav.agenda': 'Agenda', 'nav.sales': 'Ventas',
      'nav.products': 'Productos', 'nav.categories': 'Categorías', 'nav.library': 'Biblioteca',
      'nav.settings': 'Configurar negocio', 'nav.plan': 'Plan y consumo', 'nav.account': 'Mi cuenta',
      'nav.admin': 'Administración', 'nav.preview': 'Ver catálogo',

      // Home
      'home.ready': 'Preparando catálogo', 'home.published': 'Catálogo publicado',
      'home.sub': 'Prepara lo esencial y publica tu catálogo cuando esté listo para recibir pedidos.',
      'home.prepare': 'Preparar publicación', 'home.addproduct': '+ Agregar producto',
      'home.requirements': 'requisitos para publicar', 'home.pending': 'Pendiente',
      'home.complete': 'Completar configuración', 'home.manage': 'Gestionar productos',
      'home.summary': 'Resumen', 'home.quick': 'Vista rápida',
      'home.products': 'Productos', 'home.categories': 'Categorías', 'home.orders': 'Pedidos',
      'home.activity': 'Actividad', 'home.activity.title': 'Lo último en tu negocio',
      'home.activity.empty': 'Tus cinco eventos más recientes para saber qué ocurrió.',
      'home.newproduct': 'Nuevo producto', 'home.newproduct.desc': 'Agrega rápidamente un producto a tu catálogo.',
      'home.vieworders': 'Ver pedidos', 'home.vieworders.desc': 'Revisa y gestiona los pedidos recibidos.',
      'home.config': 'Configurar negocio', 'home.config.desc': 'Cambia marca, WhatsApp, moneda, entrega y más.',
      'home.publish': 'Preparar publicación', 'home.publish.desc': 'Revisa qué falta antes de hacer público tu catálogo.',
      'home.req.link': 'Falta asignar un subdominio a la tienda.',
      'home.req.whatsapp': 'El WhatsApp del negocio debe ser válido y estar normalizado.',
      'home.req.product': 'Debe existir al menos un producto activo.',
      'home.req.address': 'Todavía no tienes una dirección pública configurada.',

      // Products
      'prod.new': 'Agregar producto', 'prod.edit': 'Editar producto',
      'prod.info': 'Información', 'prod.data': 'Datos del producto',
      'prod.data.desc': 'Nombre, categoría y dirección dentro de tu catálogo.',
      'prod.name': 'Nombre del producto', 'prod.url': 'URL del producto',
      'prod.desc': 'Descripción', 'prod.sort': 'Orden de presentación',
      'prod.sort.hint': 'Usa números menores para mostrar el producto primero.',
      'prod.price.title': 'Precios del producto', 'prod.regular': 'Precio regular',
      'prod.promo': 'Precio promocional', 'prod.promo.hint': 'Déjalo vacío si no existe una promoción.',
      'prod.images.title': 'Imágenes del producto', 'prod.images.hint': 'Puedes agregar hasta 5 imágenes. La primera será la principal.',
      'prod.type': 'Tipo', 'prod.type.product': 'Producto', 'prod.type.service': 'Servicio',
      'prod.duration': 'Duración', 'prod.modality': 'Modalidad', 'prod.bookable': 'Permitir reservar cita',
      'prod.save': 'Guardar producto', 'prod.views': 'Vistas',
      'prod.empty': 'Todavía no tienes productos', 'prod.empty.desc': 'Agrega tu primer producto para empezar a vender.',
      'prod.tip': 'Para un catálogo claro', 'prod.tip.1': 'Usa un nombre corto y fácil de reconocer.',
      'prod.tip.2': 'El precio promocional debe representar una oferta real.',
      'prod.tip.3': 'Agrega imágenes nítidas para ayudar al comprador.',
      'prod.currency': 'Moneda del negocio',

      // Categories
      'cat.new': 'Agregar categoría', 'cat.title': 'Categorías',
      'cat.sub': 'Organiza los productos para que tus clientes encuentren lo que buscan.',
      'cat.list': 'Lista de categorías', 'cat.list.hint': 'El orden más bajo aparece primero en el catálogo.',
      'cat.default': 'Predeterminada', 'cat.data': 'Datos de la categoría',
      'cat.slug': 'Slug / URL', 'cat.image': 'Imagen representativa',
      'cat.alt': 'Texto alternativo', 'cat.save': 'Guardar categoría',
      'cat.count': 'Categorías', 'cat.organized': 'Productos organizados', 'cat.distributed': 'Distribuidos en las categorías visibles',

      // Orders
      'ord.title': 'Pedidos', 'ord.sub': 'Consulta, filtra y gestiona los pedidos recibidos.',
      'ord.code': 'Código del pedido', 'ord.list': 'Listado de pedidos',
      'ord.empty': 'Todavía no tienes pedidos',
      'ord.empty.desc': 'Cuando un cliente registre un pedido desde tu catálogo, aparecerá aquí.',
      'ord.customer': 'Cliente', 'ord.total': 'Total', 'ord.date': 'Fecha',
      'ord.detail': 'Detalle del pedido', 'ord.contact': 'Contactar por WhatsApp',
      'ord.status.new': 'Nuevo', 'ord.status.confirmed': 'Confirmado',
      'ord.status.delivered': 'Entregado', 'ord.status.cancelled': 'Cancelado',

      // Settings
      'set.title': 'Configuración del negocio',
      'set.sub': 'Elige qué parte de tu negocio quieres configurar.',
      'set.info': 'Información del negocio', 'set.info.desc': 'Nombre, descripción, ubicación y zona horaria.',
      'set.whatsapp': 'WhatsApp', 'set.whatsapp.desc': 'Número al que tus clientes enviarán sus pedidos.',
      'set.brand': 'Marca', 'set.brand.desc': 'Logotipo y color principal del catálogo.',
      'set.currency': 'Moneda', 'set.currency.desc': 'Moneda vigente para precios y pedidos.',
      'set.link': 'Enlace del catálogo', 'set.link.desc': 'El enlace que compartes para que tus clientes abran tu catálogo.',
      'set.presentation': 'Presentación del catálogo', 'set.presentation.desc': 'Título, descripción e imagen del encabezado público.',
      'set.delivery': 'Entrega', 'set.delivery.desc': 'Define cómo se coordinará la entrega o el retiro.',
      'set.payments': 'Formas de pago', 'set.payments.desc': 'Opciones que el cliente puede indicar al hacer su pedido.',
      'set.hours': 'Horarios', 'set.hours.desc': 'Días y horas en que atiendes.',
      'set.seo': 'SEO y compartir', 'set.seo.desc': 'Cómo se presenta tu catálogo al compartirlo y en buscadores.',
      'set.configured': 'Configurado', 'set.missing': 'Falta configurar', 'set.optional': 'Opcional', 'set.pending': 'Pendiente',
      'set.configure': 'Configurar', 'set.personalize': 'Personalizar', 'set.choose': 'Elegir enlace',
      'set.current': 'Actual', 'set.save': 'Guardar cambios',

      // Plan
      'plan.title': 'Plan y consumo', 'plan.sub': 'Revisa tu plan, el espacio disponible y las ventajas de Pro.',
      'plan.current': 'Tu plan actual', 'plan.free': 'Free', 'plan.free.desc': 'Sin costo mensual.',
      'plan.products': 'Productos guardados', 'plan.storage': 'Espacio para imágenes',
      'plan.includes': 'Tu plan actual incluye', 'plan.pro': 'Plan Pro',
      'plan.pro.unavailable': 'Pro todavía no está disponible para nuevas contrataciones.',

      // Account
      'acc.title': 'Mi cuenta', 'acc.profile': 'Perfil', 'acc.changeemail': 'Cambiar correo',
      'acc.changepass': 'Cambiar contraseña', 'acc.reset': 'Recuperar contraseña',
      'acc.export': 'Exportar todos mis datos (JSON)', 'acc.delete': 'Eliminar el negocio',
      'acc.delete.hint': 'Escribe ELIMINAR para confirmar.', 'acc.newpass': 'Nueva contraseña',

      // Admin
      'adm.title': 'Administración', 'adm.sub': 'Gestiona todas las cuentas y la cobertura de usuarios y negocios.',
      'adm.accounts': 'Cuentas', 'adm.metrics': 'Métricas', 'adm.coverage': 'Cobertura',
      'adm.owner': 'Propietario', 'adm.state': 'Estado', 'adm.published': 'Publicado', 'adm.hidden': 'Oculto',
      'adm.publish': 'Publicar', 'adm.hide': 'Ocultar', 'adm.detail': 'Detalle',
      'adm.members': 'Colaboradores con acceso', 'adm.member.add': 'Dar cobertura a un usuario',
      'adm.member.email': 'Correo del usuario', 'adm.member.role': 'Rol',
      'adm.member.support': 'Soporte (solo lectura)', 'adm.member.manager': 'Gestor (puede editar)',
      'adm.member.owner': 'Propietario', 'adm.transfer': 'Transferir propiedad',
      'adm.superadmins': 'Super administradores', 'adm.addadmin': 'Añadir super administrador',
      'adm.audit': 'Auditoría reciente', 'adm.metrics.signups': 'Altas por mes',
      'adm.metrics.topviews': 'Productos más vistos', 'adm.metrics.ranking': 'Ranking por pedidos',
      'adm.storage': 'Almacenamiento', 'adm.plan': 'Plan', 'adm.limit': 'Límite',

      // Onboarding
      'onb.step': 'Paso', 'onb.of': 'de', 'onb.business': 'Tu negocio',
      'onb.whatsapp': 'Tu WhatsApp', 'onb.brand': 'Tu marca', 'onb.link': 'Tu enlace',
      'onb.delivery': 'Entrega y pagos', 'onb.done': '¡Todo listo!',
      'onb.done.sub': 'Tu catálogo ya está preparado. Comparte tu enlace y empieza a recibir pedidos.',
      'onb.available': '¡Disponible!', 'onb.taken': 'Ya está en uso',
      'onb.gotodash': 'Ir a mi panel', 'onb.viewcatalog': 'Ver mi catálogo',

      // Catalog public
      'cat.public.products': 'Productos', 'cat.public.services': 'Servicios',
      'cat.public.type': 'Tipo', 'cat.public.sort': 'Ordenar',
      'cat.public.recommended': 'Recomendado', 'cat.public.priceasc': 'Precio: menor a mayor',
      'cat.public.pricedesc': 'Precio: mayor a menor', 'cat.public.news': 'Novedades',
      'cat.public.search': 'Buscar…', 'cat.public.add': '+ Agregar', 'cat.public.request': '+ Solicitar',
      'cat.public.book': '+ Reservar', 'cat.public.details': 'Ver detalles',
      'cat.public.consult': 'A consultar', 'cat.public.offer': 'Oferta', 'cat.public.save': 'Ahorro',
      'cat.public.duration': 'Duración', 'cat.public.modality': 'Modalidad',
      'cat.public.available': 'Disponible', 'cat.public.category': 'Categoría',
      'cat.public.delivery': 'Entrega', 'cat.public.payment': 'Formas de pago',
      'cat.public.cart': 'Tu pedido', 'cat.public.emptycart': 'Tu pedido está vacío',
      'cat.public.yourdata': 'Tus datos', 'cat.public.address': 'Dirección',
      'cat.public.city': 'Ciudad', 'cat.public.note': 'Nota',
      'cat.public.appt': 'Fecha y hora', 'cat.public.date': 'Fecha', 'cat.public.time': 'Hora',
      'cat.public.send': 'Enviar pedido por WhatsApp', 'cat.public.quantity': 'Cantidad',
      'cat.public.subtotal': 'Subtotal', 'cat.public.fee': 'Entrega', 'cat.public.total': 'Total',
      'cat.public.notfound': 'Catálogo no encontrado',
      'cat.public.notfound.desc': 'El negocio que buscas no existe o no está publicado.',
      'cat.public.closed': 'El negocio no atiende ese día. Elige otra fecha.',
      'cat.public.required': 'Nombre y teléfono son obligatorios.'
    },

    fr: {
      'app.name': 'Catalogo Wha',
      'common.save': 'Enregistrer', 'common.cancel': 'Annuler', 'common.delete': 'Supprimer',
      'common.edit': 'Modifier', 'common.back': 'Retour', 'common.next': 'Suivant',
      'common.prev': 'Précédent', 'common.finish': 'Terminer', 'common.close': 'Fermer',
      'common.search': 'Rechercher', 'common.all': 'Tous', 'common.loading': 'Chargement…',
      'common.confirm': 'Confirmer', 'common.yes': 'Oui', 'common.no': 'Non',
      'common.optional': 'facultatif', 'common.required': 'obligatoire', 'common.none': 'Aucun',
      'common.add': 'Ajouter', 'common.actions': 'Actions', 'common.status': 'Statut',
      'common.name': 'Nom', 'common.email': 'E-mail', 'common.password': 'Mot de passe',
      'common.phone': 'Téléphone', 'common.price': 'Prix', 'common.category': 'Catégorie',
      'common.image': 'Image', 'common.images': 'Images', 'common.order': 'Ordre',
      'common.active': 'Actif', 'common.inactive': 'Inactif', 'common.copy': 'Copier',
      'common.copied': 'Copié', 'common.share': 'Partager', 'common.export': 'Exporter',
      'common.logout': 'Déconnexion', 'common.demo': 'Mode démo', 'common.lang': 'Langue',

      'landing.hero.title': 'Votre catalogue en ligne, commandes par WhatsApp',
      'landing.hero.sub': "Créez le catalogue de votre commerce en quelques minutes. Partagez un lien et recevez les commandes sur WhatsApp, sans commission.",
      'landing.hero.cta1': 'Créer mon catalogue', 'landing.hero.cta2': 'Voir un exemple',
      'landing.problem.title': 'Arrêtez de perdre des commandes dans le chat',
      'landing.problem.a': 'Commandes en désordre',
      'landing.problem.a.desc': 'Messages épars, prix oubliés et clients qui se lassent.',
      'landing.problem.b': 'Catalogue organisé et prêt',
      'landing.problem.b.desc': 'Un lien avec vos produits, prix et images. Le client compose sa commande et l’envoie.',
      'landing.value.title': 'Tout pour vendre',
      'landing.value.1': 'Prêt en minutes', 'landing.value.1.desc': 'Rien à installer, sans carte bancaire.',
      'landing.value.2': 'Sans commission', 'landing.value.2.desc': 'Vous choisissez le paiement. La commande arrive sur WhatsApp.',
      'landing.value.3': 'En 3 langues', 'landing.value.3.desc': 'Espagnol, français et arabe.',
      'landing.how.title': 'Comment ça marche',
      'landing.how.1': 'Créez un compte', 'landing.how.1.desc': 'Inscrivez-vous et configurez votre commerce.',
      'landing.how.2': 'Ajoutez des produits', 'landing.how.2.desc': 'Photos, prix et catégories de produits et services.',
      'landing.how.3': 'Partagez et vendez', 'landing.how.3.desc': 'Partagez votre lien et recevez les commandes.',
      'landing.features.title': 'Fonctionnalités', 'landing.types.title': 'Pour tout type de commerce',
      'landing.pricing.title': 'Tarifs simples', 'landing.pricing.free': 'Plan Gratuit',
      'landing.pricing.free.desc': 'L’essentiel pour démarrer', 'landing.pricing.cta': 'Commencer gratuitement',
      'landing.faq.title': 'Questions fréquentes', 'landing.cta.title': 'Recevez des commandes dès aujourd’hui',
      'landing.cta.sub': 'Créez votre catalogue gratuitement.', 'landing.cta.button': 'Créer mon catalogue',

      'login.signin': 'Connexion', 'login.signup': 'Créer un compte', 'login.business': 'Nom du commerce',
      'login.email': 'E-mail', 'login.password': 'Mot de passe', 'login.forgot': 'Mot de passe oublié ?',
      'login.submit': 'Entrer', 'login.create': 'Créer mon compte', 'login.have': 'Déjà un compte ?',
      'login.no': 'Pas encore de compte ?', 'login.welcome': 'Bon retour', 'login.start': 'Créez votre catalogue gratuitement',
      'login.demo.note': 'Mode démo : les données restent dans ce navigateur.',

      'nav.principal': 'Principal', 'nav.catalog': 'Catalogue', 'nav.business': 'Mon commerce',
      'nav.home': 'Accueil', 'nav.orders': 'Commandes', 'nav.agenda': 'Agenda', 'nav.sales': 'Ventes',
      'nav.products': 'Produits', 'nav.categories': 'Catégories', 'nav.library': 'Bibliothèque',
      'nav.settings': 'Configurer', 'nav.plan': 'Plan et usage', 'nav.account': 'Mon compte',
      'nav.admin': 'Administration', 'nav.preview': 'Voir le catalogue',

      'home.ready': 'Préparation du catalogue', 'home.published': 'Catalogue publié',
      'home.sub': 'Préparez l’essentiel et publiez votre catalogue pour recevoir des commandes.',
      'home.prepare': 'Préparer la publication', 'home.addproduct': '+ Ajouter un produit',
      'home.requirements': 'conditions pour publier', 'home.pending': 'En attente',
      'home.complete': 'Compléter la configuration', 'home.manage': 'Gérer les produits',
      'home.summary': 'Résumé', 'home.quick': 'Aperçu', 'home.products': 'Produits',
      'home.categories': 'Catégories', 'home.orders': 'Commandes', 'home.activity': 'Activité',
      'home.activity.title': 'Derniers événements', 'home.activity.empty': 'Vos cinq événements récents.',
      'home.newproduct': 'Nouveau produit', 'home.newproduct.desc': 'Ajoutez vite un produit.',
      'home.vieworders': 'Voir les commandes', 'home.vieworders.desc': 'Gérez les commandes reçues.',
      'home.config': 'Configurer le commerce', 'home.config.desc': 'Marque, WhatsApp, devise, livraison…',
      'home.publish': 'Préparer la publication', 'home.publish.desc': 'Vérifiez ce qui manque.',
      'home.req.link': 'Aucun sous-domaine assigné.',
      'home.req.whatsapp': 'Le WhatsApp du commerce doit être valide.',
      'home.req.product': 'Au moins un produit actif est requis.',
      'home.req.address': 'Aucune adresse publique configurée.',

      'prod.new': 'Ajouter un produit', 'prod.edit': 'Modifier le produit', 'prod.info': 'Information',
      'prod.data': 'Données du produit', 'prod.data.desc': 'Nom, catégorie et emplacement.',
      'prod.name': 'Nom du produit', 'prod.url': 'URL du produit', 'prod.desc': 'Description',
      'prod.sort': 'Ordre d’affichage', 'prod.sort.hint': 'Un petit numéro affiche le produit en premier.',
      'prod.price.title': 'Prix', 'prod.regular': 'Prix normal', 'prod.promo': 'Prix promo',
      'prod.promo.hint': 'Laissez vide s’il n’y a pas de promotion.',
      'prod.images.title': 'Images du produit', 'prod.images.hint': 'Jusqu’à 5 images. La première est principale.',
      'prod.type': 'Type', 'prod.type.product': 'Produit', 'prod.type.service': 'Service',
      'prod.duration': 'Durée', 'prod.modality': 'Modalité', 'prod.bookable': 'Permettre la réservation',
      'prod.save': 'Enregistrer', 'prod.views': 'Vues', 'prod.empty': 'Aucun produit',
      'prod.empty.desc': 'Ajoutez votre premier produit.', 'prod.tip': 'Pour un catalogue clair',
      'prod.tip.1': 'Un nom court et facile.', 'prod.tip.2': 'Le prix promo doit être réel.',
      'prod.tip.3': 'Des images nettes aident l’acheteur.', 'prod.currency': 'Devise',

      'cat.new': 'Ajouter une catégorie', 'cat.title': 'Catégories',
      'cat.sub': 'Organisez les produits pour que vos clients trouvent facilement.',
      'cat.list': 'Liste des catégories', 'cat.list.hint': 'Le plus petit ordre apparaît en premier.',
      'cat.default': 'Par défaut', 'cat.data': 'Données de la catégorie', 'cat.slug': 'Slug / URL',
      'cat.image': 'Image représentative', 'cat.alt': 'Texte alternatif', 'cat.save': 'Enregistrer',
      'cat.count': 'Catégories', 'cat.organized': 'Produits organisés', 'cat.distributed': 'Répartis dans les catégories',

      'ord.title': 'Commandes', 'ord.sub': 'Consultez et gérez les commandes.', 'ord.code': 'Code',
      'ord.list': 'Liste des commandes', 'ord.empty': 'Aucune commande',
      'ord.empty.desc': 'Les commandes apparaîtront ici.', 'ord.customer': 'Client', 'ord.total': 'Total',
      'ord.date': 'Date', 'ord.detail': 'Détail', 'ord.contact': 'Contacter par WhatsApp',
      'ord.status.new': 'Nouvelle', 'ord.status.confirmed': 'Confirmée',
      'ord.status.delivered': 'Livrée', 'ord.status.cancelled': 'Annulée',

      'set.title': 'Configuration du commerce', 'set.sub': 'Choisissez la partie à configurer.',
      'set.info': 'Informations', 'set.info.desc': 'Nom, description, localisation, fuseau.',
      'set.whatsapp': 'WhatsApp', 'set.whatsapp.desc': 'Numéro qui reçoit les commandes.',
      'set.brand': 'Marque', 'set.brand.desc': 'Logo et couleur principale.',
      'set.currency': 'Devise', 'set.currency.desc': 'Devise des prix et commandes.',
      'set.link': 'Lien du catalogue', 'set.link.desc': 'Le lien à partager.',
      'set.presentation': 'Présentation', 'set.presentation.desc': 'Titre, description et image.',
      'set.delivery': 'Livraison', 'set.delivery.desc': 'Comment la livraison est coordonnée.',
      'set.payments': 'Paiements', 'set.payments.desc': 'Options indiquées par le client.',
      'set.hours': 'Horaires', 'set.hours.desc': 'Jours et heures d’ouverture.',
      'set.seo': 'SEO et partage', 'set.seo.desc': 'Aperçu lors du partage.',
      'set.configured': 'Configuré', 'set.missing': 'À configurer', 'set.optional': 'Facultatif', 'set.pending': 'En attente',
      'set.configure': 'Configurer', 'set.personalize': 'Personnaliser', 'set.choose': 'Choisir le lien',
      'set.current': 'Actuel', 'set.save': 'Enregistrer',

      'plan.title': 'Plan et usage', 'plan.sub': 'Votre plan, l’espace disponible et les avantages Pro.',
      'plan.current': 'Votre plan', 'plan.free': 'Free', 'plan.free.desc': 'Sans frais mensuels.',
      'plan.products': 'Produits enregistrés', 'plan.storage': 'Espace images',
      'plan.includes': 'Votre plan inclut', 'plan.pro': 'Plan Pro',
      'plan.pro.unavailable': 'Pro n’est pas encore disponible.',

      'acc.title': 'Mon compte', 'acc.profile': 'Profil', 'acc.changeemail': 'Changer l’e-mail',
      'acc.changepass': 'Changer le mot de passe', 'acc.reset': 'Réinitialiser', 'acc.export': 'Exporter mes données (JSON)',
      'acc.delete': 'Supprimer le commerce', 'acc.delete.hint': 'Tapez SUPPRIMER pour confirmer.',
      'acc.newpass': 'Nouveau mot de passe',

      'adm.title': 'Administration', 'adm.sub': 'Gérez les comptes et la couverture des utilisateurs et commerces.',
      'adm.accounts': 'Comptes', 'adm.metrics': 'Métriques', 'adm.coverage': 'Couverture',
      'adm.owner': 'Propriétaire', 'adm.state': 'État', 'adm.published': 'Publié', 'adm.hidden': 'Masqué',
      'adm.publish': 'Publier', 'adm.hide': 'Masquer', 'adm.detail': 'Détail',
      'adm.members': 'Collaborateurs', 'adm.member.add': 'Donner accès à un utilisateur',
      'adm.member.email': 'E-mail', 'adm.member.role': 'Rôle', 'adm.member.support': 'Support (lecture)',
      'adm.member.manager': 'Gestionnaire', 'adm.member.owner': 'Propriétaire', 'adm.transfer': 'Transférer',
      'adm.superadmins': 'Super administrateurs', 'adm.addadmin': 'Ajouter un super admin',
      'adm.audit': 'Audit récent', 'adm.metrics.signups': 'Inscriptions par mois',
      'adm.metrics.topviews': 'Produits les plus vus', 'adm.metrics.ranking': 'Classement par commandes',
      'adm.storage': 'Stockage', 'adm.plan': 'Plan', 'adm.limit': 'Limite',

      'onb.step': 'Étape', 'onb.of': 'sur', 'onb.business': 'Votre commerce', 'onb.whatsapp': 'Votre WhatsApp',
      'onb.brand': 'Votre marque', 'onb.link': 'Votre lien', 'onb.delivery': 'Livraison et paiement',
      'onb.done': 'Tout est prêt !', 'onb.done.sub': 'Votre catalogue est prêt. Partagez le lien.',
      'onb.available': 'Disponible !', 'onb.taken': 'Déjà utilisé', 'onb.gotodash': 'Mon tableau de bord',
      'onb.viewcatalog': 'Voir mon catalogue',

      'cat.public.products': 'Produits', 'cat.public.services': 'Services', 'cat.public.type': 'Type',
      'cat.public.sort': 'Trier', 'cat.public.recommended': 'Recommandé', 'cat.public.priceasc': 'Prix croissant',
      'cat.public.pricedesc': 'Prix décroissant', 'cat.public.news': 'Nouveautés', 'cat.public.search': 'Rechercher…',
      'cat.public.add': '+ Ajouter', 'cat.public.request': '+ Demander', 'cat.public.book': '+ Réserver',
      'cat.public.details': 'Voir détails', 'cat.public.consult': 'Sur devis', 'cat.public.offer': 'Promo',
      'cat.public.save': 'Économie', 'cat.public.duration': 'Durée', 'cat.public.modality': 'Modalité',
      'cat.public.available': 'Disponible', 'cat.public.category': 'Catégorie', 'cat.public.delivery': 'Livraison',
      'cat.public.payment': 'Paiement', 'cat.public.cart': 'Votre commande', 'cat.public.emptycart': 'Commande vide',
      'cat.public.yourdata': 'Vos données', 'cat.public.address': 'Adresse', 'cat.public.city': 'Ville',
      'cat.public.note': 'Note', 'cat.public.appt': 'Date et heure', 'cat.public.date': 'Date', 'cat.public.time': 'Heure',
      'cat.public.send': 'Envoyer par WhatsApp', 'cat.public.quantity': 'Quantité', 'cat.public.subtotal': 'Sous-total',
      'cat.public.fee': 'Livraison', 'cat.public.total': 'Total', 'cat.public.notfound': 'Catalogue introuvable',
      'cat.public.notfound.desc': 'Ce commerce n’existe pas ou n’est pas publié.',
      'cat.public.closed': 'Le commerce est fermé ce jour-là.', 'cat.public.required': 'Nom et téléphone obligatoires.'
    },

    ar: {
      'app.name': 'كاتالوغو وا',
      'common.save': 'حفظ', 'common.cancel': 'إلغاء', 'common.delete': 'حذف', 'common.edit': 'تعديل',
      'common.back': 'رجوع', 'common.next': 'التالي', 'common.prev': 'السابق', 'common.finish': 'إنهاء',
      'common.close': 'إغلاق', 'common.search': 'بحث', 'common.all': 'الكل', 'common.loading': 'جارٍ التحميل…',
      'common.confirm': 'تأكيد', 'common.yes': 'نعم', 'common.no': 'لا', 'common.optional': 'اختياري',
      'common.required': 'مطلوب', 'common.none': 'لا شيء', 'common.add': 'إضافة', 'common.actions': 'إجراءات',
      'common.status': 'الحالة', 'common.name': 'الاسم', 'common.email': 'البريد الإلكتروني',
      'common.password': 'كلمة المرور', 'common.phone': 'الهاتف', 'common.price': 'السعر',
      'common.category': 'الفئة', 'common.image': 'صورة', 'common.images': 'صور', 'common.order': 'الترتيب',
      'common.active': 'نشط', 'common.inactive': 'غير نشط', 'common.copy': 'نسخ', 'common.copied': 'تم النسخ',
      'common.share': 'مشاركة', 'common.export': 'تصدير', 'common.logout': 'تسجيل الخروج',
      'common.demo': 'وضع تجريبي', 'common.lang': 'اللغة',

      'landing.hero.title': 'كتالوجك الإلكتروني، والطلبات عبر واتساب',
      'landing.hero.sub': 'أنشئ كتالوج متجرك في دقائق. شارك رابطًا واستقبل الطلبات مباشرة على واتساب، بدون عمولة.',
      'landing.hero.cta1': 'أنشئ كتالوجي', 'landing.hero.cta2': 'شاهد مثالًا',
      'landing.problem.title': 'لا تفقد الطلبات في المحادثة',
      'landing.problem.a': 'طلبات غير منظمة', 'landing.problem.a.desc': 'رسائل متفرقة وأسعار منسية.',
      'landing.problem.b': 'كتالوج منظم وجاهز', 'landing.problem.b.desc': 'رابط بمنتجاتك وأسعارك. العميل يجهّز طلبه ويرسله.',
      'landing.value.title': 'كل ما تحتاجه للبيع', 'landing.value.1': 'جاهز في دقائق',
      'landing.value.1.desc': 'بدون تثبيت وبدون تعقيد.', 'landing.value.2': 'بدون عمولة',
      'landing.value.2.desc': 'الطلب يصلك على واتساب.', 'landing.value.3': 'بثلاث لغات',
      'landing.value.3.desc': 'الإسبانية والفرنسية والعربية.',
      'landing.how.title': 'كيف يعمل', 'landing.how.1': 'أنشئ حسابك', 'landing.how.1.desc': 'سجّل واعدّ متجرك.',
      'landing.how.2': 'أضف المنتجات', 'landing.how.2.desc': 'صور وأسعار وفئات للمنتجات والخدمات.',
      'landing.how.3': 'شارك وبِع', 'landing.how.3.desc': 'شارك رابطك واستقبل الطلبات.',
      'landing.features.title': 'الميزات', 'landing.types.title': 'لكل أنواع الأنشطة',
      'landing.pricing.title': 'أسعار بسيطة', 'landing.pricing.free': 'الخطة المجانية',
      'landing.pricing.free.desc': 'كل الأساسيات للبدء', 'landing.pricing.cta': 'ابدأ مجانًا',
      'landing.faq.title': 'أسئلة شائعة', 'landing.cta.title': 'ابدأ باستقبال الطلبات اليوم',
      'landing.cta.sub': 'أنشئ كتالوجك مجانًا.', 'landing.cta.button': 'أنشئ كتالوجي',

      'login.signin': 'تسجيل الدخول', 'login.signup': 'إنشاء حساب', 'login.business': 'اسم المتجر',
      'login.email': 'البريد الإلكتروني', 'login.password': 'كلمة المرور', 'login.forgot': 'نسيت كلمة المرور؟',
      'login.submit': 'دخول', 'login.create': 'أنشئ حسابي', 'login.have': 'لديك حساب؟',
      'login.no': 'ليس لديك حساب؟', 'login.welcome': 'مرحبًا بعودتك', 'login.start': 'أنشئ كتالوجك مجانًا',
      'login.demo.note': 'وضع تجريبي: تُحفظ البيانات في هذا المتصفح فقط.',

      'nav.principal': 'الرئيسية', 'nav.catalog': 'الكتالوج', 'nav.business': 'متجري', 'nav.home': 'الرئيسية',
      'nav.orders': 'الطلبات', 'nav.agenda': 'المواعيد', 'nav.sales': 'المبيعات', 'nav.products': 'المنتجات',
      'nav.categories': 'الفئات', 'nav.library': 'الصور', 'nav.settings': 'إعداد المتجر',
      'nav.plan': 'الخطة والاستهلاك', 'nav.account': 'حسابي', 'nav.admin': 'الإدارة', 'nav.preview': 'عرض الكتالوج',

      'home.ready': 'تجهيز الكتالوج', 'home.published': 'الكتالوج منشور',
      'home.sub': 'جهّز الأساسيات وانشر كتالوجك لاستقبال الطلبات.', 'home.prepare': 'تجهيز النشر',
      'home.addproduct': '+ إضافة منتج', 'home.requirements': 'متطلبات النشر', 'home.pending': 'معلّق',
      'home.complete': 'إكمال الإعداد', 'home.manage': 'إدارة المنتجات', 'home.summary': 'الملخص',
      'home.quick': 'نظرة سريعة', 'home.products': 'منتجات', 'home.categories': 'فئات', 'home.orders': 'طلبات',
      'home.activity': 'النشاط', 'home.activity.title': 'آخر ما حدث', 'home.activity.empty': 'أحدث خمسة أحداث.',
      'home.newproduct': 'منتج جديد', 'home.newproduct.desc': 'أضف منتجًا بسرعة.', 'home.vieworders': 'عرض الطلبات',
      'home.vieworders.desc': 'راجع وأدر الطلبات.', 'home.config': 'إعداد المتجر', 'home.config.desc': 'الهوية وواتساب والعملة والتوصيل.',
      'home.publish': 'تجهيز النشر', 'home.publish.desc': 'راجع ما ينقص قبل النشر.',
      'home.req.link': 'لم يتم تعيين رابط بعد.', 'home.req.whatsapp': 'رقم واتساب المتجر غير صالح.',
      'home.req.product': 'يجب وجود منتج نشط واحد على الأقل.', 'home.req.address': 'لا يوجد رابط عام بعد.',

      'prod.new': 'إضافة منتج', 'prod.edit': 'تعديل منتج', 'prod.info': 'معلومات', 'prod.data': 'بيانات المنتج',
      'prod.data.desc': 'الاسم والفئة والرابط.', 'prod.name': 'اسم المنتج', 'prod.url': 'رابط المنتج',
      'prod.desc': 'الوصف', 'prod.sort': 'ترتيب العرض', 'prod.sort.hint': 'الأرقام الأصغر تظهر أولًا.',
      'prod.price.title': 'الأسعار', 'prod.regular': 'السعر العادي', 'prod.promo': 'سعر العرض',
      'prod.promo.hint': 'اتركه فارغًا إن لم يوجد عرض.', 'prod.images.title': 'صور المنتج',
      'prod.images.hint': 'حتى 5 صور. الأولى هي الرئيسية.', 'prod.type': 'النوع', 'prod.type.product': 'منتج',
      'prod.type.service': 'خدمة', 'prod.duration': 'المدة', 'prod.modality': 'الطريقة',
      'prod.bookable': 'السماح بالحجز', 'prod.save': 'حفظ المنتج', 'prod.views': 'مشاهدات',
      'prod.empty': 'لا توجد منتجات', 'prod.empty.desc': 'أضف أول منتج.', 'prod.tip': 'لكتالوج واضح',
      'prod.tip.1': 'اسم قصير وسهل.', 'prod.tip.2': 'سعر العرض يجب أن يكون حقيقيًا.', 'prod.tip.3': 'صور واضحة تساعد العميل.',
      'prod.currency': 'عملة المتجر',

      'cat.new': 'إضافة فئة', 'cat.title': 'الفئات', 'cat.sub': 'نظّم المنتجات ليجد عملاؤك ما يريدون.',
      'cat.list': 'قائمة الفئات', 'cat.list.hint': 'الترتيب الأصغر يظهر أولًا.', 'cat.default': 'افتراضية',
      'cat.data': 'بيانات الفئة', 'cat.slug': 'الرابط', 'cat.image': 'صورة الفئة', 'cat.alt': 'النص البديل',
      'cat.save': 'حفظ الفئة', 'cat.count': 'الفئات', 'cat.organized': 'منتجات منظمة', 'cat.distributed': 'موزعة على الفئات',

      'ord.title': 'الطلبات', 'ord.sub': 'راجع وأدر الطلبات.', 'ord.code': 'رمز الطلب', 'ord.list': 'قائمة الطلبات',
      'ord.empty': 'لا توجد طلبات', 'ord.empty.desc': 'ستظهر الطلبات هنا.', 'ord.customer': 'العميل',
      'ord.total': 'المجموع', 'ord.date': 'التاريخ', 'ord.detail': 'تفاصيل الطلب', 'ord.contact': 'تواصل عبر واتساب',
      'ord.status.new': 'جديد', 'ord.status.confirmed': 'مؤكد', 'ord.status.delivered': 'تم التسليم', 'ord.status.cancelled': 'ملغى',

      'set.title': 'إعدادات المتجر', 'set.sub': 'اختر ما تريد إعداده.', 'set.info': 'معلومات المتجر',
      'set.info.desc': 'الاسم والوصف والموقع.', 'set.whatsapp': 'واتساب', 'set.whatsapp.desc': 'الرقم الذي تستقبل عليه الطلبات.',
      'set.brand': 'الهوية', 'set.brand.desc': 'الشعار واللون الأساسي.', 'set.currency': 'العملة',
      'set.currency.desc': 'عملة الأسعار.', 'set.link': 'رابط الكتالوج', 'set.link.desc': 'الرابط الذي تشاركه.',
      'set.presentation': 'عرض الكتالوج', 'set.presentation.desc': 'العنوان والوصف والصورة.',
      'set.delivery': 'التوصيل', 'set.delivery.desc': 'كيفية التوصيل.', 'set.payments': 'طرق الدفع',
      'set.payments.desc': 'الخيارات المتاحة للعميل.', 'set.hours': 'ساعات العمل', 'set.hours.desc': 'أيام وأوقات العمل.',
      'set.seo': 'السيو والمشاركة', 'set.seo.desc': 'كيف يظهر كتالوجك.', 'set.configured': 'مُعد',
      'set.missing': 'ينقص الإعداد', 'set.optional': 'اختياري', 'set.pending': 'معلّق', 'set.configure': 'إعداد',
      'set.personalize': 'تخصيص', 'set.choose': 'اختيار الرابط', 'set.current': 'الحالي', 'set.save': 'حفظ التغييرات',

      'plan.title': 'الخطة والاستهلاك', 'plan.sub': 'راجع خطتك والمساحة المتاحة.', 'plan.current': 'خطتك الحالية',
      'plan.free': 'مجانية', 'plan.free.desc': 'بدون رسوم شهرية.', 'plan.products': 'منتجات محفوظة',
      'plan.storage': 'مساحة الصور', 'plan.includes': 'تشمل خطتك', 'plan.pro': 'خطة برو',
      'plan.pro.unavailable': 'برو غير متاحة حاليًا.',

      'acc.title': 'حسابي', 'acc.profile': 'الملف', 'acc.changeemail': 'تغيير البريد',
      'acc.changepass': 'تغيير كلمة المرور', 'acc.reset': 'استعادة كلمة المرور',
      'acc.export': 'تصدير بياناتي (JSON)', 'acc.delete': 'حذف المتجر',
      'acc.delete.hint': 'اكتب حذف للتأكيد.', 'acc.newpass': 'كلمة مرور جديدة',

      'adm.title': 'الإدارة', 'adm.sub': 'أدر الحسابات وتغطية المستخدمين والمتاجر.', 'adm.accounts': 'الحسابات',
      'adm.metrics': 'المقاييس', 'adm.coverage': 'التغطية', 'adm.owner': 'المالك', 'adm.state': 'الحالة',
      'adm.published': 'منشور', 'adm.hidden': 'مخفي', 'adm.publish': 'نشر', 'adm.hide': 'إخفاء',
      'adm.detail': 'تفاصيل', 'adm.members': 'المتعاونون', 'adm.member.add': 'منح التغطية لمستخدم',
      'adm.member.email': 'بريد المستخدم', 'adm.member.role': 'الدور', 'adm.member.support': 'دعم (قراءة فقط)',
      'adm.member.manager': 'مدير (يمكنه التعديل)', 'adm.member.owner': 'مالك', 'adm.transfer': 'نقل الملكية',
      'adm.superadmins': 'المشرفون العامون', 'adm.addadmin': 'إضافة مشرف عام', 'adm.audit': 'سجل التدقيق',
      'adm.metrics.signups': 'التسجيلات شهريًا', 'adm.metrics.topviews': 'الأكثر مشاهدة', 'adm.metrics.ranking': 'الترتيب حسب الطلبات',
      'adm.storage': 'التخزين', 'adm.plan': 'الخطة', 'adm.limit': 'الحد',

      'onb.step': 'خطوة', 'onb.of': 'من', 'onb.business': 'متجرك', 'onb.whatsapp': 'واتساب',
      'onb.brand': 'هويتك', 'onb.link': 'رابطك', 'onb.delivery': 'التوصيل والدفع', 'onb.done': 'كل شيء جاهز!',
      'onb.done.sub': 'كتالوجك جاهز. شارك الرابط.', 'onb.available': 'متاح!', 'onb.taken': 'مستخدم',
      'onb.gotodash': 'إلى لوحتي', 'onb.viewcatalog': 'عرض كتالوجي',

      'cat.public.products': 'منتجات', 'cat.public.services': 'خدمات', 'cat.public.type': 'النوع',
      'cat.public.sort': 'ترتيب', 'cat.public.recommended': 'موصى به', 'cat.public.priceasc': 'السعر: من الأقل',
      'cat.public.pricedesc': 'السعر: من الأعلى', 'cat.public.news': 'الجديد', 'cat.public.search': 'بحث…',
      'cat.public.add': '+ إضافة', 'cat.public.request': '+ طلب', 'cat.public.book': '+ حجز',
      'cat.public.details': 'التفاصيل', 'cat.public.consult': 'حسب الطلب', 'cat.public.offer': 'عرض',
      'cat.public.save': 'التوفير', 'cat.public.duration': 'المدة', 'cat.public.modality': 'الطريقة',
      'cat.public.available': 'متاح', 'cat.public.category': 'الفئة', 'cat.public.delivery': 'التوصيل',
      'cat.public.payment': 'الدفع', 'cat.public.cart': 'طلبك', 'cat.public.emptycart': 'طلبك فارغ',
      'cat.public.yourdata': 'بياناتك', 'cat.public.address': 'العنوان', 'cat.public.city': 'المدينة',
      'cat.public.note': 'ملاحظة', 'cat.public.appt': 'التاريخ والوقت', 'cat.public.date': 'التاريخ',
      'cat.public.time': 'الوقت', 'cat.public.send': 'إرسال الطلب عبر واتساب', 'cat.public.quantity': 'الكمية',
      'cat.public.subtotal': 'المجموع الفرعي', 'cat.public.fee': 'التوصيل', 'cat.public.total': 'المجموع',
      'cat.public.notfound': 'الكتالوج غير موجود', 'cat.public.notfound.desc': 'هذا المتجر غير موجود أو غير منشور.',
      'cat.public.closed': 'المتجر مغلق في هذا اليوم.', 'cat.public.required': 'الاسم والهاتف مطلوبان.'
    }
  };

  var i18n = {
    lang: (function () {
      try {
        var url = new URLSearchParams(location.search).get('lang');
        if (url && DICT[url]) { localStorage.setItem('cw_lang', url); return url; }
        return localStorage.getItem('cw_lang') || cfg.defaultLang;
      } catch (e) { return cfg.defaultLang; }
    })(),

    t: function (key, vars) {
      var pack = DICT[this.lang] || DICT.es;
      var s = pack[key] != null ? pack[key] : (DICT.es[key] != null ? DICT.es[key] : key);
      if (vars) Object.keys(vars).forEach(function (k) { s = s.replace(new RegExp('\\{' + k + '\\}', 'g'), vars[k]); });
      return s;
    },

    dir: function () { return this.lang === 'ar' ? 'rtl' : 'ltr'; },

    setLang: function (l) {
      if (!DICT[l]) return;
      this.lang = l;
      try { localStorage.setItem('cw_lang', l); } catch (e) {}
      document.documentElement.lang = l;
      document.documentElement.dir = this.dir();
      this.apply();
      window.dispatchEvent(new CustomEvent('cw:lang', { detail: { lang: l } }));
    },

    // Traduce todos los [data-i18n] y [data-i18n-ph] dentro de root.
    apply: function (root) {
      root = root || document;
      document.documentElement.lang = this.lang;
      document.documentElement.dir = this.dir();
      var self = this;
      root.querySelectorAll('[data-i18n]').forEach(function (el) {
        var k = el.getAttribute('data-i18n');
        var attr = el.getAttribute('data-i18n-attr');
        if (attr) el.setAttribute(attr, self.t(k));
        else el.textContent = self.t(k);
      });
      root.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
        el.setAttribute('placeholder', self.t(el.getAttribute('data-i18n-ph')));
      });
      root.querySelectorAll('[data-i18n-title]').forEach(function (el) {
        el.setAttribute('title', self.t(el.getAttribute('data-i18n-title')));
      });
    },

    // Menú desplegable de idioma (banderas)
    flags: { es: '🇪🇸', fr: '🇫🇷', ar: '🇲🇦' },

    langSwitcher: function (el) {
      var self = this;
      function render() {
        el.innerHTML = cfg.languages.map(function (l) {
          return '<button type="button" class="lang-btn' + (l === self.lang ? ' active' : '') + '" data-lang="' + l + '">' +
            self.flags[l] + ' <span>' + l.toUpperCase() + '</span></button>';
        }).join('');
        el.querySelectorAll('[data-lang]').forEach(function (b) {
          b.addEventListener('click', function () { self.setLang(b.getAttribute('data-lang')); render(); });
        });
      }
      render();
      window.addEventListener('cw:lang', render);
    }
  };

  CW.i18n = i18n;
})(window);
