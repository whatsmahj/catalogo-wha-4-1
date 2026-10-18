/* ==========================================================================
   Catalogo Wha · dashboard.js
   Panel del negocio + administración (con cobertura de usuarios/negocios).
   ========================================================================== */
(function (window, document) {
  'use strict';
  var CW = window.CW;
  var $ = CW.$, $$ = CW.$$, esc = CW.esc, money = CW.money, t = function (k, v) { return CW.i18n.t(k, v); };

  var state = {
    session: null, biz: null, isAdmin: false,
    cats: [], products: [], orders: [], library: [],
    route: 'home', sub: null
  };

  // ---------------------------------------------------------------------
  // Helpers de datos
  // ---------------------------------------------------------------------
  function loadAll() {
    if (!state.biz) return Promise.resolve();
    var id = state.biz.id;
    return Promise.all([
      CW.store.listCategories(id),
      CW.store.listProducts(id),
      CW.store.listOrders(id),
      CW.store.listLibrary(id)
    ]).then(function (r) {
      state.cats = r[0]; state.products = r[1]; state.orders = r[2]; state.library = r[3];
    });
  }

  function catName(id) {
    var c = state.cats.find(function (x) { return x.id === id; });
    return c ? c.name : '';
  }

  function bizUrl() { return CW.catalogUrl(state.biz.slug); }

  function stripCountry(country, phone) {
    var c = CW.COUNTRY_CODES[country]; if (!c) return String(phone || '');
    var s = String(phone || '').replace(/[^\d]/g, '');
    if (s.indexOf(c.code) === 0) s = s.slice(c.code.length);
    return s;
  }

  // ---------------------------------------------------------------------
  // Arranque
  // ---------------------------------------------------------------------
  function boot() {
    CW.store.init().then(function () {
      return CW.store.getSession();
    }).then(function (sess) {
      if (!sess || !sess.user) { location.replace(CW.url('login.html')); return; }
      state.session = sess;
      state.biz = sess.business;
      if (!state.biz) {
        // Cuenta sin negocio (poco probable): lo creamos.
        return CW.store.getMyBusiness().then(function (b) { state.biz = b; });
      }
    }).then(function () {
      return CW.store.isAdmin().then(function (a) { state.isAdmin = a; });
    }).then(function () {
      if (!state.biz) { location.replace(CW.url('login.html')); return; }
      // ¿Asistente?
      var forceOnb = location.hash === '#onboarding';
      if (!state.biz.onboarded || forceOnb) { showOnboarding(); }
      $('[data-app]').hidden = false;
      if (state.isAdmin) $$('[data-admin-only]').forEach(function (e) { e.hidden = false; });
      renderBizChip();
      $('[data-crumb-business]').textContent = state.biz.name;
      var prev = $('[data-preview]'); if (prev) prev.href = CW.url('catalogo.html') + '?b=' + encodeURIComponent(state.biz.slug);
      loadAll().then(route);
      window.addEventListener('hashchange', route);
    });
  }

  function renderBizChip() {
    var chip = $('[data-biz-chip]');
    if (!chip) return;
    var initial = (state.biz.name || 'M').trim().charAt(0).toUpperCase();
    chip.innerHTML =
      '<div class="biz-avatar" style="background:' + esc(state.biz.brand_color || '#5B1A80') + '">' + esc(initial) + '</div>' +
      '<div class="biz-meta"><b>' + esc(state.biz.name) + '</b><small>' + (state.biz.published ? t('adm.published') : t('home.ready')) + '</small></div>';
  }

  // ---------------------------------------------------------------------
  // Router
  // ---------------------------------------------------------------------
  var ROUTES = ['home', 'orders', 'agenda', 'sales', 'products', 'categories', 'library', 'settings', 'plan', 'account', 'admin'];

  function route() {
    var h = location.hash.replace(/^#/, '') || 'home';
    var parts = h.split('/');
    state.route = ROUTES.indexOf(parts[0]) >= 0 ? parts[0] : 'home';
    state.sub = parts[1] || null;
    state.param = parts[2] || null;
    $$('.side-nav a[data-route]').forEach(function (a) { a.classList.toggle('active', a.dataset.route === state.route); });
    $('[data-crumb]').textContent = t('nav.' + state.route);
    closeSidebar();
    var view = $('[data-view]');
    var fn = ({
      home: renderHome, orders: renderOrders, agenda: renderAgenda, sales: renderSales,
      products: renderProducts, categories: renderCategories, library: renderLibrary,
      settings: renderSettings, plan: renderPlan, account: renderAccount, admin: renderAdmin
    })[state.route];
    if (state.route === 'admin' && !state.isAdmin) { view.innerHTML = '<p class="muted">403</p>'; return; }
    view.innerHTML = '';
    fn(view);
    CW.i18n.apply(view);
    window.scrollTo(0, 0);
  }

  // ---------------------------------------------------------------------
  // INICIO
  // ---------------------------------------------------------------------
  function renderHome(view) {
    var activeProducts = state.products.filter(function (p) { return p.active !== false; }).length;
    var reqs = [];
    if (!state.biz.slug) reqs.push(t('home.req.link'));
    if (!state.biz.whatsapp) reqs.push(t('home.req.whatsapp'));
    if (!activeProducts) reqs.push(t('home.req.product'));

    view.innerHTML =
      '<section class="hero-panel">' +
        '<span class="badge-soft">' + (state.biz.published ? '● ' + t('home.published') : '◆ ' + t('home.ready')) + '</span>' +
        '<h1>' + esc(state.biz.name) + '</h1>' +
        '<p>' + t('home.sub') + '</p>' +
        '<div class="hero-actions">' +
          '<button class="btn primary" data-go="settings/link">' + t('home.prepare') + ' ↗</button>' +
          '<button class="btn ghost" data-new-product>+ ' + t('home.newproduct') + '</button>' +
        '</div>' +
      '</section>' +

      '<div class="home-grid">' +
        '<section class="card">' +
          '<div class="card-head"><div><span class="kicker">' + t('nav.catalog').toUpperCase() + '</span>' +
          '<h3>' + (reqs.length ? t('home.requirements').replace('{n}', reqs.length).replace('%s', reqs.length) : t('home.published')) + '</h3></div>' +
          '<span class="tag ' + (reqs.length ? 'warn' : 'ok') + '">' + (reqs.length ? '● ' + t('home.pending') : '✓ ' + t('set.configured')) + '</span></div>' +
          '<p class="muted">' + t('home.sub') + '</p>' +
          (state.biz.slug ? '<div class="url-line">' + esc(bizUrl()) + '</div>' : '<div class="url-line empty">' + t('home.req.address') + '</div>') +
          (reqs.length ? '<ul class="req-list">' + reqs.map(function (r) { return '<li>• ' + esc(r) + '</li>'; }).join('') + '</ul>' : '') +
          '<div class="card-actions"><button class="btn primary" data-go="settings">' + t('home.complete') + '</button>' +
          '<button class="btn ghost" data-go="products">' + t('home.manage') + '</button></div>' +
        '</section>' +

        '<section class="card summary">' +
          '<span class="kicker">' + t('home.summary').toUpperCase() + '</span>' +
          '<h3>' + t('home.quick') + '</h3>' +
          '<p class="muted">' + t('home.activity.empty') + '</p>' +
          '<div class="stat-row">' +
            '<div class="stat"><small>' + t('home.products').toUpperCase() + '</small><b>' + state.products.length + '</b></div>' +
            '<div class="stat"><small>' + t('home.categories').toUpperCase() + '</small><b>' + state.cats.length + '</b></div>' +
            '<div class="stat"><small>' + t('home.orders').toUpperCase() + '</small><b>' + state.orders.length + '</b></div>' +
          '</div>' +
        '</section>' +
      '</div>' +

      '<div class="quick-grid">' +
        quick('📦', t('home.newproduct'), t('home.newproduct.desc'), 'products/new') +
        quick('🧾', t('home.vieworders'), t('home.vieworders.desc'), 'orders') +
        quick('⚙️', t('home.config'), t('home.config.desc'), 'settings') +
        quick('🚀', t('home.publish'), t('home.publish.desc'), 'settings/link') +
      '</div>' +

      '<section class="card activity">' +
        '<span class="kicker">' + t('home.activity').toUpperCase() + '</span>' +
        '<h3>' + t('home.activity.title') + '</h3>' +
        '<p class="muted">' + t('home.activity.empty') + '</p>' +
        (function () {
          var ev = [];
          state.orders.slice(0, 6).forEach(function (o) { ev.push({ t: o.created_at, icon: '🧾', text: t('nav.orders') + ' · ' + (o.code || '') + ' · ' + (o.customer_name || '') }); });
          state.products.slice(0, 6).forEach(function (p) { ev.push({ t: p.created_at, icon: '📦', text: (p.name || '') }); });
          ev.sort(function (a, b) { return new Date(b.t) - new Date(a.t); });
          ev = ev.slice(0, 5);
          if (!ev.length) return '<div class="activity-item muted">' + t('common.none') + '</div>';
          return ev.map(function (e) { return '<div class="activity-item">' + e.icon + ' ' + esc(e.text) + ' <small class="muted">' + CW.api.dateTime(e.t) + '</small></div>'; }).join('');
        })() +
      '</section>';

    bindGo(view);
    var np = $('[data-new-product]', view); if (np) np.addEventListener('click', function () { location.hash = '#products/new'; });
  }

  function quick(icon, title, desc, go) {
    return '<button class="quick-card" data-go="' + go + '"><span class="qc-icon">' + icon + '</span><b>' + esc(title) + '</b><small>' + esc(desc) + '</small></button>';
  }

  function bindGo(root) {
    $$('[data-go]', root).forEach(function (b) {
      b.addEventListener('click', function () { location.hash = '#' + b.dataset.go; });
    });
  }

  // ---------------------------------------------------------------------
  // PEDIDOS
  // ---------------------------------------------------------------------
  function renderOrders(view) {
    view.innerHTML =
      '<div class="view-head"><div><h1>' + t('ord.title') + '</h1><p class="muted">' + t('ord.sub') + '</p></div></div>' +
      '<section class="card filter-bar">' +
        '<label class="field"><span>' + t('ord.code') + '</span><input data-f-code placeholder="ORG-8F42KD"></label>' +
        '<label class="field"><span>' + t('common.status') + '</span><select data-f-status>' +
          '<option value="">' + t('common.all') + '</option>' +
          ['new', 'confirmed', 'delivered', 'cancelled'].map(function (s) { return '<option value="' + s + '">' + t('ord.status.' + s) + '</option>'; }).join('') +
        '</select></label>' +
        '<label class="field"><span>Desde</span><input type="date" data-f-from></label>' +
        '<label class="field"><span>Hasta</span><input type="date" data-f-to></label>' +
        '<button class="btn primary" data-f-apply>' + t('common.search') + '</button>' +
        '<button class="btn ghost" data-f-csv>' + t('common.export') + ' CSV</button>' +
      '</section>' +
      '<section class="card"><div class="card-head"><h3>' + t('ord.list') + '</h3><span class="muted" data-count></span></div>' +
      '<div data-orders-table></div></section>';

    function apply() {
      var code = ($('[data-f-code]', view).value || '').toLowerCase();
      var st = $('[data-f-status]', view).value;
      var from = $('[data-f-from]', view).value;
      var to = $('[data-f-to]', view).value;
      var list = state.orders.filter(function (o) {
        if (code && !(o.code || '').toLowerCase().includes(code) && !(o.customer_name || '').toLowerCase().includes(code) && !(o.customer_phone || '').includes(code)) return false;
        if (st && o.status !== st) return false;
        if (from && new Date(o.created_at) < new Date(from + 'T00:00:00')) return false;
        if (to && new Date(o.created_at) > new Date(to + 'T23:59:59')) return false;
        return true;
      });
      $('[data-count]', view).textContent = list.length + ' ' + t('home.orders').toLowerCase();
      renderOrdersTable($('[data-orders-table]', view), list);
      view._filtered = list;
    }
    $('[data-f-apply]', view).addEventListener('click', apply);
    $('[data-f-code]', view).addEventListener('input', apply);
    $('[data-f-status]', view).addEventListener('change', apply);
    $('[data-f-csv]', view).addEventListener('click', function () {
      var rows = [['Codigo', 'Cliente', 'Telefono', 'Ciudad', 'Estado', 'Total', 'Fecha']];
      (view._filtered || []).forEach(function (o) {
        rows.push([o.code, o.customer_name, o.customer_phone, o.customer_city || '', o.status, o.total, o.created_at]);
      });
      CW.api.download('pedidos.csv', '\ufeff' + CW.api.toCSV(rows), 'text/csv');
    });
    apply();
  }

  function renderOrdersTable(host, list) {
    if (!list.length) {
      host.innerHTML = '<div class="empty-state"><div class="es-icon">🧾</div><b>' + t('ord.empty') + '</b><p>' + t('ord.empty.desc') + '</p></div>';
      return;
    }
    host.innerHTML = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
      '<th>' + t('ord.code') + '</th><th>' + t('ord.customer') + '</th><th>' + t('common.status') + '</th><th>' + t('ord.total') + '</th><th>' + t('ord.date') + '</th><th></th></tr></thead><tbody>' +
      list.map(function (o) {
        return '<tr><td><b>' + esc(o.code) + '</b></td><td>' + esc(o.customer_name) + '<br><small class="muted">' + esc(o.customer_phone) + '</small></td>' +
          '<td><span class="tag ' + statusClass(o.status) + '">' + t('ord.status.' + o.status) + '</span></td>' +
          '<td>' + money(o.total, state.biz.currency) + '</td><td>' + CW.api.dateTime(o.created_at) + '</td>' +
          '<td><button class="btn ghost small" data-view="' + o.id + '">' + t('ord.detail') + '</button></td></tr>';
      }).join('') + '</tbody></table></div>';
    $$('[data-view]', host).forEach(function (b) {
      b.addEventListener('click', function () { orderDetail(list.find(function (o) { return o.id === b.dataset.view; })); });
    });
  }
  function statusClass(s) { return s === 'new' ? 'warn' : s === 'confirmed' ? 'info' : s === 'delivered' ? 'ok' : 'bad'; }

  function orderDetail(o) {
    if (!o) return;
    var items = (o.items || []).map(function (it) {
      return '<li><span>' + esc(it.name) + (it.kind === 'service' ? ' (Servicio)' : '') + ' × ' + it.qty + '</span><b>' + (Number(it.price) > 0 ? money(it.price * it.qty, state.biz.currency) : t('cat.public.consult')) + '</b></li>';
    }).join('');
    var msg = CW.api.orderMessage(state.biz, o);
    var m = CW.modal({
      title: t('ord.detail') + ' · ' + o.code,
      html:
        '<div class="detail-block"><b>' + t('ord.customer') + '</b><p>' + esc(o.customer_name) + ' · ' + esc(o.customer_phone) + '</p>' +
        (o.customer_address ? '<p>' + esc(o.customer_address) + (o.customer_city ? ', ' + esc(o.customer_city) : '') + '</p>' : '') +
        (o.note ? '<p class="muted">' + esc(o.note) + '</p>' : '') + '</div>' +
        '<ul class="mini-list">' + items + '</ul>' +
        '<div class="detail-total"><span>' + t('cat.public.total') + '</span><b>' + money(o.total, state.biz.currency) + '</b></div>' +
        '<div class="status-picker">' + ['new', 'confirmed', 'delivered', 'cancelled'].map(function (s) {
          return '<button class="chip' + (o.status === s ? ' active' : '') + '" data-st="' + s + '">' + t('ord.status.' + s) + '</button>';
        }).join('') + '</div>',
      footer: '<a class="btn ghost" target="_blank" href="' + CW.api.waLink(o.customer_phone, msg) + '">' + t('ord.contact') + '</a>'
    });
    $$('[data-st]', m.modal).forEach(function (b) {
      b.addEventListener('click', function () {
        CW.store.updateOrderStatus(o.id, b.dataset.st).then(function () {
          o.status = b.dataset.st; CW.toast(t('common.save')); m.close(); loadAll().then(route);
        });
      });
    });
  }

  // ---------------------------------------------------------------------
  // AGENDA
  // ---------------------------------------------------------------------
  function renderAgenda(view) {
    var appts = state.orders.filter(function (o) { return o.appointment_at; })
      .sort(function (a, b) { return new Date(a.appointment_at) - new Date(b.appointment_at); });
    var groups = {};
    appts.forEach(function (o) {
      var d = new Date(o.appointment_at).toISOString().slice(0, 10);
      (groups[d] = groups[d] || []).push(o);
    });
    var keys = Object.keys(groups).sort();
    var now = Date.now();
    view.innerHTML = '<div class="view-head"><div><h1>' + t('nav.agenda') + '</h1></div></div>' +
      (keys.length ? keys.map(function (d) {
        return '<section class="card"><h3>' + new Date(d + 'T00:00:00').toLocaleDateString() + '</h3>' +
          groups[d].map(function (o) {
            var past = new Date(o.appointment_at).getTime() < now;
            return '<div class="appt' + (past ? ' past' : '') + '"><div class="appt-time">' +
              new Date(o.appointment_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + '</div>' +
              '<div class="appt-info"><b>' + esc(o.customer_name) + '</b><small>' + esc(o.code) + ' · ' + esc(o.customer_phone) + '</small></div>' +
              '<a class="btn ghost small" target="_blank" href="' + CW.api.waLink(o.customer_phone, CW.api.orderMessage(state.biz, o)) + '">💬</a></div>';
          }).join('') + '</section>';
      }).join('') : '<div class="card empty-state"><div class="es-icon">📅</div><b>' + t('ord.empty') + '</b></div>');
  }

  // ---------------------------------------------------------------------
  // VENTAS
  // ---------------------------------------------------------------------
  function renderSales(view) {
    var periods = { 7: '7 días', 30: '30 días', 365: '365 días', 0: t('common.all') };
    view.innerHTML = '<div class="view-head"><div><h1>' + t('nav.sales') + '</h1></div>' +
      '<div class="segmented" data-period>' + Object.keys(periods).map(function (k) {
        return '<button data-p="' + k + '" class="' + (k === '30' ? 'active' : '') + '">' + periods[k] + '</button>';
      }).join('') + '</div>' +
      '<button class="btn ghost" data-csv>' + t('common.export') + ' CSV</button></div><div data-sales></div>';
    function draw(days) {
      var from = days ? Date.now() - days * 864e5 : 0;
      var list = state.orders.filter(function (o) { return new Date(o.created_at).getTime() >= from && o.status !== 'cancelled'; });
      var billed = list.reduce(function (s, o) { return s + Number(o.total || 0); }, 0);
      var pending = list.filter(function (o) { return o.status === 'new'; }).length;
      var avg = list.length ? billed / list.length : 0;
      var byDay = {};
      list.forEach(function (o) { var d = o.created_at.slice(0, 10); byDay[d] = (byDay[d] || 0) + Number(o.total || 0); });
      var top = {};
      list.forEach(function (o) { (o.items || []).forEach(function (it) { top[it.name] = (top[it.name] || 0) + it.qty; }); });
      var topArr = Object.keys(top).map(function (k) { return { name: k, qty: top[k] }; }).sort(function (a, b) { return b.qty - a.qty; }).slice(0, 8);
      $('[data-sales]', view).innerHTML =
        '<div class="stat-cards">' +
          statCard('💵', 'Facturado', money(billed, state.biz.currency)) +
          statCard('🧾', 'Pedidos', list.length) +
          statCard('📊', 'Ticket medio', money(avg, state.biz.currency)) +
          statCard('⏳', 'Pendientes', pending) +
        '</div>' +
        '<div class="two-col"><section class="card"><h3>Ventas por día</h3>' +
          (Object.keys(byDay).length ? '<div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha</th><th>Total</th></tr></thead><tbody>' +
            Object.keys(byDay).sort().reverse().map(function (d) { return '<tr><td>' + d + '</td><td>' + money(byDay[d], state.biz.currency) + '</td></tr>'; }).join('') +
          '</tbody></table></div>' : '<p class="muted">—</p>') + '</section>' +
          '<section class="card"><h3>Productos más vendidos</h3>' +
          (topArr.length ? '<ul class="mini-list">' + topArr.map(function (x) { return '<li><span>' + esc(x.name) + '</span><b>' + x.qty + '</b></li>'; }).join('') + '</ul>' : '<p class="muted">—</p>') +
          '</section></div>';
      view._list = list;
    }
    $$('[data-period] button', view).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-period] button', view).forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active'); draw(Number(b.dataset.p));
      });
    });
    $('[data-csv]', view).addEventListener('click', function () {
      var rows = [['Codigo', 'Fecha', 'Estado', 'Total']];
      (view._list || []).forEach(function (o) { rows.push([o.code, o.created_at, o.status, o.total]); });
      CW.api.download('ventas.csv', '\ufeff' + CW.api.toCSV(rows), 'text/csv');
    });
    draw(30);
  }
  function statCard(icon, label, value) {
    return '<div class="stat-card"><span>' + icon + '</span><small>' + label + '</small><b>' + value + '</b></div>';
  }

  // ---------------------------------------------------------------------
  // PRODUCTOS
  // ---------------------------------------------------------------------
  function renderProducts(view) {
    if (state.sub === 'new' || state.sub === 'edit') return renderProductForm(view);
    var q = '';
    view.innerHTML = '<div class="view-head"><div><h1>' + t('nav.products') + '</h1></div>' +
      '<div class="head-actions"><input class="search" data-q placeholder="' + t('common.search') + '…">' +
      '<button class="btn primary" data-new>+ ' + t('prod.new') + '</button></div></div><div data-list></div>';
    function draw() {
      var list = state.products.filter(function (p) { return (p.name || '').toLowerCase().includes(q.toLowerCase()); });
      $('[data-list]', view).innerHTML = list.length ? '<div class="table-wrap"><table class="data-table"><thead><tr>' +
        '<th></th><th>' + t('common.name') + '</th><th>' + t('prod.type') + '</th><th>' + t('common.category') + '</th><th>' + t('common.price') + '</th><th>' + t('common.status') + '</th><th></th></tr></thead><tbody>' +
        list.map(function (p) {
          var img = (p.images && p.images[0]) ? '<img class="row-thumb" src="' + esc(p.images[0]) + '" alt="">' : '<div class="row-thumb ph"></div>';
          return '<tr><td>' + img + '</td><td><b>' + esc(p.name) + '</b></td>' +
            '<td>' + (p.kind === 'service' ? '🔧 Servicio' : '📦 Producto') + '</td><td>' + esc(catName(p.category_id)) + '</td>' +
            '<td>' + (Number(p.price) > 0 ? money(p.price, state.biz.currency) : t('cat.public.consult')) + '</td>' +
            '<td><button class="switch' + (p.active !== false ? ' on' : '') + '" data-toggle="' + p.id + '"></button></td>' +
            '<td class="row-actions"><button class="btn ghost small" data-edit="' + p.id + '">' + t('common.edit') + '</button>' +
            '<button class="btn ghost small danger" data-del="' + p.id + '">' + t('common.delete') + '</button></td></tr>';
        }).join('') + '</tbody></table></div>'
        : '<div class="card empty-state"><div class="es-icon">📦</div><b>' + t('prod.empty') + '</b><p>' + t('prod.empty.desc') + '</p></div>';
      $$('[data-edit]', view).forEach(function (b) { b.addEventListener('click', function () { location.hash = '#products/edit/' + b.dataset.edit; }); });
      $$('[data-toggle]', view).forEach(function (b) {
        b.addEventListener('click', function () {
          var p = state.products.find(function (x) { return x.id === b.dataset.toggle; });
          CW.store.saveProduct({ id: p.id, active: !(p.active !== false) }).then(function () { p.active = !(p.active !== false); draw(); });
        });
      });
      $$('[data-del]', view).forEach(function (b) {
        b.addEventListener('click', function () {
          CW.confirm('¿Eliminar este artículo?', function () {
            CW.store.deleteProduct(b.dataset.del).then(function () { loadAll().then(draw); });
          }, true);
        });
      });
    }
    $('[data-q]', view).addEventListener('input', function (e) { q = e.target.value; draw(); });
    $('[data-new]', view).addEventListener('click', function () { location.hash = '#products/new'; });
    draw();
  }

  function renderProductForm(view) {
    var editing = state.sub === 'edit' ? state.products.find(function (p) { return p.id === state.param; }) : null;
    var p = editing || { name: '', slug: '', category_id: '', description: '', sort_order: 0, price: 0, promo_price: '', images: [], active: true, kind: 'product', duration: '', modality: '', bookable: false };
    var images = (p.images || []).slice();
    view.innerHTML =
      '<div class="view-head"><div><span class="crumb-mini">' + t('nav.products') + ' / ' + (editing ? t('prod.edit') : t('prod.new')) + '</span>' +
      '<h1>' + (editing ? t('prod.edit') : t('prod.new')) + '</h1></div>' +
      '<button class="btn ghost" data-back>← ' + t('common.back') + '</button></div>' +
      '<div class="form-grid">' +
        '<div class="form-main">' +
          card(t('prod.data'), t('prod.data.desc'),
            field(t('prod.name'), '<input data-f="name" value="' + esc(p.name) + '" placeholder="Ej. Arroz extra 5 kg">') +
            field(t('prod.url'), '<input data-f="slug" value="' + esc(p.slug) + '" placeholder="arroz-extra-5-kg">') +
            field(t('prod.type'), '<div class="segmented" data-kind>' +
              '<button type="button" data-k="product" class="' + (p.kind !== 'service' ? 'active' : '') + '">📦 ' + t('prod.type.product') + '</button>' +
              '<button type="button" data-k="service" class="' + (p.kind === 'service' ? 'active' : '') + '">🔧 ' + t('prod.type.service') + '</button></div>') +
            field(t('common.category'), '<select data-f="category_id"><option value="">' + t('common.none') + '</option>' +
              state.cats.map(function (c) { return '<option value="' + c.id + '"' + (c.id === p.category_id ? ' selected' : '') + '>' + esc(c.name) + '</option>'; }).join('') + '</select>') +
            field(t('prod.desc') + ' <span class="muted">(' + t('common.optional') + ')</span>', '<textarea data-f="description" rows="6">' + esc(p.description) + '</textarea>') +
            field(t('prod.sort'), '<input type="number" data-f="sort_order" value="' + (p.sort_order || 0) + '"><small class="muted">' + t('prod.sort.hint') + '</small>')
          ) +
          card(t('prod.price.title'), '', '<div class="two-col-inline">' +
            field(t('prod.regular') + ' (' + state.biz.currency + ')', '<input type="number" step="0.01" data-f="price" value="' + (p.price || '') + '">') +
            field(t('prod.promo') + ' <span class="muted">(' + t('common.optional') + ')</span>', '<input type="number" step="0.01" data-f="promo_price" value="' + (p.promo_price || '') + '">') +
            '</div>') +
          '<div data-service-fields' + (p.kind === 'service' ? '' : ' hidden') + '>' +
            card(t('prod.type.service'), '', '<div class="two-col-inline">' +
              field(t('prod.duration'), '<input data-f="duration" value="' + esc(p.duration || '') + '" placeholder="Ej. 2 horas">') +
              field(t('prod.modality'), '<input data-f="modality" value="' + esc(p.modality || '') + '" placeholder="Ej. A domicilio">') +
              '</div><label class="check"><input type="checkbox" data-f="bookable"' + (p.bookable ? ' checked' : '') + '> ' + t('prod.bookable') + '</label>') +
          '</div>' +
          card(t('prod.images.title'), t('prod.images.hint'),
            '<div class="img-picker" data-img-picker></div>' +
            '<button type="button" class="btn ghost" data-add-img>+ ' + t('common.add') + ' ' + t('common.images') + '</button>') +
        '</div>' +
        '<aside class="form-side">' +
          '<div class="card tip-card"><span class="tip-icon">💡</span><b>' + t('prod.tip') + '</b><ul>' +
            '<li>' + t('prod.tip.1') + '</li><li>' + t('prod.tip.2') + '</li><li>' + t('prod.tip.3') + '</li></ul></div>' +
          '<div class="card"><span class="kicker">' + t('prod.currency').toUpperCase() + '</span><h3>' + state.biz.currency + '</h3>' +
            '<p class="muted">' + t('prod.price.title') + '</p></div>' +
        '</aside>' +
      '</div>' +
      '<div class="form-sticky"><button class="btn ghost" data-back2>' + t('common.cancel') + '</button>' +
      '<button class="btn primary" data-save>✓ ' + t('prod.save') + '</button></div>';

    function drawImages() {
      $('[data-img-picker]', view).innerHTML = Array.from({ length: 5 }).map(function (_, i) {
        var u = images[i];
        return '<div class="img-slot' + (u ? ' filled' : '') + '">' + (u ? '<img src="' + esc(u) + '" alt=""><button type="button" class="slot-x" data-rm="' + i + '">✕</button>' : '<span>+</span>') + '</div>';
      }).join('');
      $$('[data-rm]', view).forEach(function (b) { b.addEventListener('click', function () { images.splice(Number(b.dataset.rm), 1); drawImages(); }); });
    }
    drawImages();
    $('[data-back]', view).addEventListener('click', function () { location.hash = '#products'; });
    $('[data-back2]', view).addEventListener('click', function () { location.hash = '#products'; });
    $$('[data-kind] button', view).forEach(function (b) {
      b.addEventListener('click', function () {
        $$('[data-kind] button', view).forEach(function (x) { x.classList.remove('active'); });
        b.classList.add('active');
        $('[data-service-fields]', view).hidden = b.dataset.k !== 'service';
      });
    });
    var nameInput = $('[data-f="name"]', view);
    var slugInput = $('[data-f="slug"]', view);
    nameInput.addEventListener('input', function () { if (!editing) slugInput.value = CW.store.slugify(nameInput.value); });
    $('[data-add-img]', view).addEventListener('click', function () {
      openImagePicker(5 - images.length, function (urls) { images = images.concat(urls).slice(0, 5); drawImages(); });
    });
    $('[data-save]', view).addEventListener('click', function () {
      function val(f) { var el = $('[data-f="' + f + '"]', view); return el ? el.value : ''; }
      var kind = $('[data-kind] button.active', view).dataset.k;
      var obj = {
        id: editing ? editing.id : undefined, business_id: state.biz.id,
        name: val('name').trim(), slug: CW.store.slugify(val('slug') || val('name')),
        category_id: val('category_id') || null, description: val('description'),
        sort_order: Number(val('sort_order') || 0), price: Number(val('price') || 0),
        promo_price: val('promo_price') === '' ? null : Number(val('promo_price')),
        images: images, active: p.active !== false, kind: kind,
        duration: kind === 'service' ? val('duration') : '', modality: kind === 'service' ? val('modality') : '',
        bookable: kind === 'service' ? !!$('[data-f="bookable"]', view).checked : false
      };
      if (!obj.name) { CW.toast(t('common.required')); return; }
      CW.store.saveProduct(obj).then(function () { CW.toast(t('common.save')); location.hash = '#products'; loadAll().then(route); });
    });
  }

  function card(title, desc, body) {
    return '<section class="card form-card">' + (title ? '<div class="card-head"><div><span class="kicker">' + esc(title).toUpperCase() + '</span>' + (desc ? '<h3>' + esc(desc) + '</h3>' : '') + '</div></div>' : '') + body + '</section>';
  }
  function field(label, control) { return '<label class="field"><span>' + label + '</span>' + control + '</label>'; }

  // ---------------------------------------------------------------------
  // CATEGORÍAS
  // ---------------------------------------------------------------------
  function renderCategories(view) {
    if (state.sub === 'new' || state.sub === 'edit') return renderCategoryForm(view);
    var count = state.cats.length, organized = state.products.filter(function (p) { return p.category_id; }).length;
    view.innerHTML = '<div class="view-head"><div><h1>' + t('cat.title') + '</h1><p class="muted">' + t('cat.sub') + '</p></div>' +
      '<button class="btn primary" data-new>+ ' + t('cat.new') + '</button></div>' +
      '<div class="stat-cards">' + statCard('🗂️', t('cat.count'), count) + statCard('📦', t('cat.organized'), organized) + statCard('⭐', t('cat.default'), 'Otros') + '</div>' +
      '<section class="card"><div class="card-head"><div><h3>' + t('cat.list') + '</h3><p class="muted">' + t('cat.list.hint') + '</p></div></div>' +
      '<div class="table-wrap"><table class="data-table"><thead><tr><th>' + t('common.category') + '</th><th>' + t('common.order') + '</th><th>' + t('nav.products') + '</th><th>' + t('prod.type') + '</th><th></th></tr></thead><tbody>' +
      state.cats.map(function (c) {
        var n = state.products.filter(function (p) { return p.category_id === c.id; }).length;
        return '<tr><td><b>' + esc(c.name) + '</b><br><small class="muted">/' + esc(c.slug || '') + '</small></td>' +
          '<td>' + (c.sort_order || 0) + '</td><td>' + n + '</td>' +
          '<td>' + (c.kind === 'service' ? '🔧 Servicio' : '📦 Producto') + (c.slug === 'otros' ? ' · <span class="tag">' + t('cat.default') + '</span>' : '') + '</td>' +
          '<td class="row-actions"><button class="btn ghost small" data-edit="' + c.id + '">' + t('common.edit') + '</button>' +
          (c.slug === 'otros' ? '' : '<button class="btn ghost small danger" data-del="' + c.id + '">' + t('common.delete') + '</button>') + '</td></tr>';
      }).join('') + '</tbody></table></div></section>';
    $('[data-new]', view).addEventListener('click', function () { location.hash = '#categories/new'; });
    $$('[data-edit]', view).forEach(function (b) { b.addEventListener('click', function () { location.hash = '#categories/edit/' + b.dataset.edit; }); });
    $$('[data-del]', view).forEach(function (b) {
      b.addEventListener('click', function () {
        CW.confirm('¿Eliminar categoría?', function () { CW.store.deleteCategory(b.dataset.del).then(function () { loadAll().then(route); }); }, true);
      });
    });
  }

  function renderCategoryForm(view) {
    var editing = state.sub === 'edit' ? state.cats.find(function (c) { return c.id === state.param; }) : null;
    var c = editing || { name: '', slug: '', sort_order: 0, image_url: '', alt: '', kind: 'product' };
    view.innerHTML = '<div class="view-head"><div><span class="crumb-mini">' + t('nav.categories') + ' / ' + (editing ? t('common.edit') : t('cat.new')) + '</span><h1>' + (editing ? t('common.edit') : t('cat.new')) + '</h1><p class="muted">' + t('cat.sub') + '</p></div>' +
      '<button class="btn ghost" data-back>← ' + t('common.back') + '</button></div>' +
      card(t('cat.data'), '', 
        field(t('common.name'), '<input data-f="name" value="' + esc(c.name) + '" placeholder="Ej. Abarrotes">') +
        field(t('cat.slug'), '<input data-f="slug" value="' + esc(c.slug) + '" placeholder="abarrotes">') +
        field(t('prod.type'), '<div class="segmented" data-kind>' +
          '<button type="button" data-k="product" class="' + (c.kind !== 'service' ? 'active' : '') + '">📦 ' + t('prod.type.product') + '</button>' +
          '<button type="button" data-k="service" class="' + (c.kind === 'service' ? 'active' : '') + '">🔧 ' + t('prod.type.service') + '</button></div>') +
        field(t('common.order'), '<input type="number" data-f="sort_order" value="' + (c.sort_order || 0) + '">')) +
      card(t('cat.image'), t('cat.alt'),
        field('', '<div class="img-slot filled" data-cat-img style="max-width:220px">' + (c.image_url ? '<img src="' + esc(c.image_url) + '">' : '<span>+</span>') + '</div>') +
        field(t('cat.alt'), '<input data-f="alt" value="' + esc(c.alt || '') + '">')) +
      '<div class="form-sticky"><button class="btn ghost" data-back2>' + t('common.cancel') + '</button><button class="btn primary" data-save>✓ ' + t('cat.save') + '</button></div>';
    $('[data-back]', view).addEventListener('click', function () { location.hash = '#categories'; });
    $('[data-back2]', view).addEventListener('click', function () { location.hash = '#categories'; });
    $$('[data-kind] button', view).forEach(function (b) { b.addEventListener('click', function () { $$('[data-kind] button', view).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); }); });
    $('[data-cat-img]', view).addEventListener('click', function () {
      openImagePicker(1, function (urls) { if (urls[0]) $('[data-cat-img]', view).innerHTML = '<img src="' + esc(urls[0]) + '">'; view._img = urls[0]; });
    });
    $('[data-save]', view).addEventListener('click', function () {
      function val(f) { var el = $('[data-f="' + f + '"]', view); return el ? el.value : ''; }
      var obj = {
        id: editing ? editing.id : undefined, business_id: state.biz.id,
        name: val('name').trim(), slug: CW.store.slugify(val('slug') || val('name')),
        sort_order: Number(val('sort_order') || 0), alt: val('alt'),
        image_url: view._img || c.image_url, kind: $('[data-kind] button.active', view).dataset.k
      };
      if (!obj.name) { CW.toast(t('common.required')); return; }
      CW.store.saveCategory(obj).then(function () { CW.toast(t('common.save')); location.hash = '#categories'; loadAll().then(route); });
    });
  }

  // ---------------------------------------------------------------------
  // BIBLIOTECA + selector de imágenes
  // ---------------------------------------------------------------------
  function renderLibrary(view) {
    view.innerHTML = '<div class="view-head"><div><h1>' + t('nav.library') + '</h1></div>' +
      '<label class="btn primary">+ ' + t('common.add') + '<input type="file" accept="image/*" multiple data-upload hidden></label></div>' +
      '<div class="lib-grid" data-lib>' + libCards() + '</div>';
    function libCards() {
      if (!state.library.length) return '<div class="card empty-state" style="grid-column:1/-1"><div class="es-icon">🖼️</div><b>' + t('common.none') + '</b></div>';
      return state.library.map(function (i) {
        return '<div class="lib-item"><img src="' + esc(i.url) + '" alt=""><button class="lib-del" data-del="' + i.id + '">✕</button></div>';
      }).join('');
    }
    $('[data-upload]', view).addEventListener('change', function (e) {
      var files = Array.prototype.slice.call(e.target.files);
      CW.toast(t('common.loading'));
      Promise.all(files.map(function (f) { return CW.store.uploadImage(state.biz.id, f); })).then(function () {
        CW.toast(t('common.save')); loadAll().then(function () { $('[data-lib]', view).innerHTML = libCards(); bindLib(); });
      });
    });
    function bindLib() {
      $$('[data-del]', view).forEach(function (b) {
        b.addEventListener('click', function () {
          var item = state.library.find(function (x) { return x.id === b.dataset.del; });
          CW.store.deleteLibraryItem(item).then(function () { loadAll().then(function () { $('[data-lib]', view).innerHTML = libCards(); bindLib(); }); });
        });
      });
    }
    bindLib();
  }

  // Selector modal con marcas claras y barra fija.
  function openImagePicker(max, onDone) {
    max = max || 5;
    var selected = [];
    var m = CW.modal({
      className: 'picker-modal',
      title: t('nav.library'),
      html:
        '<div class="picker-actions"><label class="btn ghost small">+ ' + t('common.add') + '<input type="file" accept="image/*" multiple data-pick-upload hidden></label></div>' +
        '<div class="lib-grid picker" data-pick-grid></div>' +
        '<div class="picker-bar"><span data-pick-count>0 ' + t('common.image') + '(s)</span>' +
        '<button class="btn primary" data-pick-ok>' + t('common.confirm') + '</button></div>'
    });
    function draw() {
      $('[data-pick-grid]', m.modal).innerHTML = state.library.length ? state.library.map(function (i) {
        var on = selected.indexOf(i.url) >= 0;
        return '<div class="lib-item pick' + (on ? ' selected' : '') + '" data-url="' + esc(i.url) + '"><img src="' + esc(i.url) + '" alt=""><span class="pick-check">✓</span></div>';
      }).join('') : '<p class="muted">' + t('common.none') + '</p>';
      $('[data-pick-count]', m.modal).textContent = selected.length + ' / ' + max;
      $$('[data-url]', m.modal).forEach(function (el) {
        el.addEventListener('click', function () {
          var u = el.dataset.url, i = selected.indexOf(u);
          if (i >= 0) selected.splice(i, 1);
          else if (selected.length < max) selected.push(u);
          else CW.toast('Máx. ' + max);
          draw();
        });
      });
    }
    draw();
    $('[data-pick-upload]', m.modal).addEventListener('change', function (e) {
      var files = Array.prototype.slice.call(e.target.files);
      Promise.all(files.map(function (f) { return CW.store.uploadImage(state.biz.id, f); })).then(function (items) {
        return CW.store.listLibrary(state.biz.id).then(function (lib) {
          state.library = lib; draw();
          items.forEach(function (it) { if (selected.length < max) selected.push(it.url); });
          draw();
        });
      });
    });
    $('[data-pick-ok]', m.modal).addEventListener('click', function () { onDone(selected); m.close(); });
  }

  // ---------------------------------------------------------------------
  // CONFIGURACIÓN (10 tarjetas + subvistas)
  // ---------------------------------------------------------------------
  var SETTINGS = [
    { id: 'info', icon: '🏢', title: 'set.info', desc: 'set.info.desc', check: function (b) { return !!b.name; } },
    { id: 'whatsapp', icon: '💬', title: 'set.whatsapp', desc: 'set.whatsapp.desc', check: function (b) { return !!b.whatsapp; } },
    { id: 'brand', icon: '🎨', title: 'set.brand', desc: 'set.brand.desc', check: function (b) { return !!b.logo_url; }, optional: true },
    { id: 'currency', icon: '💱', title: 'set.currency', desc: 'set.currency.desc', check: function (b) { return !!b.currency; } },
    { id: 'link', icon: '🔗', title: 'set.link', desc: 'set.link.desc', check: function (b) { return !!b.slug; } },
    { id: 'presentation', icon: '🖼️', title: 'set.presentation', desc: 'set.presentation.desc', check: function (b) { return !b.hero_enabled || (b.hero_title && b.hero_image); }, optional: true },
    { id: 'delivery', icon: '🚚', title: 'set.delivery', desc: 'set.delivery.desc', check: function (b) { return !!b.delivery; } },
    { id: 'payments', icon: '💳', title: 'set.payments', desc: 'set.payments.desc', check: function (b) { return (b.payments || []).length > 0; } },
    { id: 'hours', icon: '🕐', title: 'set.hours', desc: 'set.hours.desc', check: function (b) { return !!(b.open_time && b.close_time); } },
    { id: 'seo', icon: '🔍', title: 'set.seo', desc: 'set.seo.desc', check: function (b) { return !!b.seo_title; }, optional: true }
  ];

  function renderSettings(view) {
    if (state.sub) return renderSettingDetail(view, state.sub);
    view.innerHTML = '<div class="view-head"><div><h1>' + t('set.title') + '</h1><p class="muted">' + t('set.sub') + '</p></div>' +
      '<div class="segmented" data-filter><button data-f="all" class="active">' + t('common.all') + '</button>' +
      '<button data-f="configured">' + t('set.configured') + '</button><button data-f="pending">' + t('set.pending') + '</button>' +
      '<button data-f="optional">' + t('set.optional') + '</button></div></div><div class="set-grid" data-grid></div>';
    function draw(f) {
      var cards = SETTINGS.filter(function (s) {
        var ok = s.check(state.biz);
        if (f === 'configured') return ok;
        if (f === 'pending') return !ok && !s.optional;
        if (f === 'optional') return s.optional;
        return true;
      }).map(function (s) {
        var ok = s.check(state.biz);
        var tag = s.optional ? '<span class="tag">' + t('set.optional') + '</span>' : (ok ? '<span class="tag ok">✓ ' + t('set.configured') + '</span>' : '<span class="tag warn">● ' + t('set.pending') + '</span>');
        var btn = s.id === 'brand' || s.id === 'presentation' ? t('set.personalize') : s.id === 'link' ? t('set.choose') : t('set.configure');
        return '<article class="set-card"><div class="set-top"><span class="set-icon">' + s.icon + '</span>' + tag + '</div>' +
          '<h3>' + t(s.title) + '</h3><p>' + t(s.desc) + '</p>' +
          '<button class="btn ghost small" data-set="' + s.id + '">' + btn + ' ›</button></article>';
      }).join('');
      $('[data-grid]', view).innerHTML = cards;
      $$('[data-set]', view).forEach(function (b) { b.addEventListener('click', function () { location.hash = '#settings/' + b.dataset.set; }); });
    }
    $$('[data-filter] button', view).forEach(function (b) {
      b.addEventListener('click', function () { $$('[data-filter] button', view).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); draw(b.dataset.f); });
    });
    draw('all');
  }

  function renderSettingDetail(view, id) {
    var b = state.biz;
    var body = '';
    var title = t(SETTINGS.find(function (s) { return s.id === id; }).title);
    if (id === 'info') body =
      card(t('set.info'), '', field(t('login.business'), '<input data-f="name" value="' + esc(b.name) + '">') +
        field(t('prod.desc'), '<textarea data-f="description" rows="3">' + esc(b.description || '') + '</textarea>') +
        '<div class="two-col-inline">' + field('País', '<select data-f="country">' + CW.api.countryOptions(b.country) + '</select>') +
        field(t('set.currency'), '<input value="' + esc(b.currency) + '" disabled> <button class="btn ghost small" data-gocur>Cambiar</button>') + '</div>' +
        '<div class="two-col-inline">' + field('Región', '<input data-f="region" value="' + esc(b.region || '') + '">') + field('Ciudad', '<input data-f="city" value="' + esc(b.city || '') + '">') + '</div>' +
        field(t('cat.alt'), '<input data-f="address" value="' + esc(b.address || '') + '">') +
        field('Zona horaria', '<input data-f="timezone" value="' + esc(b.timezone || '') + '">'));
    else if (id === 'whatsapp') body =
      card(t('set.whatsapp'), t('set.whatsapp.desc'), field('País o región', '<select data-f="wcountry">' + CW.api.countryOptions(b.country) + '</select>') +
        field(t('common.phone'), '<input data-f="wphone" value="' + esc(stripCountry(b.country, b.whatsapp)) + '" placeholder="987 654 321">') +
        '<p class="muted">' + (b.whatsapp ? 'Actual: ' + esc(b.whatsapp) : 'Sin configurar') + '</p>');
    else if (id === 'brand') body =
      card(t('set.brand'), '', '<div class="logo-preview" data-logo>' + (b.logo_url ? '<img src="' + esc(b.logo_url) + '">' : '<span>' + esc((b.name || 'M').charAt(0)) + '</span>') + '</div>' +
        '<label class="btn ghost small">Seleccionar archivo<input type="file" accept="image/*" data-logo-file hidden></label>' +
        field('Color de marca', '<div class="color-row"><input type="color" data-f="brand_color" value="' + esc(b.brand_color || '#5B1A80') + '"><input data-f="brand_hex" value="' + esc(b.brand_color || '#5B1A80') + '"></div>') +
        '<div class="pro-lock">⭐ <b>' + t('plan.pro') + '</b> — ' + t('plan.pro.unavailable') + '</div>');
    else if (id === 'currency') body =
      card(t('set.currency'), '⚠️ Este cambio requiere revisión de precios.',
        field(t('set.currency'), '<select data-f="currency">' + CW.api.currencyList.map(function (c) { return '<option value="' + c.code + '"' + (c.code === b.currency ? ' selected' : '') + '>' + c.label + '</option>'; }).join('') + '</select>') +
        '<label class="check"><input type="checkbox" data-f="curconfirm"> Confirmo el cambio y que revisaré los precios.</label>');
    else if (id === 'link') body =
      card(t('set.link'), t('set.link.desc'),
        field(t('cat.slug'), '<div class="slug-row"><span>https://</span><input data-f="slug" value="' + esc(b.slug) + '"><span>.' + esc(CW.publicHost) + '</span></div><small class="muted" data-slug-msg></small>') +
        '<div class="url-line">' + esc(bizUrl()) + '</div><button class="btn ghost small" data-copy>' + t('common.copy') + '</button>');
    else if (id === 'presentation') body =
      card(t('set.presentation'), '',
        '<label class="check"><input type="checkbox" data-f="hero_enabled"' + (b.hero_enabled ? ' checked' : '') + '> Mostrar encabezado visual</label>' +
        field('Título', '<input data-f="hero_title" value="' + esc(b.hero_title || '') + '" placeholder="Ej. Todo para tu hogar">') +
        field(t('prod.desc'), '<textarea data-f="hero_desc" rows="3">' + esc(b.hero_desc || '') + '</textarea>') +
        field('Imagen del encabezado', '<div class="img-slot ' + (b.hero_image ? 'filled' : '') + '" data-hero style="max-width:260px">' + (b.hero_image ? '<img src="' + esc(b.hero_image) + '">' : '<span>+</span>') + '</div>'));
    else if (id === 'delivery') body =
      card(t('set.delivery'), t('set.delivery.desc'),
        '<label class="radio"><input type="radio" name="dv" value="whatsapp"' + (b.delivery !== 'custom' ? ' checked' : '') + '> Coordinar por WhatsApp</label>' +
        '<label class="radio"><input type="radio" name="dv" value="custom"' + (b.delivery === 'custom' ? ' checked' : '') + '> Definir modalidades de entrega</label>' +
        '<div class="two-col-inline">' + field('Tarifa (' + b.currency + ')', '<input type="number" step="0.01" data-f="delivery_fee" value="' + (b.delivery_fee || 0) + '">') +
        field('Plazo', '<input data-f="delivery_time" value="' + esc(b.delivery_time || '') + '" placeholder="24-48 h">') + '</div>' +
        field('Notas', '<textarea data-f="delivery_notes" rows="2">' + esc(b.delivery_notes || '') + '</textarea>'));
    else if (id === 'payments') body =
      card(t('set.payments'), t('set.payments.desc'),
        '<div class="chips" data-pays>' + ['Efectivo', 'Transferencia bancaria', 'Tarjeta', 'Pago al recibir'].map(function (p) {
          var on = (b.payments || []).indexOf(p) >= 0;
          return '<button type="button" class="chip' + (on ? ' active' : '') + '" data-pay="' + esc(p) + '">' + p + '</button>';
        }).join('') + '</div>' + field('Notas', '<textarea data-f="payment_notes" rows="2">' + esc(b.payment_notes || '') + '</textarea>'));
    else if (id === 'hours') body =
      card(t('set.hours'), '', '<div class="days-row" data-days>' + ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map(function (d, i) {
        var on = (b.work_days || []).indexOf(i) >= 0;
        return '<button type="button" class="chip' + (on ? ' active' : '') + '" data-day="' + i + '">' + d + '</button>';
      }).join('') + '</div><div class="two-col-inline">' +
        field('Apertura', '<input type="time" data-f="open_time" value="' + esc(b.open_time || '09:00') + '">') +
        field('Cierre', '<input type="time" data-f="close_time" value="' + esc(b.close_time || '18:00') + '">') + '</div>' +
        field('Intervalo de citas (min)', '<input type="number" data-f="slot_minutes" value="' + (b.slot_minutes || 30) + '">'));
    else if (id === 'seo') body =
      card(t('set.seo'), '',
        field('Título SEO', '<input data-f="seo_title" value="' + esc(b.seo_title || '') + '">') +
        field('Descripción SEO', '<textarea data-f="seo_description" rows="2">' + esc(b.seo_description || '') + '</textarea>') +
        field('Palabras clave', '<input data-f="seo_keywords" value="' + esc(b.seo_keywords || '') + '">') +
        '<div class="google-preview"><div class="gp-url">https://' + esc(CW.publicHost) + '/' + esc(b.slug) + '</div>' +
        '<div class="gp-title">' + esc(b.seo_title || b.name) + '</div>' +
        '<div class="gp-desc">' + esc(b.seo_description || b.description || '') + '</div></div>');

    view.innerHTML = '<div class="view-head"><div><span class="crumb-mini">' + t('set.title') + ' / ' + esc(title) + '</span><h1>' + esc(title) + '</h1></div>' +
      '<button class="btn ghost" data-back>← ' + t('common.back') + '</button></div>' + body +
      '<div class="form-sticky"><button class="btn ghost" data-back2>' + t('common.back') + '</button><button class="btn primary" data-save>✓ ' + t('set.save') + '</button></div>';

    $('[data-back]', view).addEventListener('click', function () { location.hash = '#settings'; });
    $('[data-back2]', view).addEventListener('click', function () { location.hash = '#settings'; });

    function val(f) { var el = $('[data-f="' + f + '"]', view); return el ? el.value : ''; }

    if (id === 'brand') {
      $('[data-f="brand_color"]', view).addEventListener('input', function (e) { $('[data-f="brand_hex"]', view).value = e.target.value; });
      $('[data-logo-file]', view).addEventListener('change', function (e) {
        CW.store.uploadImage(b.id, e.target.files[0]).then(function (item) {
          $('[data-logo]', view).innerHTML = '<img src="' + esc(item.url) + '">';
          state.biz.logo_url = item.url; CW.store.saveBusiness(b.id, { logo_url: item.url });
        });
      });
    }
    if (id === 'link') {
      var slug = $('[data-f="slug"]', view);
      slug.addEventListener('input', function () {
        var s = CW.store.slugify(slug.value);
        if (!s) return;
        CW.store.slugAvailable(s).then(function (ok) {
          $('[data-slug-msg]', view).textContent = ok ? '✓ ' + t('onb.available') : '✗ ' + t('onb.taken');
        });
      });
      $('[data-copy]', view).addEventListener('click', function () { CW.api.copy(bizUrl()); });
    }
    if (id === 'presentation') {
      $('[data-hero]', view).addEventListener('click', function () {
        openImagePicker(1, function (u) { if (u[0]) { $('[data-hero]', view).innerHTML = '<img src="' + esc(u[0]) + '">'; view._hero = u[0]; } });
      });
    }
    if (id === 'payments') {
      view._pays = (b.payments || []).slice();
      $$('[data-pay]', view).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var p = btn.dataset.pay, i = view._pays.indexOf(p);
          if (i >= 0) { view._pays.splice(i, 1); btn.classList.remove('active'); }
          else { view._pays.push(p); btn.classList.add('active'); }
        });
      });
    }
    if (id === 'hours') {
      view._days = (b.work_days || []).slice();
      $$('[data-day]', view).forEach(function (btn) {
        btn.addEventListener('click', function () {
          var d = Number(btn.dataset.day), i = view._days.indexOf(d);
          if (i >= 0) { view._days.splice(i, 1); btn.classList.remove('active'); }
          else { view._days.push(d); btn.classList.add('active'); }
        });
      });
    }
    if (id === 'info') $('[data-gocur]', view).addEventListener('click', function () { location.hash = '#settings/currency'; });

    $('[data-save]', view).addEventListener('click', function () {
      var patch = {};
      if (id === 'info') patch = { name: val('name'), description: val('description'), country: val('country'), region: val('region'), city: val('city'), address: val('address'), timezone: val('timezone') };
      else if (id === 'whatsapp') {
        var wc = val('wcountry');
        patch = { whatsapp: CW.api.normalizePhone(wc, val('wphone')), country: wc };
      }
      else if (id === 'brand') patch = { brand_color: val('brand_hex') };
      else if (id === 'currency') {
        if (!$('[data-f="curconfirm"]', view).checked) { CW.toast('Confirma el cambio de moneda.'); return; }
        patch = { currency: val('currency') };
      }
      else if (id === 'link') patch = { slug: CW.store.slugify(val('slug')) };
      else if (id === 'presentation') patch = { hero_enabled: $('[data-f="hero_enabled"]', view).checked, hero_title: val('hero_title'), hero_desc: val('hero_desc'), hero_image: view._hero || b.hero_image };
      else if (id === 'delivery') patch = { delivery: ($('input[name=dv]:checked', view) || {}).value || 'whatsapp', delivery_fee: Number(val('delivery_fee') || 0), delivery_time: val('delivery_time'), delivery_notes: val('delivery_notes') };
      else if (id === 'payments') patch = { payments: view._pays, payment_notes: val('payment_notes') };
      else if (id === 'hours') patch = { work_days: view._days, open_time: val('open_time'), close_time: val('close_time'), slot_minutes: Number(val('slot_minutes') || 30) };
      else if (id === 'seo') patch = { seo_title: val('seo_title'), seo_description: val('seo_description'), seo_keywords: val('seo_keywords') };

      CW.store.saveBusiness(b.id, patch).then(function (nb) {
        state.biz = nb || Object.assign({}, b, patch);
        renderBizChip(); CW.toast(t('common.save'));
        loadAll().then(function () { location.hash = '#settings'; route(); });
      });
    });
  }

  // ---------------------------------------------------------------------
  // PLAN
  // ---------------------------------------------------------------------
  function renderPlan(view) {
    var b = state.biz;
    var used = state.products.length, max = b.max_products || CW.config.freeMaxProducts;
    var storage = state.library.reduce(function (s, i) { return s + (i.size_bytes || 0); }, 0);
    var maxMb = b.max_storage_mb || CW.config.freeMaxStorageMb;
    function mb(bytes) { return (bytes / 1048576).toFixed(2) + ' MB'; }
    view.innerHTML = '<div class="view-head"><div><h1>' + t('plan.title') + '</h1><p class="muted">' + t('plan.sub') + '</p></div></div>' +
      '<section class="card plan-row">' +
        '<div class="plan-cell"><span class="kicker">' + t('plan.current').toUpperCase() + '</span><h3>' + t('plan.free') + ' <span class="tag">' + t('common.active') + '</span></h3><p class="muted">' + t('plan.free.desc') + '</p></div>' +
        '<div class="plan-cell"><span class="kicker">' + t('plan.products').toUpperCase() + '</span><div class="progress"><div style="width:' + Math.min(100, used / max * 100) + '%"></div></div><b>' + used + ' / ' + max + '</b></div>' +
        '<div class="plan-cell"><span class="kicker">' + t('plan.storage').toUpperCase() + '</span><div class="progress"><div style="width:' + Math.min(100, (storage / 1048576) / maxMb * 100) + '%"></div></div><b>' + mb(storage) + ' / ' + maxMb + ' MB</b></div>' +
      '</section>' +
      '<section class="card"><h3>' + t('plan.pro') + '</h3><p class="muted">' + t('plan.pro.unavailable') + '</p></section>' +
      '<section class="card"><h3>' + t('plan.includes') + '</h3><ul class="mini-list">' +
        ['Hasta ' + max + ' productos', maxMb + ' MB de imágenes', 'Pedidos por WhatsApp', '3 idiomas', 'Reservas y agenda', 'Exportación CSV'].map(function (x) { return '<li><span>' + x + '</span><b>✓</b></li>'; }).join('') + '</ul></section>';
  }

  // ---------------------------------------------------------------------
  // MI CUENTA
  // ---------------------------------------------------------------------
  function renderAccount(view) {
    view.innerHTML = '<div class="view-head"><div><h1>' + t('acc.title') + '</h1></div></div>' +
      card(t('acc.profile'), '', field(t('common.email'), '<input data-email value="' + esc(state.session.user.email) + '">') +
        '<button class="btn ghost small" data-save-email>' + t('common.save') + '</button>') +
      card(t('acc.changepass'), '', field(t('acc.newpass'), '<input type="password" data-pass>') +
        '<button class="btn ghost small" data-save-pass>' + t('common.save') + '</button>' +
        '<button class="btn ghost small" data-reset>' + t('acc.reset') + '</button>') +
      card(t('acc.export'), '', '<button class="btn ghost" data-export>⬇ ' + t('acc.export') + '</button>') +
      card(t('acc.delete'), '<span class="danger-text">' + t('acc.delete.hint') + '</span>',
        field('', '<input data-delword placeholder="ELIMINAR">') + '<button class="btn danger" data-delete>' + t('acc.delete') + '</button>');
    $('[data-save-email]', view).addEventListener('click', function () {
      CW.store.updateEmail($('[data-email]', view).value).then(function () { CW.toast(t('common.save')); });
    });
    $('[data-save-pass]', view).addEventListener('click', function () {
      CW.store.updatePassword($('[data-pass]', view).value).then(function () { CW.toast(t('common.save')); });
    });
    $('[data-reset]', view).addEventListener('click', function () { CW.store.resetPassword(state.session.user.email).then(function () { CW.toast('Enviado'); }); });
    $('[data-export]', view).addEventListener('click', function () {
      CW.store.exportMyData().then(function (data) { CW.api.download('mis-datos.json', JSON.stringify(data, null, 2), 'application/json'); });
    });
    $('[data-delete]', view).addEventListener('click', function () {
      if ($('[data-delword]', view).value.trim().toUpperCase() !== 'ELIMINAR') { CW.toast(t('acc.delete.hint')); return; }
      CW.store.deleteBusiness(state.biz.id).then(function () { location.replace(CW.url('login.html')); });
    });
  }

  // ---------------------------------------------------------------------
  // ADMINISTRACIÓN + COBERTURA
  // ---------------------------------------------------------------------
  function renderAdmin(view) {
    var tabs = ['accounts', 'coverage', 'metrics', 'superadmins', 'audit'];
    view.innerHTML = '<div class="view-head"><div><h1>🛡️ ' + t('adm.title') + '</h1><p class="muted">' + t('adm.sub') + '</p></div></div>' +
      '<div class="segmented tabs" data-atab>' + tabs.map(function (x) {
        return '<button data-at="' + x + '" class="' + (x === 'accounts' ? 'active' : '') + '">' +
          t('adm.' + (x === 'accounts' ? 'accounts' : x === 'coverage' ? 'coverage' : x === 'metrics' ? 'metrics' : x === 'superadmins' ? 'superadmins' : 'audit')) + '</button>';
      }).join('') + '</div><div data-admin-body></div>';
    function draw(tab) {
      var body = $('[data-admin-body]', view);
      if (tab === 'accounts') return adminAccounts(body);
      if (tab === 'coverage') return adminCoverage(body);
      if (tab === 'metrics') return adminMetrics(body);
      if (tab === 'superadmins') return adminSuperadmins(body);
      if (tab === 'audit') return adminAudit(body);
    }
    $$('[data-at]', view).forEach(function (b) {
      b.addEventListener('click', function () { $$('[data-at]', view).forEach(function (x) { x.classList.remove('active'); }); b.classList.add('active'); draw(b.dataset.at); });
    });
    draw('accounts');
  }

  function adminAccounts(body) {
    body.innerHTML = '<p class="muted">' + t('common.loading') + '</p>';
    CW.store.listAllBusinesses().then(function (list) {
      body.innerHTML = '<section class="card"><div class="card-head"><h3>' + t('adm.accounts') + '</h3>' +
        '<input class="search" data-aq placeholder="' + t('common.search') + '…"></div><div data-atbl></div></section>';
      function draw(q) {
        var rows = list.filter(function (b) { return !q || (b.name || '').toLowerCase().includes(q.toLowerCase()) || (b.owner_email || '').toLowerCase().includes(q.toLowerCase()) || (b.slug || '').includes(q); });
        $('[data-atbl]', body).innerHTML = '<div class="table-wrap"><table class="data-table"><thead><tr>' +
          '<th>' + t('common.name') + '</th><th>' + t('adm.owner') + '</th><th>' + t('adm.state') + '</th><th>' + t('home.products') + '</th><th>' + t('home.orders') + '</th><th>' + t('adm.storage') + '</th><th></th></tr></thead><tbody>' +
          rows.map(function (b) {
            return '<tr><td><b>' + esc(b.name) + '</b><br><small class="muted">/' + esc(b.slug) + '</small></td>' +
              '<td>' + esc(b.owner_email || '—') + '</td>' +
              '<td><span class="tag ' + (b.published ? 'ok' : 'warn') + '">' + (b.published ? t('adm.published') : t('adm.hidden')) + '</span></td>' +
              '<td>' + (b._products != null ? b._products : '—') + '</td><td>' + (b._orders != null ? b._orders : '—') + '</td>' +
              '<td>' + (b._storage != null ? (b._storage / 1048576).toFixed(1) + ' MB' : '—') + '</td>' +
              '<td class="row-actions"><button class="btn ghost small" data-detail="' + b.id + '">' + t('adm.detail') + '</button>' +
              '<button class="btn ghost small" data-pub="' + b.id + '">' + (b.published ? t('adm.hide') : t('adm.publish')) + '</button>' +
              '<button class="btn ghost small danger" data-adel="' + b.id + '">' + t('common.delete') + '</button></td></tr>';
          }).join('') + '</tbody></table></div>';
        $$('[data-pub]', body).forEach(function (x) {
          x.addEventListener('click', function () {
            var b = list.find(function (y) { return y.id === x.dataset.pub; });
            CW.store.adminSaveBusiness(b.id, { published: !b.published }).then(function () { b.published = !b.published; draw(q); });
          });
        });
        $$('[data-detail]', body).forEach(function (x) { x.addEventListener('click', function () { adminBusinessDetail(list.find(function (y) { return y.id === x.dataset.detail; })); }); });
        $$('[data-adel]', body).forEach(function (x) {
          x.addEventListener('click', function () { CW.confirm('¿Eliminar este negocio y todos sus datos?', function () { CW.store.adminDeleteBusiness(x.dataset.adel).then(function () { adminAccounts(body); }); }, true); });
        });
      }
      $('[data-aq]', body).addEventListener('input', function (e) { draw(e.target.value); });
      draw('');
    });
  }

  // Detalle de negocio + COBERTURA de usuarios
  function adminBusinessDetail(b) {
    if (!b) return;
    var m = CW.modal({
      title: b.name,
      html:
        '<div class="detail-block"><b>' + t('adm.owner') + '</b><p>' + esc(b.owner_email || '—') + '</p>' +
        '<b>' + t('adm.plan') + '</b><p>' + esc(b.plan || 'free') + ' · ' + (b.max_products || 15) + ' ' + t('home.products').toLowerCase() + ' · ' + (b.max_storage_mb || 100) + ' MB</p></div>' +
        '<div class="field"><span>' + t('adm.plan') + '</span><select data-f="plan"><option value="free"' + (b.plan === 'free' ? ' selected' : '') + '>Free</option><option value="pro"' + (b.plan === 'pro' ? ' selected' : '') + '>Pro</option></select></div>' +
        '<div class="two-col-inline"><label class="field"><span>' + t('adm.limit') + ' ' + t('home.products') + '</span><input type="number" data-f="max_products" value="' + (b.max_products || 15) + '"></label>' +
        '<label class="field"><span>' + t('adm.limit') + ' MB</span><input type="number" data-f="max_storage_mb" value="' + (b.max_storage_mb || 100) + '"></label></div>' +
        '<button class="btn primary small" data-save-biz>' + t('common.save') + '</button>' +
        '<hr><h4>' + t('adm.members') + '</h4>' +
        '<div data-members><p class="muted">' + t('common.loading') + '</p></div>' +
        '<div class="coverage-add"><input data-m-email placeholder="' + t('adm.member.email') + '">' +
        '<select data-m-role><option value="support">' + t('adm.member.support') + '</option><option value="manager">' + t('adm.member.manager') + '</option></select>' +
        '<button class="btn ghost small" data-m-add>+ ' + t('adm.member.add') + '</button></div>' +
        '<div class="coverage-transfer"><input data-t-email placeholder="' + t('adm.member.email') + '"><button class="btn ghost small" data-transfer>' + t('adm.transfer') + '</button></div>'
    });
    function loadMembers() {
      CW.store.listMembers(b.id).then(function (ms) {
        $('[data-members]', m.modal).innerHTML = ms.length ? '<ul class="mini-list">' + ms.map(function (x) {
          return '<li><span>' + esc(x.email) + ' <span class="tag">' + t('adm.member.' + (x.role === 'manager' ? 'manager' : x.role === 'owner' ? 'owner' : 'support')) + '</span></span>' +
            '<button class="icon-btn" data-m-del="' + x.id + '">✕</button></li>';
        }).join('') + '</ul>' : '<p class="muted">' + t('common.none') + '</p>';
        $$('[data-m-del]', m.modal).forEach(function (x) {
          x.addEventListener('click', function () { CW.store.removeMember(x.dataset.mDel).then(loadMembers); });
        });
      });
    }
    loadMembers();
    $('[data-save-biz]', m.modal).addEventListener('click', function () {
      CW.store.adminSaveBusiness(b.id, {
        plan: $('[data-f="plan"]', m.modal).value,
        max_products: Number($('[data-f="max_products"]', m.modal).value || 15),
        max_storage_mb: Number($('[data-f="max_storage_mb"]', m.modal).value || 100)
      }).then(function () { CW.toast(t('common.save')); });
    });
    $('[data-m-add]', m.modal).addEventListener('click', function () {
      var email = $('[data-m-email]', m.modal).value.trim();
      if (!email) return;
      CW.store.addMember(b.id, email, $('[data-m-role]', m.modal).value).then(function () { $('[data-m-email]', m.modal).value = ''; loadMembers(); CW.toast(t('adm.member.add')); });
    });
    $('[data-transfer]', m.modal).addEventListener('click', function () {
      var email = $('[data-t-email]', m.modal).value.trim();
      if (!email) return;
      CW.confirm('¿Transferir la propiedad de ' + b.name + ' a ' + email + '?', function () {
        CW.store.transferOwnership(b.id, email).then(function () { CW.toast(t('common.save')); });
      });
    });
  }

  // Pestaña de cobertura global: todos los negocios y sus colaboradores
  function adminCoverage(body) {
    body.innerHTML = '<p class="muted">' + t('common.loading') + '</p>';
    CW.store.listAllBusinesses().then(function (list) {
      body.innerHTML = '<section class="card"><div class="card-head"><div><h3>' + t('adm.coverage') + '</h3><p class="muted">' + t('adm.member.add') + '</p></div></div>' +
        '<div data-cov></div></section>';
      $('[data-cov]', body).innerHTML = list.map(function (b) {
        return '<div class="cov-row"><div class="cov-biz"><b>' + esc(b.name) + '</b><small class="muted">' + esc(b.owner_email || '') + '</small></div>' +
          '<button class="btn ghost small" data-cov-open="' + b.id + '">' + t('adm.members') + ' ›</button></div>';
      }).join('');
      $$('[data-cov-open]', body).forEach(function (x) {
        x.addEventListener('click', function () { adminBusinessDetail(list.find(function (y) { return y.id === x.dataset.covOpen; })); });
      });
    });
  }

  function adminMetrics(body) {
    CW.store.listAllBusinesses().then(function (list) {
      var byMonth = {};
      list.forEach(function (b) { var m = (b.created_at || '').slice(0, 7); if (m) byMonth[m] = (byMonth[m] || 0) + 1; });
      var months = Object.keys(byMonth).sort();
      var maxM = Math.max.apply(null, months.map(function (m) { return byMonth[m]; }).concat([1]));
      body.innerHTML = '<div class="two-col">' +
        '<section class="card"><h3>' + t('adm.metrics.signups') + '</h3>' +
          (months.length ? '<div class="bars">' + months.map(function (m) {
            return '<div class="bar-col"><div class="bar" style="height:' + (byMonth[m] / maxM * 100) + '%"></div><small>' + m.slice(5) + '</small></div>';
          }).join('') + '</div>' : '<p class="muted">—</p>') + '</section>' +
        '<section class="card"><h3>' + t('adm.metrics.ranking') + '</h3>' +
          '<ul class="mini-list">' + list.slice().sort(function (a, b) { return (b._orders || 0) - (a._orders || 0); }).slice(0, 10).map(function (b) {
            return '<li><span>' + esc(b.name) + '</span><b>' + (b._orders || 0) + '</b></li>';
          }).join('') + '</ul></section></div>' +
        '<section class="card"><h3>' + t('adm.metrics.topviews') + '</h3><div data-topviews><p class="muted">' + t('common.loading') + '</p></div></section>';
      CW.store.topViewed(10).then(function (ps) {
        var host = $('[data-topviews]', body); if (!host) return;
        host.innerHTML = ps.length ? '<ul class="mini-list">' + ps.map(function (p) {
          return '<li><span>' + esc(p.name) + '</span><b>👁 ' + (p.views || 0) + '</b></li>';
        }).join('') + '</ul>' : '<p class="muted">—</p>';
      });
    });
  }

  function adminSuperadmins(body) {
    body.innerHTML = '<section class="card"><div class="card-head"><h3>' + t('adm.superadmins') + '</h3></div>' +
      '<div data-adm-list></div><div class="coverage-add"><input data-adm-email placeholder="' + t('common.email') + '">' +
      '<button class="btn ghost small" data-adm-add>+ ' + t('adm.addadmin') + '</button></div></section>';
    function load() {
      CW.store.listAdmins().then(function (list) {
        $('[data-adm-list]', body).innerHTML = list.length ? '<ul class="mini-list">' + list.map(function (a) {
          return '<li><span>' + esc(a.email || a.user_id) + '</span>' + (a.user_id ? '<button class="icon-btn" data-adm-del="' + a.user_id + '">✕</button>' : '') + '</li>';
        }).join('') + '</ul>' : '<p class="muted">' + t('common.none') + '</p>';
        $$('[data-adm-del]', body).forEach(function (x) { x.addEventListener('click', function () { CW.store.removeAdmin(x.dataset.admDel).then(load); }); });
      });
    }
    load();
    $('[data-adm-add]', body).addEventListener('click', function () {
      var e = $('[data-adm-email]', body).value.trim(); if (!e) return;
      CW.store.addAdmin(e).then(function () { $('[data-adm-email]', body).value = ''; load(); CW.toast(t('adm.addadmin')); });
    });
  }

  function adminAudit(body) {
    CW.store.listAudit().then(function (list) {
      body.innerHTML = '<section class="card"><h3>' + t('adm.audit') + '</h3>' +
        (list.length ? '<ul class="mini-list">' + list.map(function (a) {
          return '<li><span>' + esc(a.action) + ' · <small class="muted">' + esc(a.target || '') + '</small></span><small class="muted">' + CW.api.dateTime(a.created_at) + '</small></li>';
        }).join('') + '</ul>' : '<p class="muted">' + t('common.none') + '</p>') + '</section>';
    });
  }

  // ---------------------------------------------------------------------
  // ASISTENTE DE CONFIGURACIÓN (5 pasos)
  // ---------------------------------------------------------------------
  function showOnboarding() {
    var onb = $('[data-onboarding]'); onb.hidden = false;
    $('[data-app]').classList.add('blurred');
    var b = state.biz, step = 0, total = 5;
    var draft = { name: b.name, description: b.description || '', country: b.country || 'MA', currency: b.currency || 'MAD', whatsapp: b.whatsapp || '', brand_color: b.brand_color || '#5B1A80', logo_url: b.logo_url || '', slug: b.slug || '', delivery: b.delivery || 'whatsapp', delivery_fee: b.delivery_fee || 0, delivery_time: b.delivery_time || '', payments: b.payments || [] };

    function drawProgress() {
      $('[data-onb-progress]').innerHTML = Array.from({ length: total }).map(function (_, i) {
        return '<span class="' + (i <= step ? 'on' : '') + '"></span>';
      }).join('');
    }
    function draw() {
      drawProgress();
      var body = $('[data-onb-body]');
      if (step === 0) body.innerHTML = onbHead('onb.business') +
        field(t('login.business'), '<input data-o="name" value="' + esc(draft.name) + '">') +
        field(t('prod.desc'), '<textarea data-o="description" rows="3">' + esc(draft.description) + '</textarea>') +
        '<div class="two-col-inline">' + field('País', '<select data-o="country">' + CW.api.countryOptions(draft.country) + '</select>') +
        field(t('set.currency'), '<select data-o="currency">' + CW.api.currencyList.map(function (c) { return '<option value="' + c.code + '"' + (c.code === draft.currency ? ' selected' : '') + '>' + c.label + '</option>'; }).join('') + '</select>') + '</div>';
      else if (step === 1) body.innerHTML = onbHead('onb.whatsapp') +
        field('País o región', '<select data-o="wcountry">' + CW.api.countryOptions(draft.country) + '</select>') +
        field(t('common.phone'), '<input data-o="wphone" value="' + esc(stripCountry(draft.country, draft.whatsapp)) + '" placeholder="987 654 321">') +
        '<div class="wa-preview">💬 ' + esc(draft.whatsapp || '—') + '</div>';
      else if (step === 2) body.innerHTML = onbHead('onb.brand') +
        '<div class="logo-preview" data-o-logo>' + (draft.logo_url ? '<img src="' + esc(draft.logo_url) + '">' : '<span>' + esc((draft.name || 'M').charAt(0)) + '</span>') + '</div>' +
        '<label class="btn ghost small">' + t('common.add') + ' logo<input type="file" accept="image/*" data-o-logo-file hidden></label>' +
        field('Color', '<div class="color-row"><input type="color" data-o="brand_color" value="' + esc(draft.brand_color) + '"><input data-o="brand_hex" value="' + esc(draft.brand_color) + '"></div>');
      else if (step === 3) body.innerHTML = onbHead('onb.link') +
        field(t('cat.slug'), '<div class="slug-row"><span>https://</span><input data-o="slug" value="' + esc(draft.slug) + '"><span>.' + esc(CW.publicHost) + '</span></div><small class="muted" data-o-slug></small>');
      else if (step === 4) body.innerHTML = onbHead('onb.delivery') +
        '<label class="radio"><input type="radio" name="odv" value="whatsapp"' + (draft.delivery !== 'custom' ? ' checked' : '') + '> ' + t('set.whatsapp') + '</label>' +
        '<label class="radio"><input type="radio" name="odv" value="custom"' + (draft.delivery === 'custom' ? ' checked' : '') + '> ' + t('set.delivery') + '</label>' +
        field('Tarifa (' + draft.currency + ')', '<input type="number" data-o="delivery_fee" value="' + draft.delivery_fee + '">') +
        field('Plazo', '<input data-o="delivery_time" value="' + esc(draft.delivery_time) + '">') +
        '<div class="chips" data-o-pays>' + ['Efectivo', 'Transferencia bancaria', 'Tarjeta', 'Pago al recibir'].map(function (p) {
          return '<button type="button" class="chip' + (draft.payments.indexOf(p) >= 0 ? ' active' : '') + '" data-op="' + esc(p) + '">' + p + '</button>';
        }).join('') + '</div>';
      else body.innerHTML = '<div class="onb-done"><div class="done-icon">🎉</div><h2>' + t('onb.done') + '</h2><p>' + t('onb.done.sub') + '</p>' +
        '<div class="url-line">' + esc(CW.catalogUrl(draft.slug)) + '</div>' +
        '<div class="onb-done-actions"><a class="btn primary" href="' + CW.url('dashboard.html') + '">' + t('onb.gotodash') + '</a>' +
        '<a class="btn ghost" target="_blank" href="' + CW.url('catalogo.html') + '?b=' + encodeURIComponent(draft.slug) + '">' + t('onb.viewcatalog') + '</a></div></div>';

      $('[data-onb-back]').style.visibility = step === 0 ? 'hidden' : 'visible';
      $('[data-onb-next]').textContent = step === total - 1 ? t('common.finish') : t('common.next');
      bindStep();
      CW.i18n.apply(body);
    }
    function onbHead(key) {
      return '<span class="kicker">' + t('onb.step') + ' ' + (step + 1) + ' ' + t('onb.of') + ' ' + total + '</span><h2>' + t(key) + '</h2>';
    }
    function collect() {
      function o(f) { var el = $('[data-o="' + f + '"]'); return el ? el.value : undefined; }
      if (o('name') !== undefined) draft.name = o('name');
      if (o('description') !== undefined) draft.description = o('description');
      if (o('country') !== undefined) draft.country = o('country');
      if (o('currency') !== undefined) draft.currency = o('currency');
      if (o('wphone') !== undefined) { var wc = o('wcountry') || draft.country; draft.whatsapp = CW.api.normalizePhone(wc, o('wphone')); draft.country = wc; }
      if (o('brand_hex') !== undefined) draft.brand_color = o('brand_hex');
      if (o('slug') !== undefined) draft.slug = CW.store.slugify(o('slug'));
      if (o('delivery_fee') !== undefined) draft.delivery_fee = Number(o('delivery_fee') || 0);
      if (o('delivery_time') !== undefined) draft.delivery_time = o('delivery_time');
      var dv = $('input[name=odv]:checked'); if (dv) draft.delivery = dv.value;
    }
    function bindStep() {
      var body = $('[data-onb-body]');
      if (step === 2) {
        var cc = $('[data-o="brand_color"]', body); if (cc) cc.addEventListener('input', function (e) { $('[data-o="brand_hex"]', body).value = e.target.value; });
        var lf = $('[data-o-logo-file]', body);
        if (lf) lf.addEventListener('change', function (e) {
          CW.store.uploadImage(b.id, e.target.files[0]).then(function (item) {
            draft.logo_url = item.url; $('[data-o-logo]', body).innerHTML = '<img src="' + esc(item.url) + '">';
          });
        });
      }
      if (step === 3) {
        var sl = $('[data-o="slug"]', body);
        sl.addEventListener('input', function () {
          var s = CW.store.slugify(sl.value); if (!s) return;
          CW.store.slugAvailable(s).then(function (ok) { $('[data-o-slug]', body).textContent = ok ? '✓ ' + t('onb.available') : '✗ ' + t('onb.taken'); });
        });
        CW.store.slugAvailable(CW.store.slugify(sl.value || draft.slug)).then(function (ok) { $('[data-o-slug]', body).textContent = ok ? '✓ ' + t('onb.available') : '✗ ' + t('onb.taken'); });
      }
      if (step === 4) {
        $$('[data-op]', body).forEach(function (btn) {
          btn.addEventListener('click', function () {
            var p = btn.dataset.op, i = draft.payments.indexOf(p);
            if (i >= 0) { draft.payments.splice(i, 1); btn.classList.remove('active'); }
            else { draft.payments.push(p); btn.classList.add('active'); }
          });
        });
      }
    }
    $('[data-onb-back]').addEventListener('click', function () { if (step > 0) { collect(); step--; draw(); } });
    $('[data-onb-next]').addEventListener('click', function () {
      collect();
      if (step < total - 1) { step++; draw(); return; }
      // Guardar todo y terminar
      CW.store.saveBusiness(b.id, {
        name: draft.name, description: draft.description, country: draft.country, currency: draft.currency,
        whatsapp: draft.whatsapp, brand_color: draft.brand_color, logo_url: draft.logo_url, slug: draft.slug,
        delivery: draft.delivery, delivery_fee: draft.delivery_fee, delivery_time: draft.delivery_time,
        payments: draft.payments, onboarded: true, published: !!(draft.slug && draft.whatsapp)
      }).then(function (nb) {
        state.biz = nb || Object.assign({}, b, draft, { onboarded: true });
        onb.hidden = true;
        $('[data-app]').classList.remove('blurred');
        location.hash = '#home';
        renderBizChip(); loadAll().then(route);
      });
    });
    draw();
  }

  // ---------------------------------------------------------------------
  // Sidebar móvil
  // ---------------------------------------------------------------------
  function closeSidebar() { document.body.classList.remove('sidebar-open'); }
  document.addEventListener('DOMContentLoaded', function () {
    var open = $('[data-sidebar-open]'), close = $('[data-sidebar-close]');
    if (open) open.addEventListener('click', function () { document.body.classList.add('sidebar-open'); });
    if (close) close.addEventListener('click', closeSidebar);
    var lo = $('[data-logout]');
    if (lo) lo.addEventListener('click', function (e) { e.preventDefault(); CW.store.signOut().then(function () { location.replace(CW.url('login.html')); }); });
    window.addEventListener('cw:lang', function () { if (state.biz) route(); });
    boot();
  });
})(window, document);
