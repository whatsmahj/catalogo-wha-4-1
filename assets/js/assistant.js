/* ==========================================================================
   Catalogo Wha · assistant.js
   Asistente inteligente del catálogo (widget web, sin API de WhatsApp).
   - Responde sobre productos, precios, categorías, entrega, pagos y horario.
   - Recopila datos del cliente (nombre, teléfono y qué necesita).
   - Guarda el contacto como pedido/lead y ofrece continuar por WhatsApp.
   Solo lo carga catalogo.html.
   ========================================================================== */
(function (window, document) {
  'use strict';
  var CW = window.CW;
  var esc = CW.esc, money = CW.money;
  function t(k, v) { return CW.i18n.t(k, v); }
  function norm(s) { return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim(); }

  var A = { state: 'idle', lead: {}, els: null, opened: false, greeted: false, saved: false };

  function data() {
    var d = (CW.catalogData ? CW.catalogData() : null) || {};
    return { biz: d.biz, products: d.products || [], cats: d.cats || [] };
  }

  // ------------------------------------------------------------------ DOM
  function build() {
    if (document.querySelector('[data-asst-fab]')) return; // evita duplicados
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<button class="asst-fab" data-asst-fab aria-label="Abrir asistente">💬<span class="asst-dot"></span></button>' +
      '<section class="asst-panel" data-asst-panel>' +
        '<header class="asst-head">' +
          '<div class="asst-avatar" data-asst-avatar>🤖</div>' +
          '<div class="asst-title"><b data-asst-name>Asistente</b><small>En línea</small></div>' +
          '<button class="icon-btn" data-asst-close aria-label="Cerrar">✕</button>' +
        '</header>' +
        '<div class="asst-msgs" data-asst-msgs aria-live="polite"></div>' +
        '<div class="asst-quick" data-asst-quick></div>' +
        '<form class="asst-form" data-asst-form>' +
          '<input data-asst-input autocomplete="off" placeholder="Escribe tu pregunta…" aria-label="Mensaje">' +
          '<button type="submit" aria-label="Enviar">➤</button>' +
        '</form>' +
      '</section>';
    document.body.appendChild(wrap);
    A.els = {
      fab: wrap.querySelector('[data-asst-fab]'),
      panel: wrap.querySelector('[data-asst-panel]'),
      msgs: wrap.querySelector('[data-asst-msgs]'),
      quick: wrap.querySelector('[data-asst-quick]'),
      form: wrap.querySelector('[data-asst-form]'),
      input: wrap.querySelector('[data-asst-input]'),
      name: wrap.querySelector('[data-asst-name]'),
      avatar: wrap.querySelector('[data-asst-avatar]')
    };
    A.els.fab.addEventListener('click', function () { setOpen(!A.opened); });
    wrap.querySelector('[data-asst-close]').addEventListener('click', function () { setOpen(false); });
    A.els.form.addEventListener('submit', function (e) { e.preventDefault(); send(A.els.input.value); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && A.opened) setOpen(false); });
  }

  function setOpen(v) {
    A.opened = v;
    A.els.panel.classList.toggle('show', v);
    if (v && !A.greeted) { A.greeted = true; greet(); }
    if (v) setTimeout(function () { A.els.input.focus(); }, 120);
  }

  function say(text, opts) {
    opts = opts || {};
    var b = document.createElement('div');
    b.className = 'asst-msg bot';
    b.innerHTML = text;
    A.els.msgs.appendChild(b);
    A.els.msgs.scrollTop = A.els.msgs.scrollHeight;
    setQuick(opts.quick || []);
  }
  function echo(text) {
    var b = document.createElement('div');
    b.className = 'asst-msg user';
    b.textContent = text;
    A.els.msgs.appendChild(b);
    A.els.msgs.scrollTop = A.els.msgs.scrollHeight;
  }
  function typing(on) {
    var ex = A.els.msgs.querySelector('.asst-typing-wrap');
    if (on && !ex) {
      var b = document.createElement('div');
      b.className = 'asst-msg bot asst-typing-wrap';
      b.innerHTML = '<span class="asst-typing"><span></span><span></span><span></span></span>';
      A.els.msgs.appendChild(b); A.els.msgs.scrollTop = A.els.msgs.scrollHeight;
    } else if (!on && ex) { ex.remove(); }
  }
  function setQuick(list) {
    A.els.quick.innerHTML = '';
    list.forEach(function (label) {
      var c = document.createElement('button');
      c.type = 'button'; c.className = 'asst-chip'; c.textContent = label;
      c.addEventListener('click', function () { send(label); });
      A.els.quick.appendChild(c);
    });
  }

  // ---------------------------------------------------------------- Motor
  var INTENTS = {
    greeting: ['hola', 'buenas', 'buenos dias', 'buenas tardes', 'buenas noches', 'hey', 'saludos', 'que tal'],
    thanks: ['gracias', 'muchas gracias'],
    human: ['hablar con alguien', 'persona', 'humano', 'agente', 'contactar', 'hablar con el negocio', 'telefono', 'whatsapp'],
    delivery: ['envio', 'entrega', 'delivery', 'domicilio', 'reparto', 'traer', 'mandar'],
    payment: ['pago', 'pagar', 'efectivo', 'tarjeta', 'transferencia', 'como pago'],
    hours: ['horario', 'abierto', 'cerrado', 'abre', 'cierra', 'atienden', 'a que hora'],
    categories: ['categoria', 'que vendes', 'que tienes', 'que ofreces', 'servicios', 'catalogo'],
    order: ['pedir', 'pedido', 'comprar', 'reservar', 'cita', 'apartar', 'encargar', 'quiero un', 'quiero una'],
    price: ['precio', 'cuanto', 'cuesta', 'vale', 'coste', 'costo']
  };

  function matchIntent(msg) {
    var n = norm(msg);
    for (var k in INTENTS) {
      for (var i = 0; i < INTENTS[k].length; i++) { if (n.indexOf(norm(INTENTS[k][i])) >= 0) return k; }
    }
    return null;
  }

  function findProducts(msg) {
    var d = data();
    var n = norm(msg);
    var words = n.split(/[^a-z0-9]+/).filter(function (w) { return w.length > 2; });
    return d.products.filter(function (p) {
      var pn = norm(p.name);
      if (pn && n.indexOf(pn) >= 0) return true;
      return words.some(function (w) { return pn.indexOf(w) >= 0; });
    }).slice(0, 5);
  }

  function productLine(p, biz) {
    var price = Number(p.promo_price) > 0 && Number(p.promo_price) < Number(p.price)
      ? money(p.promo_price, biz.currency) + ' (antes ' + money(p.price, biz.currency) + ')'
      : (Number(p.price) > 0 ? money(p.price, biz.currency) : t('cat.public.consult'));
    var extra = p.kind === 'service'
      ? (p.duration ? ' · ⏱ ' + esc(p.duration) : '') + (p.modality ? ' · 📍 ' + esc(p.modality) : '')
      : '';
    return '<span class="prod">• <b>' + esc(p.name) + '</b> — ' + price + extra + '</span>';
  }

  function send(raw) {
    var msg = String(raw || '').trim();
    if (!msg) return;
    echo(msg);
    A.els.input.value = '';
    typing(true);
    setTimeout(function () { typing(false); respond(msg); }, 420);
  }

  function respond(msg) {
    var d = data();
    if (!d.biz) { say('Ahora mismo el catálogo no está disponible. Inténtalo en un momento.'); return; }
    A.biz = d.biz;

    // Flujo de recopilación de datos
    if (A.state.indexOf('lead_') === 0) return handleLead(msg);

    // Búsqueda guiada
    if (A.state === 'await_search') {
      A.state = 'idle';
      var found = findProducts(msg);
      if (found.length) return showProducts(found);
      say('No encuentro «' + esc(msg) + '» en el catálogo. ¿Quieres ver las categorías o hablar con el negocio?',
        { quick: ['Ver categorías', 'Hablar con el negocio'] });
      return;
    }

    var intent = matchIntent(msg);
    var hits = findProducts(msg);
    if (hits.length) return showProducts(hits);

    if (intent === 'greeting') return greet(true);
    if (intent === 'thanks') { say('¡Con gusto! Si necesitas algo más, aquí estoy. 😊'); return; }
    if (intent === 'delivery') return answerDelivery(d);
    if (intent === 'payment') return answerPayment(d);
    if (intent === 'hours') return answerHours(d);
    if (intent === 'categories') return answerCategories(d);
    if (intent === 'order' || intent === 'human') return startLead();
    if (intent === 'price') {
      say('Dime el nombre del artículo y te digo el precio. También puedes ver todo en el catálogo.',
        { quick: ['Ver categorías', 'Hablar con el negocio'] });
      return;
    }
    // Sin intención clara
    say('Puedo ayudarte con precios, categorías, entrega, pagos y horarios. ¿Sobre qué quieres saber?',
      { quick: ['Ver categorías', 'Buscar un artículo', 'Horario', 'Quiero hacer un pedido'] });
  }

  // --------------------------------------------------------- Respuestas
  function greet(short) {
    var d = data(); var name = d.biz ? d.biz.name : 'la tienda';
    if (A.els.name) A.els.name.textContent = 'Asistente · ' + name;
    if (A.els.avatar && d.biz) A.els.avatar.textContent = (d.biz.name || 'M').trim().charAt(0).toUpperCase();
    say('¡Hola! 👋 Soy el asistente de <b>' + esc(name) + '</b>.<br>Te ayudo con precios, disponibilidad, categorías, entrega y horarios. También puedo recoger tus datos y pasar tu pedido por WhatsApp.<br><br>¿Qué necesitas?',
      { quick: ['Ver categorías', 'Buscar un artículo', 'Horario', 'Quiero hacer un pedido'] });
  }

  function showProducts(list) {
    var d = data();
    var html = list.length === 1 ? 'Encontré esto:' : 'Encontré estas opciones:';
    html += list.map(function (p) { return productLine(p, d.biz); }).join('');
    html += '<span class="prod">¿Quieres que te ayude a pedirlo?</span>';
    say(html, { quick: ['Quiero hacer un pedido', 'Ver categorías'] });
  }

  function answerCategories(d) {
    if (!d.cats.length) { say('Todavía no hay categorías publicadas. ¿Quieres buscar un artículo por nombre?', { quick: ['Buscar un artículo'] }); return; }
    var byKind = { product: [], service: [] };
    d.cats.forEach(function (c) {
      var n = d.products.filter(function (p) { return p.category_id === c.id; }).length;
      (c.kind === 'service' ? byKind.service : byKind.product).push(esc(c.name) + ' (' + n + ')');
    });
    var html = 'Estas son las categorías disponibles:';
    if (byKind.product.length) html += '<span class="prod">📦 Productos: ' + byKind.product.join(', ') + '</span>';
    if (byKind.service.length) html += '<span class="prod">🔧 Servicios: ' + byKind.service.join(', ') + '</span>';
    html += '<span class="prod">Dime el nombre de un artículo y te doy su precio.</span>';
    say(html, { quick: ['Buscar un artículo', 'Quiero hacer un pedido'] });
  }

  function answerDelivery(d) {
    var b = d.biz, parts = [];
    if (b.delivery === 'custom' || b.delivery_time || Number(b.delivery_fee) > 0 || b.delivery_notes) {
      parts.push('La entrega se coordina con el negocio.');
      if (Number(b.delivery_fee) > 0) parts.push('Tarifa: ' + money(b.delivery_fee, b.currency) + '.');
      if (b.delivery_time) parts.push('Plazo: ' + esc(b.delivery_time) + '.');
      if (b.delivery_notes) parts.push(esc(b.delivery_notes));
    } else {
      parts.push('La entrega se coordina directamente por WhatsApp con el negocio.');
    }
    say(parts.join(' '), { quick: ['Quiero hacer un pedido', 'Formas de pago'] });
  }

  function answerPayment(d) {
    var pays = d.biz.payments || [];
    say(pays.length ? 'Aceptamos: <b>' + esc(pays.join(', ')) + '</b>.' : 'La forma de pago se acuerda directamente con el negocio por WhatsApp.',
      { quick: ['Quiero hacer un pedido', 'Horario'] });
  }

  function answerHours(d) {
    var b = d.biz;
    var days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    var work = (b.work_days || []).slice().sort();
    var daysTxt = work.length ? work.map(function (i) { return days[i]; }).join(', ') : 'sin días definidos';
    say('Atendemos <b>' + esc(daysTxt) + '</b> de <b>' + esc(b.open_time || '—') + '</b> a <b>' + esc(b.close_time || '—') + '</b>.',
      { quick: ['Quiero hacer un pedido', 'Ver categorías'] });
  }

  // ----------------------------------------------------- Recogida de datos
  function startLead() {
    A.state = 'lead_name'; A.lead = {}; A.saved = false;
    say('Perfecto, te ayudo con tu pedido. 📝<br><br>¿Cómo te llamas?');
  }

  function handleLead(msg) {
    if (A.state === 'lead_name') {
      A.lead.name = msg; A.state = 'lead_phone';
      say('Gracias, <b>' + esc(msg) + '</b>. ¿Cuál es tu número de teléfono?');
      return;
    }
    if (A.state === 'lead_phone') {
      A.lead.phone = msg; A.state = 'lead_need';
      say('Anotado. ¿Qué necesitas exactamente? (producto, cantidad o servicio)');
      return;
    }
    if (A.state === 'lead_need') {
      A.lead.need = msg; A.state = 'idle';
      saveLead();
      return;
    }
    A.state = 'idle';
  }

  function saveLead() {
    var d = data();
    var note = 'Contacto desde el asistente. Necesita: ' + (A.lead.need || '—');
    var order = {
      business_id: d.biz.id, code: CW.store.newOrderCode(),
      customer_name: A.lead.name || '', customer_phone: A.lead.phone || '',
      customer_address: '', customer_city: '', note: note,
      items: [], subtotal: 0, fee: 0, total: 0, status: 'new'
    };
    var save = (d.biz.id === 'demo') ? Promise.resolve(order) : CW.store.createOrder(order);
    save.then(function () { A.saved = true; }).catch(function () { A.saved = false; });

    var wa = d.biz.whatsapp
      ? CW.api.waLink(d.biz.whatsapp,
        '*NUEVO CONTACTO*\n' + (A.lead.name || '') + '\nTeléfono: ' + (A.lead.phone || '') +
        '\nNecesita: ' + (A.lead.need || '') + '\n--------------------------------\nEnviado desde el asistente de ' + d.biz.name)
      : null;

    var html = '¡Listo, ' + esc(A.lead.name || '') + '! ✅<br>He guardado tu contacto con el negocio:' +
      '<span class="prod">👤 ' + esc(A.lead.name || '') + '<br>📞 ' + esc(A.lead.phone || '') + '<br>📝 ' + esc(A.lead.need || '') + '</span>';
    if (wa) html += '<span class="prod">Pulsa aquí para continuar por WhatsApp: <a href="' + wa + '" target="_blank" rel="noopener">abrir WhatsApp</a></span>';
    else html += '<span class="prod">El negocio no tiene un WhatsApp configurado todavía.</span>';

    say(html, { quick: ['Ver categorías', 'Gracias'] });
  }

  // ---------------------------------------------------------------- Init
  document.addEventListener('DOMContentLoaded', function () {
    build();
    // Refresca el nombre cuando el catálogo termine de cargar.
    var tries = 0;
    var iv = setInterval(function () {
      tries++;
      var d = data();
      if (d.biz) {
        if (A.els.name) A.els.name.textContent = 'Asistente · ' + d.biz.name;
        if (A.els.avatar) A.els.avatar.textContent = (d.biz.name || 'M').trim().charAt(0).toUpperCase();
        clearInterval(iv);
      }
      if (tries > 40) clearInterval(iv);
    }, 300);
  });
})(window, document);
