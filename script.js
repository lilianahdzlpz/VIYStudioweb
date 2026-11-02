
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
const WHATSAPP_NUMBER = "";

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
   TIENDA VIY STUDIO
   ========================================== */

(function () {
  const STORAGE_KEY = "viystudio_products_v1";

  const tienda = document.getElementById("store-grid");
  const administracion = document.getElementById("admin-backdrop");
  const carritoPanel = document.getElementById("cart-panel");

  if (!tienda || !administracion || !carritoPanel) return;

  let productos = leerProductos();
  let carrito = [];

  /* LEER PRODUCTOS GUARDADOS */

  function leerProductos() {
    try {
      return JSON.parse(
        localStorage.getItem(STORAGE_KEY) || "[]"
      );
    } catch (error) {
      return [];
    }
  }

  /* GUARDAR PRODUCTOS */

  function guardarProductos() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(productos)
      );
      return true;
    } catch (error) {
      alert(
        "No se pudieron guardar los productos. " +
        "Puede faltar espacio de almacenamiento."
      );
      return false;
    }
  }

  /* FORMATO DE PRECIOS */

  function dinero(cantidad) {
    return Number(cantidad).toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN"
    });
  }

  /* PROTEGER TEXTO MOSTRADO EN HTML */

  function seguro(texto) {
    return String(texto).replace(/[&<>"']/g, function (caracter) {
      return {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }[caracter];
    });
  }

  /* MOSTRAR PRODUCTOS */

  function mostrarProductos() {
    if (!productos.length) {
      tienda.innerHTML =
        '<div class="store-empty">' +
          '<span>✧</span>' +
          '<h3>Próximamente en VIY Studio</h3>' +
          '<p>Estamos preparando nuestras primeras creaciones.</p>' +
        '</div>';

      return;
    }

    tienda.innerHTML = productos.map(function (producto) {
      return (
        '<article class="store-card">' +

          (producto.photo
            ? '<img class="store-photo" src="' +
              producto.photo +
              '" alt="' + seguro(producto.title) + '">'
            : '<div class="store-photo store-empty">♡</div>') +

          '<div class="store-info">' +
            '<h3>' + seguro(producto.title) + '</h3>' +
            '<p>' + seguro(producto.description) + '</p>' +
            '<div class="store-price">' +
              dinero(producto.price) +
            '</div>' +
            '<button class="btn btn-primary add-cart" ' +
              'data-id="' + seguro(producto.id) + '" ' +
              'type="button">' +
              'Agregar al carrito' +
            '</button>' +
          '</div>' +

        '</article>'
      );
    }).join("");

    tienda.querySelectorAll(".add-cart").forEach(function (boton) {
      boton.addEventListener("click", function () {
        const producto = productos.find(function (elemento) {
          return elemento.id === boton.dataset.id;
        });

        if (!producto) return;

        carrito.push(producto);
        actualizarCarrito();
        actualizarContador();
      });
    });
  }

  /* ACTUALIZAR CONTADOR */

  function actualizarContador() {
    const contador = document.getElementById("cart-count");

    if (contador) {
      contador.textContent = carrito.length;
    }
  }

  /* MOSTRAR CARRITO */

  function actualizarCarrito() {
    const elementos = document.getElementById("cart-items");
    const totalElemento = document.getElementById("cart-total");

    if (!elementos || !totalElemento) return;

    if (!carrito.length) {
      elementos.innerHTML = "<p>Tu carrito está vacío.</p>";
    } else {
      elementos.innerHTML = carrito.map(function (producto, indice) {
        return (
          '<div class="cart-line">' +
            '<span>' + seguro(producto.title) + '</span>' +
            '<span>' + dinero(producto.price) +
              ' <button type="button" data-remove="' + indice +
              '" aria-label="Quitar producto">×</button>' +
            '</span>' +
          '</div>'
        );
      }).join("");
    }

    elementos.querySelectorAll("[data-remove]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        carrito.splice(Number(boton.dataset.remove), 1);
        actualizarCarrito();
        actualizarContador();
      });
    });

    const total = carrito.reduce(function (suma, producto) {
      return suma + Number(producto.price);
    }, 0);

    totalElemento.textContent = "Total: " + dinero(total);
  }

  /* ADMINISTRACIÓN LOCAL */

  function mostrarAdministracion() {
    const lista = document.getElementById("admin-product-list");

    if (!lista) return;

    if (!productos.length) {
      lista.innerHTML = "<p>Aún no hay productos publicados.</p>";
      return;
    }

    lista.innerHTML = productos.map(function (producto) {
      return (
        '<div class="admin-product-row">' +
          '<span>' + seguro(producto.title) +
          ' · ' + dinero(producto.price) + '</span>' +
          '<button type="button" data-delete="' +
          seguro(producto.id) + '">Eliminar</button>' +
        '</div>'
      );
    }).join("");

    lista.querySelectorAll("[data-delete]").forEach(function (boton) {
      boton.addEventListener("click", function () {
        productos = productos.filter(function (producto) {
          return producto.id !== boton.dataset.delete;
        });

        if (guardarProductos()) {
          carrito = carrito.filter(function (producto) {
            return productos.some(function (guardado) {
              return guardado.id === producto.id;
            });
          });

          mostrarProductos();
          mostrarAdministracion();
          actualizarCarrito();
          actualizarContador();
        }
      });
    });
  }

  /* ABRIR ADMINISTRACIÓN */

  const botonAdmin = document.getElementById("admin-launch");
  const cerrarAdmin = document.getElementById("admin-close");

  if (botonAdmin) {
    botonAdmin.addEventListener("click", function () {
      administracion.hidden = false;
      mostrarAdministracion();
    });
  }

  if (cerrarAdmin) {
    cerrarAdmin.addEventListener("click", function () {
      administracion.hidden = true;
    });
  }

  administracion.addEventListener("click", function (evento) {
    if (evento.target === administracion) {
      administracion.hidden = true;
    }
  });

  /* PUBLICAR PRODUCTOS */

  const formularioProducto = document.getElementById("product-form");

  if (formularioProducto) {
    formularioProducto.addEventListener("submit", function (evento) {
      evento.preventDefault();

      const formulario = evento.currentTarget;
      const datos = new FormData(formulario);
      const archivo = formulario.elements.photo.files[0];

      const titulo = String(datos.get("title") || "").trim();
      const precio = Number(datos.get("price"));
      const descripcion = String(
        datos.get("description") || ""
      ).trim();

      if (!titulo || !descripcion || !Number.isFinite(precio) || precio <= 0) {
        alert("Revisa el nombre, la descripción y el precio.");
        return;
      }

      function crearProducto(foto) {
        const nuevoProducto = {
          id: Date.now().toString(36) +
            Math.random().toString(36).slice(2, 7),
          title: titulo,
          price: precio,
          description: descripcion,
          photo: foto || ""
        };

        productos.push(nuevoProducto);

        if (guardarProductos()) {
          mostrarProductos();
          mostrarAdministracion();
          formulario.reset();
          alert("Producto publicado en este navegador.");
        } else {
          productos.pop();
        }
      }

      if (archivo) {
        if (!archivo.type.startsWith("image/")) {
          alert("Selecciona un archivo de imagen.");
          return;
        }

        if (archivo.size > 1500000) {
          alert("La foto debe pesar menos de 1.5 MB.");
          return;
        }

        const lector = new FileReader();

        lector.onload = function () {
          crearProducto(lector.result);
        };

        lector.onerror = function () {
          alert("No se pudo leer la fotografía.");
        };

        lector.readAsDataURL(archivo);
      } else {
        crearProducto("");
      }
    });
  }

  /* ABRIR Y CERRAR CARRITO */

  const abrirCarrito = document.getElementById("cart-open");
  const cerrarCarrito = document.getElementById("cart-close");

  if (abrirCarrito) {
    abrirCarrito.addEventListener("click", function () {
      carritoPanel.hidden = false;
      actualizarCarrito();
    });
  }

  if (cerrarCarrito) {
    cerrarCarrito.addEventListener("click", function () {
      carritoPanel.hidden = true;
    });
  }

  /* SOLICITAR PEDIDO POR WHATSAPP */

  const botonPedido = document.getElementById("checkout-button");

  if (botonPedido) {
    botonPedido.addEventListener("click", function () {
      if (!carrito.length) {
        alert("Agrega al menos un producto al carrito.");
        return;
      }

      if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
        alert(
          "Todavía falta configurar el número de WhatsApp " +
          "de VIY Studio en script.js."
        );
        return;
      }

      const total = carrito.reduce(function (suma, producto) {
        return suma + Number(producto.price);
      }, 0);

      const detalle = carrito.map(function (producto) {
        return "• " + producto.title + " — " + dinero(producto.price);
      }).join("\n");

      const mensaje =
        "Hola, VIY Studio. Quiero solicitar este pedido:\n\n" +
        detalle +
        "\n\nTotal: " + dinero(total);

      const url = "https://wa.me/" +
        WHATSAPP_NUMBER +
        "?text=" + encodeURIComponent(mensaje);

      window.open(url, "_blank", "noopener,noreferrer");
    });
  }

  /* INICIAR TIENDA */

  mostrarProductos();
  actualizarCarrito();
  actualizarContador();

})();
