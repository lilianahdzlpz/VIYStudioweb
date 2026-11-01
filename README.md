# VIY Studio — sitio web entregable

## Qué incluye
- Diseño adaptable a celular y computadora, con fondo negro y detalles neón.
- Logotipo de VIY Studio integrado.
- Eslogan oficial actualizado en el inicio y el pie de página.
- Secciones de servicios, portafolio, habilidades, aplicaciones en desarrollo, tienda, bolsa de trabajo y contacto.
- Filtros del portafolio.
- Catálogo, carrito y panel local para añadir/eliminar productos.
- Formularios que preparan un correo para contacto y solicitudes de colaboración.

## Cómo abrir
1. Descomprime este ZIP.
2. Entra en la carpeta `VIYStudioweb-main`.
3. Abre `index.html` con Chrome u otro navegador.
4. Conserva juntos `index.html`, `style.css`, `script.js` y `logo-viy.jpg`.

## Datos que debes confirmar antes de publicar
En `script.js`:
- `ADMIN_PASSWORD`: cambia la clave temporal por una propia.
- `viystudio1@gmail.com`: confirma que sea el correo correcto y sustitúyelo si no lo es (aparece en los dos formularios).
- `WHATSAPP_NUMBER`: escribe el número de WhatsApp con código de país, solo dígitos (México: 52 + número).

## Límites importantes de esta entrega
Esta es una web estática. El panel de administración guarda productos únicamente en el navegador/dispositivo donde se usan (localStorage); no comparte cambios con otros dispositivos y la contraseña dentro del JavaScript no es seguridad real. Los formularios abren la aplicación de correo y no almacenan ni envían solicitudes a una base de datos. El carrito prepara un pedido de WhatsApp cuando se configura el número; no procesa pagos. No se ha conectado un dominio, hosting, base de datos, sistema de usuarios ni pasarela de pago.

Para tener administración segura desde cualquier dispositivo, recibir CV y solicitudes automáticamente y cobrar en línea, se necesita configurar servicios externos y credenciales que solo la propietaria puede autorizar.
