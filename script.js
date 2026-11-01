/* VIY STUDIO — menú, filtros y formulario */
(function(){
"use strict";
const boton=document.querySelector(".menu-toggle");
const menu=document.getElementById("menu-principal");
function cerrar(){if(!boton||!menu)return;menu.classList.remove("open");boton.setAttribute("aria-expanded","false");boton.setAttribute("aria-label","Abrir menú");document.body.classList.remove("menu-abierto")}
if(boton&&menu){
boton.addEventListener("click",function(){const abierto=menu.classList.toggle("open");boton.setAttribute("aria-expanded",String(abierto));boton.setAttribute("aria-label",abierto?"Cerrar menú":"Abrir menú");document.body.classList.toggle("menu-abierto",abierto)});
menu.querySelectorAll("a").forEach(a=>a.addEventListener("click",cerrar));
document.addEventListener("keydown",e=>{if(e.key==="Escape")cerrar()});
document.addEventListener("click",e=>{if(innerWidth<=760&&menu.classList.contains("open")&&!menu.contains(e.target)&&!boton.contains(e.target))cerrar()});
window.addEventListener("resize",()=>{if(innerWidth>760)cerrar()});
}
const filtros=document.querySelectorAll(".filter-btn");
const tarjetas=document.querySelectorAll(".portfolio-card");
filtros.forEach(btn=>btn.addEventListener("click",function(){const filtro=btn.dataset.filter;filtros.forEach(b=>{const activo=b===btn;b.classList.toggle("active",activo);b.setAttribute("aria-pressed",String(activo))});tarjetas.forEach(card=>{card.hidden=filtro!=="todos"&&card.dataset.category!==filtro})}));
const form=document.getElementById("contact-form"),estado=document.getElementById("form-status");
if(form)form.addEventListener("submit",function(e){e.preventDefault();const d=new FormData(form);const nombre=String(d.get("nombre")||"").trim(),email=String(d.get("email")||"").trim(),servicio=String(d.get("servicio")||"").trim(),mensaje=String(d.get("mensaje")||"").trim();if(!nombre||!email||!servicio||!mensaje){estado.textContent="Completa todos los campos para preparar el mensaje.";return}const asunto=encodeURIComponent("Consulta para VIY Studio: "+servicio),cuerpo=encodeURIComponent("Hola, soy "+nombre+".\nCorreo: "+email+"\nServicio: "+servicio+"\n\nMi idea:\n"+mensaje);estado.textContent="Se abrirá tu aplicación de correo. Configura tu dirección real antes de publicar.";location.href="mailto:viystudio1@gmail.com?subject="+asunto+"&body="+cuerpo});
const anio=document.getElementById("current-year");if(anio)anio.textContent=new Date().getFullYear();
})();

/* Tienda y administración local de VIY Studio */
(function(){
"use strict";
const STORAGE_KEY="viystudio_products_v1";
const WHATSAPP_NUMBER=""; // Escribe aquí tu número con código de país, sin + ni espacios.
const ADMIN_PASSWORD="VIY-cambia-esta-clave"; // Cambia esta clave antes de usar la administración.
const grid=document.getElementById("store-grid");
const admin=document.getElementById("admin-backdrop");
const cartPanel=document.getElementById("cart-panel");
if(!grid||!admin)return;
let products=readProducts(),cart=[];
function readProducts(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch(e){return[]}}
function save(){localStorage.setItem(STORAGE_KEY,JSON.stringify(products))}
function money(n){return Number(n).toLocaleString("es-MX",{style:"currency",currency:"MXN"})}
function safe(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function renderProducts(){
 if(!products.length){grid.innerHTML='<div class="store-empty"><span>✧</span><h3>Tu tienda está lista para recibir productos</h3><p>Entra a Administración para publicar el primer producto con su foto, descripción y precio.</p></div>';return}
 grid.innerHTML=products.map(p=>'<article class="store-card">'+(p.photo?'<img class="store-photo" src="'+p.photo+'" alt="'+safe(p.title)+'">':'<div class="store-photo store-empty"><span>♡</span></div>')+'<div class="store-info"><h3>'+safe(p.title)+'</h3><p>'+safe(p.description)+'</p><div class="store-price">'+money(p.price)+'</div><button class="btn btn-primary add-cart" data-id="'+p.id+'" type="button">Agregar al carrito</button></div></article>').join("");
 grid.querySelectorAll(".add-cart").forEach(b=>b.addEventListener("click",()=>{const p=products.find(x=>x.id===b.dataset.id);if(p){cart.push(p);renderCart();document.getElementById("cart-count").textContent=cart.length}}));
}
function renderAdmin(){
 const list=document.getElementById("admin-product-list");
 list.innerHTML=products.length?products.map(p=>'<div class="admin-product-row"><span>'+safe(p.title)+' · '+money(p.price)+'</span><button type="button" data-delete="'+p.id+'">Eliminar</button></div>').join():'<p>Aún no hay productos publicados.</p>';
 list.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{products=products.filter(p=>p.id!==b.dataset.delete);save();renderProducts();renderAdmin()}));
}
function renderCart(){
 const items=document.getElementById("cart-items");
 items.innerHTML=cart.length?cart.map((p,i)=>'<div class="cart-line"><span>'+safe(p.title)+'</span><span>'+money(p.price)+' <button type="button" data-remove="'+i+'" aria-label="Quitar '+safe(p.title)+'">×</button></span></div>').join():'<p>Tu carrito está vacío.</p>';
 items.querySelectorAll("[data-remove]").forEach(b=>b.addEventListener("click",()=>{cart.splice(Number(b.dataset.remove),1);renderCart();document.getElementById("cart-count").textContent=cart.length}));
 document.getElementById("cart-total").textContent="Total: "+money(cart.reduce((s,p)=>s+Number(p.price),0));
}
document.getElementById("admin-launch").addEventListener("click",()=>{const pass=prompt("Contraseña de administración:");if(pass===ADMIN_PASSWORD){admin.hidden=false;renderAdmin()}else if(pass!==null){alert("Contraseña incorrecta.")}});
document.getElementById("admin-close").addEventListener("click",()=>admin.hidden=true);
admin.addEventListener("click",e=>{if(e.target===admin)admin.hidden=true});
document.getElementById("product-form").addEventListener("submit",e=>{
 e.preventDefault();const form=e.currentTarget,data=new FormData(form),file=form.elements.photo.files[0];
 const create=photo=>{products.push({id:Date.now().toString(36)+Math.random().toString(36).slice(2,7),title:String(data.get("title")).trim(),price:Number(data.get("price")),description:String(data.get("description")).trim(),photo:photo||""});save();renderProducts();renderAdmin();form.reset();alert("Producto publicado en este navegador.")};
 if(file){if(file.size>1500000){alert("La foto debe pesar menos de 1.5 MB.");return}const reader=new FileReader();reader.onload=()=>create(reader.result);reader.readAsDataURL(file)}else create("");
});
document.getElementById("cart-open").addEventListener("click",()=>cartPanel.hidden=false);
document.getElementById("cart-close").addEventListener("click",()=>cartPanel.hidden=true);
document.getElementById("checkout-button").addEventListener("click",()=>{
 if(!cart.length){alert("Agrega al menos un producto al carrito.");return}
 if(!WHATSAPP_NUMBER){alert("Antes de recibir pedidos, configura tu número de WhatsApp en script.js (WHATSAPP_NUMBER).");return}
 const total=cart.reduce((s,p)=>s+Number(p.price),0);
 const lines=cart.map(p=>"• "+p.title+" — "+money(p.price)).join("\n");
 const msg="Hola, VIY Studio. Quiero solicitar este pedido:\n"+lines+"\nTotal: "+money(total);
 window.open("https://wa.me/"+WHATSAPP_NUMBER+"?text="+encodeURIComponent(msg),"_blank","noopener");
});
renderProducts();renderCart();
})();