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
