(function(){
var KEY="snd",FR=window.parent!==window;
function on(){try{return localStorage.getItem(KEY)!=="0"}catch(e){return true}}
function set(v){try{localStorage.setItem(KEY,v?"1":"0")}catch(e){}document.dispatchEvent(new CustomEvent("snd",{detail:v}))}
window.icaoSound={on:on,set:set};
if(FR)document.documentElement.classList.add("in-fr");
// Системні відступи (рядок стану, нижня панель). Усередині iframe env() дорівнює 0,
// тому сторінки в iframe беруть виміряні значення з основного документа.
function probe(){var d=document,p=d.createElement("div"),sd=["top","right","bottom","left"].map(function(k){return "max(env(safe-area-inset-"+k+",0px),var(--safe-area-inset-"+k+",0px))"}).join(" ");
 p.style.cssText="position:fixed;left:0;top:0;width:0;height:0;visibility:hidden;pointer-events:none;box-sizing:content-box;padding:"+sd;
 d.documentElement.appendChild(p);var c=getComputedStyle(p),r={t:parseFloat(c.paddingTop)||0,b:parseFloat(c.paddingBottom)||0};p.remove();try{if(window.AndroidInsets){r.t=Math.max(r.t,AndroidInsets.top());r.b=Math.max(r.b,AndroidInsets.bottom())}}catch(e){}return r}
window.icaoInsets=probe;
function insets(){var r;try{r=FR&&parent.icaoInsets?parent.icaoInsets():probe()}catch(e){r=probe()}
 var st=document.documentElement.style;st.setProperty("--sat",r.t+"px");st.setProperty("--sab",r.b+"px")}
insets();setTimeout(insets,300);setTimeout(insets,1200);addEventListener("resize",insets);addEventListener("pageshow",insets);
var go=0,SEL="a.m,a.it,button.r";
function el(e){return e.target.closest&&e.target.closest(SEL)}
function clr(){document.querySelectorAll(".dn").forEach(function(n){n.classList.remove("dn")})}
var sx=0,sy=0,mv=0;
document.addEventListener("pointerdown",function(e){var a=el(e);sx=e.clientX;sy=e.clientY;mv=0;if(a)a.classList.add("dn")});
document.addEventListener("pointermove",function(e){if(!mv&&(Math.abs(e.clientX-sx)>8||Math.abs(e.clientY-sy)>8)){mv=1;clr()}});
["pointerup","pointercancel","pointerleave","scroll","touchmove"].forEach(function(n){document.addEventListener(n,clr,true)});
function leaf(u){return u.split("#")[0].split("?")[0].split("/").pop()||"index.html"}
function nav(h){
 if(!FR){location.href=h;return}
 if(leaf(h)==="index.html"){parent.postMessage({icao:"close"},"*");return}
 location.replace(h)}
document.addEventListener("click",function(e){
 if(e.defaultPrevented)return;
 var a=e.target.closest&&e.target.closest("a[href]");
 if(!a||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.button>0)return;
 var raw=a.getAttribute("href")||"";
 if(/^(https?:|mailto:|tel:)/i.test(raw)||a.target==="_blank")return;
 var b=el(e);
 if(b&&mv)return;
 if(go)return;
 if(FR||b){
  e.preventDefault();go=1;
  if(b)a.classList.add("dn");
  var h=a.href;
  setTimeout(function(){go=0;clr();nav(h)},b?170:0);
 }
});
addEventListener("pageshow",function(){go=0;clr()});
})();
