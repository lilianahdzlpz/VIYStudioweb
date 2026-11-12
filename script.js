
/* ==========================================
   VIY STUDIO
   Menú, portafolio, contacto y tienda
   ========================================== */

"use strict";

/* CONFIGURACIÓN */
const PAYMENT_URL = "https://link.mercadopago.com.mx/viystudio";

/* Agrega tu número cuando estés lista.
   Formato: código de país + número, sin + ni espacios.
   Ejemplo de formato: 5215512345678 */
const WHATSAPP_NUMBER = "525518485945";

/* ==========================================
   MENÚ DE NAVEGACIÓN
   ========================================== */

(function () {
  const boton = document.querySelector(".menu-toggle");
  const menu = document.getElementById("menu-principal");

  if (!boton || !menu) return;

  function cerrarMenu() {
    menu.classList.remove("open");
    boton.setAttribute("aria-expanded", "false");
    boton.setAttribute("aria-label", "Abrir menú");
    document.body.classList.remove("menu-abierto");
  }

  boton.addEventListener("click", function () {
    const abierto = menu.classList.toggle("open");

    boton.setAttribute("aria-expanded", String(abierto));
    boton.setAttribute(
      "aria-label",
      abierto ? "Cerrar menú" : "Abrir menú"
    );

    document.body.classList.toggle("menu-abierto", abierto);
  });

  menu.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", cerrarMenu);
  });

  document.addEventListener("keydown", function (evento) {
    if (evento.key === "Escape") cerrarMenu();
  });

  document.addEventListener("click", function (evento) {
    if (
      window.innerWidth <= 760 &&
      menu.classList.contains("open") &&
      !menu.contains(evento.target) &&
      !boton.contains(evento.target)
    ) {
      cerrarMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 760) cerrarMenu();
  });
})();

/* ==========================================
   FILTROS DEL PORTAFOLIO
   ========================================== */

(function () {
  const filtros = document.querySelectorAll(".filter-btn");
  const tarjetas = document.querySelectorAll(".portfolio-card");

  filtros.forEach(function (boton) {
    boton.addEventListener("click", function () {
      const filtro = boton.dataset.filter;

      filtros.forEach(function (otro) {
        const activo = otro === boton;

        otro.classList.toggle("active", activo);
        otro.setAttribute("aria-pressed", String(activo));
      });

      tarjetas.forEach(function (tarjeta) {
        tarjeta.hidden =
          filtro !== "todos" &&
          tarjeta.dataset.category !== filtro;
      });
    });
  });
})();

/* ==========================================
   FORMULARIO DE CONTACTO
   ========================================== */

(function () {
  const formulario = document.getElementById("contact-form");
  const estado = document.getElementById("form-status");

  if (!formulario) return;

  formulario.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const datos = new FormData(formulario);

    const nombre = String(datos.get("nombre") || "").trim();
    const correo = String(datos.get("email") || "").trim();
    const servicio = String(datos.get("servicio") || "").trim();
    const mensaje = String(datos.get("mensaje") || "").trim();

    if (!nombre || !correo || !servicio || !mensaje) {
      if (estado) {
        estado.textContent = "Completa todos los campos.";
      }
      return;
    }

    const asunto = encodeURIComponent(
      "Consulta para VIY Studio: " + servicio
    );

    const cuerpo = encodeURIComponent(
      "Hola, soy " + nombre +
      ".\nCorreo: " + correo +
      "\nServicio: " + servicio +
      "\n\nMi idea:\n" + mensaje
    );

    if (estado) {
      estado.textContent =
        "Se abrirá tu aplicación de correo para preparar el mensaje.";
    }

    window.location.href =
      "mailto:viystudio1@gmail.com?subject=" +
      asunto + "&body=" + cuerpo;
  });
})();

/* ==========================================
   AÑO AUTOMÁTICO DEL SITIO
   ========================================== */

(function () {
  const anio = document.getElementById("current-year");

  if (anio) {
    anio.textContent = new Date().getFullYear();
  }
})();

/* ==========================================
   TIENDA VIY STUDIO — SUPABASE
   ========================================== */

(function () {
  const SUPABASE_URL = "https://owmrnoipnswhgjzcodlo.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_3jMG4nCaTdAW1bHCVg2dxA_5YMSs2gZ";
  const ADMIN_EMAIL = "viystudio1@gmail.com";
  const ADMIN_UID = "59c108be-a9ee-474e-bcc8-321c8581fd92";
  const BUCKET = "viy-products";

  const tienda = document.getElementById("store-grid");
  const administracion = document.getElementById("admin-backdrop");
  const carritoPanel = document.getElementById("cart-panel");
  if (!tienda || !administracion || !carritoPanel) return;

  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    tienda.innerHTML = '<div class="store-empty"><h3>La tienda no pudo conectarse</h3><p>Recarga la página para intentarlo de nuevo.</p></div>';
    return;
  }

  const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
  let productos = [];
  let carrito = [];
  let usuarioAdmin = null;

  function dinero(cantidad) {
    return Number(cantidad).toLocaleString("es-MX", { style: "currency", currency: "MXN" });
  }

  function seguro(texto) {
    return String(texto == null ? "" : texto).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function estado(id, mensaje) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.textContent = mensaje || "";
  }

  function fotoPublica(ruta) {
    if (!ruta) return "";
    return db.storage.from(BUCKET).getPublicUrl(ruta).data.publicUrl;
  }

  async function cargarProductos() {
    tienda.innerHTML = '<div class="store-empty"><p>Cargando creaciones de VIY Studio…</p></div>';
    const { data, error } = await db.from("viy_products")
      .select("id,title,description,price,photo_path,created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error al cargar productos:", error);
      tienda.innerHTML = '<div class="store-empty"><h3>No pudimos cargar la tienda</h3><p>Intenta recargar la página más tarde.</p></div>';
      return;
    }
    productos = data || [];
    mostrarProductos();
    mostrarAdministracion();
    actualizarCarrito();
    actualizarContador();
  }

  function mostrarProductos() {
    if (!productos.length) {
      tienda.innerHTML = '<div class="store-empty"><span>✧</span><h3>Próximamente en VIY Studio</h3><p>Estamos preparando nuestras primeras creaciones.</p></div>';
      return;
    }

    tienda.innerHTML = productos.map(function (p) {
      const url = fotoPublica(p.photo_path);
      return '<article class="store-card">' +
        (url ? '<img class="store-photo" src="' + seguro(url) + '" alt="' + seguro(p.title) + '" loading="lazy">' : '<div class="store-photo store-empty">♡</div>') +
        '<div class="store-info"><h3>' + seguro(p.title) + '</h3><p>' + seguro(p.description) + '</p>' +
        '<div class="store-price">' + dinero(p.price) + '</div>' +
        '<button class="btn btn-primary add-cart" data-id="' + seguro(p.id) + '" type="button">Agregar al carrito</button></div></article>';
    }).join("");

    tienda.querySelectorAll(".add-cart").forEach(function (boton) {
      boton.addEventListener("click", function () {
        const p = productos.find(function (item) { return item.id === boton.dataset.id; });
        if (!p) return;
        carrito.push(p);
        actualizarCarrito();
        actualizarContador();
      });
    });
  }

  function actualizarContador() {
    const contador = document.getElementById("cart-count");
    if (contador) contador.textContent = carrito.length;
  }

  function actualizarCarrito() {
    const elementos = document.getElementById("cart-items");
    const totalElemento = document.getElementById("cart-total");
    if (!elementos || !totalElemento) return;

    if (!carrito.length) {
      elementos.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
      elementos.innerHTML = carrito.map(function (p, i) {
        return '<div class="cart-line"><span>' + seguro(p.title) + '</span><span>' +
          dinero(p.price) + ' <button type="button" data-remove="' + i + '" aria-label="Quitar producto">×</button></span></div>';
      }).join("");
    }

    elementos.querySelectorAll("[data-remove]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        carrito.splice(Number(boton.dataset.remove), 1);
        actualizarCarrito();
        actualizarContador();
      });
    });

    const total = carrito.reduce(function (suma, p) { return suma + Number(p.price); }, 0);
    totalElemento.textContent = "Total: " + dinero(total);
  }

  async function comprobarSesion() {
    const { data, error } = await db.auth.getSession();
    if (error) console.warn("No se pudo recuperar la sesión:", error);
    const usuario = data && data.session ? data.session.user : null;

    if (usuario && usuario.id === ADMIN_UID && usuario.email === ADMIN_EMAIL) {
      usuarioAdmin = usuario;
      mostrarVistaAdmin(true);
      return true;
    }

    if (usuario) await db.auth.signOut();
    usuarioAdmin = null;
    mostrarVistaAdmin(false);
    return false;
  }

  function mostrarVistaAdmin(autenticado) {
    const login = document.getElementById("admin-login");
    const dashboard = document.getElementById("admin-dashboard");
    if (login) login.hidden = autenticado;
    if (dashboard) dashboard.hidden = !autenticado;
    if (autenticado) mostrarAdministracion();
  }

  async function abrirAdministracion() {
    administracion.hidden = false;
    estado("admin-login-status", "");
    await comprobarSesion();
  }

  async function cerrarSesion() {
    const { error } = await db.auth.signOut();
    if (error) {
      estado("admin-login-status", "No se pudo cerrar la sesión. Inténtalo de nuevo.");
      return;
    }
    usuarioAdmin = null;
    mostrarVistaAdmin(false);
    estado("admin-login-status", "Sesión cerrada.");
  }

  const botonAdmin = document.getElementById("admin-launch");
  const cerrarAdmin = document.getElementById("admin-close");
  const formularioLogin = document.getElementById("admin-login-form");
  const botonLogout = document.getElementById("admin-logout");
  const botonRecuperar = document.getElementById("admin-forgot-password");
  const formularioRecuperacion = document.getElementById("admin-password-recovery-form");
  const panelRecuperacion = document.getElementById("admin-password-recovery");

  db.auth.onAuthStateChange(function (evento, sesion) {
    if (evento !== "PASSWORD_RECOVERY") return;
    const usuario = sesion && sesion.user;
    if (!usuario || usuario.id !== ADMIN_UID || usuario.email !== ADMIN_EMAIL) {
      db.auth.signOut();
      estado("admin-password-recovery-status", "El enlace no corresponde a la cuenta administradora.");
      return;
    }
    usuarioAdmin = usuario;
    administracion.hidden = false;
    document.getElementById("admin-login").hidden = true;
    document.getElementById("admin-dashboard").hidden = true;
    panelRecuperacion.hidden = false;
    estado("admin-password-recovery-status", "");
  });

  if (botonRecuperar) {
    botonRecuperar.addEventListener("click", async function () {
      botonRecuperar.disabled = true;
      estado("admin-login-status", "Enviando enlace de recuperación al correo de VIY Studio…");
      const redirectTo = window.location.origin + window.location.pathname;
      const { error } = await db.auth.resetPasswordForEmail(ADMIN_EMAIL, { redirectTo });
      botonRecuperar.disabled = false;
      estado("admin-login-status", error
        ? "No se pudo enviar el correo. Inténtalo más tarde o revisa la configuración de Auth."
        : "Solicitud enviada. Revisa la bandeja de entrada y la carpeta de spam de VIY Studio.");
    });
  }

  if (formularioRecuperacion) {
    formularioRecuperacion.addEventListener("submit", async function (evento) {
      evento.preventDefault();
      const datos = new FormData(formularioRecuperacion);
      const nueva = String(datos.get("new-password") || "");
      const confirmar = String(datos.get("confirm-password") || "");
      if (nueva.length < 8) {
        estado("admin-password-recovery-status", "La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (nueva !== confirmar) {
        estado("admin-password-recovery-status", "Las contraseñas no coinciden.");
        return;
      }
      const boton = document.getElementById("admin-password-recovery-button");
      boton.disabled = true;
      boton.textContent = "Guardando…";
      const { data, error } = await db.auth.updateUser({ password: nueva });
      boton.disabled = false;
      boton.textContent = "Guardar contraseña nueva";
      if (error || !data || !data.user || data.user.id !== ADMIN_UID) {
        estado("admin-password-recovery-status", "No se pudo actualizar la contraseña. Solicita un enlace nuevo e inténtalo otra vez.");
        return;
      }
      usuarioAdmin = data.user;
      formularioRecuperacion.reset();
      panelRecuperacion.hidden = true;
      mostrarVistaAdmin(true);
      estado("admin-login-status", "Contraseña actualizada. Ya puedes administrar VIY Studio.");
      await cargarProductos();
    });
  }

  if (botonAdmin) botonAdmin.addEventListener("click", abrirAdministracion);
  if (cerrarAdmin) cerrarAdmin.addEventListener("click", function () { administracion.hidden = true; });
  administracion.addEventListener("click", function (e) {
    if (e.target === administracion) administracion.hidden = true;
  });
  if (botonLogout) botonLogout.addEventListener("click", cerrarSesion);

  if (formularioLogin) {
    formularioLogin.addEventListener("submit", async function (evento) {
      evento.preventDefault();
      const boton = document.getElementById("admin-login-button");
      const password = String(new FormData(formularioLogin).get("password") || "");
      if (!password) return;
      boton.disabled = true;
      boton.textContent = "Verificando…";
      estado("admin-login-status", "");

      const { data, error } = await db.auth.signInWithPassword({ email: ADMIN_EMAIL, password: password });
      formularioLogin.reset();
      boton.disabled = false;
      boton.textContent = "Entrar";

      if (error || !data || !data.user || data.user.id !== ADMIN_UID) {
        if (data && data.user) await db.auth.signOut();
        estado("admin-login-status", "No se pudo iniciar sesión. Verifica tu contraseña.");
        mostrarVistaAdmin(false);
        return;
      }

      usuarioAdmin = data.user;
      mostrarVistaAdmin(true);
      estado("admin-login-status", "");
      await cargarProductos();
    });
  }

  async function mostrarAdministracion() {
    const lista = document.getElementById("admin-product-list");
    if (!lista) return;
    if (!usuarioAdmin) {
      lista.innerHTML = "";
      return;
    }
    if (!productos.length) {
      lista.innerHTML = "<p>Aún no hay productos publicados.</p>";
      return;
    }

    lista.innerHTML = productos.map(function (p) {
      return '<div class="admin-product-row"><span>' + seguro(p.title) + ' · ' + dinero(p.price) +
        '</span><button type="button" data-delete="' + seguro(p.id) + '">Eliminar</button></div>';
    }).join("");

    lista.querySelectorAll("[data-delete]").forEach(function (boton) {
      boton.addEventListener("click", async function () {
        if (!usuarioAdmin || usuarioAdmin.id !== ADMIN_UID) return;
        if (!window.confirm("¿Eliminar este producto de la tienda?")) return;
        boton.disabled = true;
        const producto = productos.find(function (p) { return p.id === boton.dataset.delete; });
        if (!producto) return;
        const { error } = await db.from("viy_products").delete().eq("id", producto.id);
        if (error) {
          console.error("Error al eliminar producto:", error);
          boton.disabled = false;
          alert("No se pudo eliminar el producto. Inténtalo de nuevo.");
          return;
        }
        if (producto.photo_path) {
          const { error: storageError } = await db.storage.from(BUCKET).remove([producto.photo_path]);
          if (storageError) console.warn("No se pudo eliminar la fotografía:", storageError);
        }
        carrito = carrito.filter(function (p) { return p.id !== producto.id; });
        await cargarProductos();
      });
    });
  }

  const formularioProducto = document.getElementById("product-form");
  if (formularioProducto) {
    formularioProducto.addEventListener("submit", async function (evento) {
      evento.preventDefault();
      if (!usuarioAdmin || usuarioAdmin.id !== ADMIN_UID) {
        estado("product-status", "Inicia sesión para publicar productos.");
        return;
      }

      const boton = document.getElementById("publish-product-button");
      const datos = new FormData(formularioProducto);
      const archivo = formularioProducto.elements.photo.files[0];
      const title = String(datos.get("title") || "").trim();
      const description = String(datos.get("description") || "").trim();
      const price = Number(datos.get("price"));

      if (!title || !description || !Number.isFinite(price) || price <= 0) {
        estado("product-status", "Revisa el nombre, la descripción y el precio.");
        return;
      }

      const tiposPermitidos = ["image/jpeg", "image/png", "image/webp", "image/gif"];
      if (archivo && (!tiposPermitidos.includes(archivo.type) || archivo.size > 5 * 1024 * 1024)) {
        estado("product-status", "Usa JPG, PNG, WEBP o GIF de máximo 5 MB.");
        return;
      }

      boton.disabled = true;
      boton.textContent = "Publicando…";
      estado("product-status", "Guardando producto en la nube…");
      let photo_path = null;

      try {
        if (archivo) {
          const extension = ({ "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp", "image/gif": "gif" })[archivo.type];
          const nombreArchivo = crypto.randomUUID() + "." + extension;
          const { data: subida, error: errorSubida } = await db.storage.from(BUCKET).upload(nombreArchivo, archivo, {
            cacheControl: "3600",
            contentType: archivo.type,
            upsert: false
          });
          if (errorSubida) throw errorSubida;
          photo_path = subida.path;
        }

        const { error } = await db.from("viy_products").insert([{ title, description, price, photo_path }]);
        if (error) throw error;

        formularioProducto.reset();
        estado("product-status", "¡Producto publicado correctamente!");
        await cargarProductos();
      } catch (error) {
        console.error("Error al publicar producto:", error);
        if (photo_path) {
          await db.storage.from(BUCKET).remove([photo_path]);
        }
        estado("product-status", "No se pudo publicar. Revisa la conexión y los permisos e inténtalo otra vez.");
      } finally {
        boton.disabled = false;
        boton.textContent = "Publicar producto";
      }
    });
  }

  const abrirCarrito = document.getElementById("cart-open");
  const cerrarCarrito = document.getElementById("cart-close");
  if (abrirCarrito) abrirCarrito.addEventListener("click", function () {
    carritoPanel.hidden = false;
    actualizarCarrito();
  });
  if (cerrarCarrito) cerrarCarrito.addEventListener("click", function () { carritoPanel.hidden = true; });

  const botonPedido = document.getElementById("checkout-button");
  if (botonPedido) {
    botonPedido.addEventListener("click", function () {
      if (!carrito.length) {
        alert("Agrega al menos un producto al carrito.");
        return;
      }
      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        alert("Todavía falta configurar el número de WhatsApp de VIY Studio en script.js.");
        return;
      }
      const total = carrito.reduce(function (suma, p) { return suma + Number(p.price); }, 0);
      const detalle = carrito.map(function (p) { return "• " + p.title + " — " + dinero(p.price); }).join("\n");
      const mensaje = "Hola, VIY Studio. Quiero solicitar este pedido:\n\n" + detalle + "\n\nTotal: " + dinero(total);
      const url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(mensaje);
      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  mostrarProductos();
  actualizarCarrito();
  actualizarContador();
  cargarProductos();
})();