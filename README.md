# VIY Studio — edición identidad neón

## Abrir
Descomprime la carpeta y abre `index.html` en un navegador. Mantén `logo-viy.jpg`, `style.css` y `script.js` junto al HTML.

## Secciones incluidas
- Inicio con el nuevo eslogan oficial.
- Servicios, portafolio de muestra, habilidades y proyectos en desarrollo.
- Tienda con carrito y panel local para administrar productos en este navegador.
- Bolsa de trabajo con formulario que prepara un correo; la persona debe adjuntar su CV manualmente.
- Formulario de contacto que prepara un correo.

## Personalizar antes de publicar
1. En `script.js`, cambia `ADMIN_PASSWORD` por una clave propia.
2. En `script.js`, reemplaza `viystudio1@gmail.com` por el correo real de VIY Studio en los dos formularios.
3. En `script.js`, configura `WHATSAPP_NUMBER` con el número de WhatsApp en formato internacional, solo dígitos (México: 52 + número).
4. Publica todos los archivos juntos en tu hosting.

## Importante sobre la administración y las ventas
La bolsa de trabajo y el contacto abren el programa de correo del visitante; no guardan solicitudes en un servidor. Esta entrega incluye catálogo, carrito y un panel local para añadir/eliminar productos. Los datos se guardan en el navegador/dispositivo donde se administran (localStorage), no se sincronizan entre dispositivos ni constituyen autenticación segura. El pedido se envía a WhatsApp cuando configures el número. No incluye cobro en línea, inventario compartido ni base de datos. Para una tienda pública multi-dispositivo y pagos reales se necesita backend, autenticación y pasarela de pago.
