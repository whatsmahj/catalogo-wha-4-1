/* ==========================================================================
   Catalogo Wha · policies.js
   Políticas del pie de página. Cada enlace [data-policy] abre un pop-up con
   la información correspondiente. Texto base: adáptalo a tu negocio.
   ========================================================================== */
(function (window, document) {
  'use strict';
  var CW = window.CW;

  var UPDATED = 'Última actualización: enero de 2026';

  var POLICIES = {
    legal: {
      title: 'Aviso legal',
      body:
        '<p class="policy-meta">' + UPDATED + '</p>' +
        '<p>Este catálogo es una herramienta de escaparate digital. La venta se realiza directamente entre el cliente y el negocio, que es el único responsable de los productos o servicios ofrecidos, sus precios, su disponibilidad y su entrega.</p>' +
        '<h4>Identificación del negocio</h4>' +
        '<p>Los datos identificativos del negocio (nombre comercial, teléfono de contacto y, cuando corresponda, dirección y datos fiscales) figuran en la ficha del catálogo y en la conversación de WhatsApp.</p>' +
        '<h4>Uso del catálogo</h4>' +
        '<p>El contenido del catálogo (textos, imágenes, precios y descripciones) es informativo. Puede cambiar sin previo aviso. Los precios mostrados son los vigentes en el momento de la consulta y no constituyen una oferta contractual hasta que el negocio confirme el pedido.</p>' +
        '<h4>Propiedad intelectual</h4>' +
        '<p>Las imágenes y textos subidos por el negocio son responsabilidad de este, que declara tener derecho a usarlos. La plataforma no se hace responsable del uso indebido de contenido de terceros.</p>' +
        '<h4>Responsabilidad</h4>' +
        '<p>La plataforma no interviene en la transacción ni en el pago. Cualquier reclamación sobre el producto o servicio debe dirigirse al negocio.</p>'
    },

    privacy: {
      title: 'Política de privacidad',
      body:
        '<p class="policy-meta">' + UPDATED + '</p>' +
        '<p>Esta política explica qué datos personales se recogen cuando usas el catálogo y el asistente, con qué finalidad y cuáles son tus derechos.</p>' +
        '<h4>Datos que recogemos</h4>' +
        '<ul>' +
          '<li><b>Datos del pedido:</b> nombre, teléfono y, si los facilitas, dirección, ciudad y notas.</li>' +
          '<li><b>Datos del asistente:</b> nombre, teléfono y lo que necesitas, cuando decides dejar tus datos.</li>' +
          '<li><b>Datos técnicos:</b> información básica de funcionamiento del sitio (por ejemplo, preferencia de idioma).</li>' +
        '</ul>' +
        '<h4>Para qué los usamos</h4>' +
        '<p>Únicamente para gestionar tu pedido o consulta, contactarte por WhatsApp y llevar el seguimiento. No vendemos ni cedemos tus datos a terceros con fines publicitarios.</p>' +
        '<h4>Base legal</h4>' +
        '<p>El tratamiento se basa en tu consentimiento al enviar el pedido o dejar tus datos en el asistente, y en el interés legítimo del negocio en atender su solicitud.</p>' +
        '<h4>Conservación</h4>' +
        '<p>Los datos se conservan el tiempo necesario para atender el pedido y, después, durante los plazos legales aplicables.</p>' +
        '<h4>Tus derechos</h4>' +
        '<p>Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad de tus datos contactando con el negocio a través de su WhatsApp. También puedes reclamar ante la autoridad de protección de datos de tu país.</p>' +
        '<h4>Seguridad</h4>' +
        '<p>Aplicamos medidas técnicas razonables para proteger la información, con acceso restringido al negocio titular del catálogo.</p>'
    },

    cookies: {
      title: 'Política de cookies',
      body:
        '<p class="policy-meta">' + UPDATED + '</p>' +
        '<p>Este sitio usa el almacenamiento local del navegador para recordar tus preferencias. No usamos cookies publicitarias ni de seguimiento de terceros.</p>' +
        '<h4>Qué guardamos</h4>' +
        '<ul>' +
          '<li><b>Idioma:</b> para mantener el idioma que elegiste.</li>' +
          '<li><b>Carrito y sesión:</b> para conservar tu pedido mientras navegas.</li>' +
          '<li><b>Caché de la aplicación:</b> para que el catálogo cargue más rápido sin conexión.</li>' +
        '</ul>' +
        '<h4>Cómo desactivarlas</h4>' +
        '<p>Puedes borrar estos datos desde la configuración de tu navegador (borrar datos de sitios). Si lo haces, perderás el carrito y tus preferencias.</p>'
    },

    terms: {
      title: 'Términos y condiciones',
      body:
        '<p class="policy-meta">' + UPDATED + '</p>' +
        '<h4>1. Objeto</h4>' +
        '<p>Estos términos regulan el uso del catálogo digital y la realización de pedidos a través de WhatsApp.</p>' +
        '<h4>2. Pedidos</h4>' +
        '<p>El pedido se considera una solicitud: queda confirmado cuando el negocio lo acepta por WhatsApp. El negocio puede rechazar o modificar un pedido por falta de stock, error de precio o indisponibilidad.</p>' +
        '<h4>3. Precios</h4>' +
        '<p>Los precios se muestran en la moneda del negocio e incluyen o no impuestos según se indique. Los gastos de entrega, si existen, se muestran antes de enviar el pedido.</p>' +
        '<h4>4. Pago</h4>' +
        '<p>El pago se acuerda directamente con el negocio por los medios indicados en el catálogo. La plataforma no procesa pagos.</p>' +
        '<h4>5. Disponibilidad</h4>' +
        '<p>Las imágenes son orientativas. El producto o servicio final puede variar ligeramente.</p>' +
        '<h4>6. Responsabilidad</h4>' +
        '<p>El negocio es responsable del cumplimiento de la normativa aplicable a sus productos o servicios.</p>'
    },

    returns: {
      title: 'Política de devoluciones',
      body:
        '<p class="policy-meta">' + UPDATED + '</p>' +
        '<h4>Plazo</h4>' +
        '<p>Salvo que la ley de tu país indique otro plazo, dispones de <b>14 días naturales</b> desde la recepción para solicitar la devolución de un producto no perecedero.</p>' +
        '<h4>Condiciones</h4>' +
        '<ul>' +
          '<li>El producto debe estar sin usar y en su embalaje original.</li>' +
          '<li>Conserva el comprobante o conversación del pedido.</li>' +
          '<li>No aplica a productos personalizados, perecederos o de higiene abiertos.</li>' +
        '</ul>' +
        '<h4>Cómo solicitarla</h4>' +
        '<p>Escribe al WhatsApp del negocio indicando tu nombre, el producto y el motivo. El negocio te indicará cómo proceder.</p>' +
        '<h4>Reembolso</h4>' +
        '<p>Se realizará por el mismo medio de pago acordado, una vez verificado el estado del producto. Los gastos de envío de la devolución pueden correr a cargo del cliente salvo defecto de fábrica.</p>'
    },

    shipping: {
      title: 'Política de envíos y entrega',
      body:
        '<p class="policy-meta">' + UPDATED + '</p>' +
        '<h4>Modalidades</h4>' +
        '<p>El negocio puede ofrecer entrega a domicilio, recogida en tienda o coordinación directa por WhatsApp. Las opciones disponibles aparecen en el bloque de información del catálogo.</p>' +
        '<h4>Zonas y plazos</h4>' +
        '<p>Las zonas de reparto y los plazos estimados se acuerdan con el negocio al confirmar el pedido. Los plazos son orientativos y pueden variar por causas ajenas al negocio.</p>' +
        '<h4>Costes</h4>' +
        '<p>Si existe una tarifa de entrega, se muestra en el catálogo y se suma al total antes de enviar el pedido.</p>' +
        '<h4>Recepción</h4>' +
        '<p>Revisa el pedido al recibirlo. Si algo no coincide, comunícalo por WhatsApp lo antes posible con fotos del estado del paquete.</p>'
    }
  };

  function open(key) {
    var p = POLICIES[key];
    if (!p) return;
    CW.modal({
      className: 'policy-modal',
      title: p.title,
      html: p.body,
      footer: '<button class="btn primary" data-close>Cerrar</button>'
    });
  }

  CW.policies = { open: open, list: POLICIES };

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-policy]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        open(a.getAttribute('data-policy'));
      });
    });
  });
})(window, document);
