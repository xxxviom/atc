(function(){
var S=window.icaoSound,btn=document.getElementById("sb"),au=new Audio("audio/menu.mp3"),started=0,fr=null;
au.loop=true;au.volume=.6;au.preload="auto";
function ui(){var o=S.on();btn.classList.toggle("off",!o);btn.setAttribute("aria-pressed",o?"false":"true");btn.setAttribute("aria-label",o?"Вимкнути звук":"Увімкнути звук")}
function play(){
 if(!S.on())return;
 var p;try{p=au.play()}catch(e){return}
 if(p&&p.then)p.then(function(){started=1;unbind()},function(){started=0;bind()});
 else{started=1;unbind()}
}
var EV=["pointerup","click","touchend","keydown","mousedown"];
function gesture(){if(!started)play()}
function bind(){EV.forEach(function(n){document.addEventListener(n,gesture,true)})}
function unbind(){EV.forEach(function(n){document.removeEventListener(n,gesture,true)})}
bind();
/* try right away (works when the browser allows autoplay), then retry as soon as audio is ready / page shown */
au.addEventListener("canplay",function(){if(!started)play()});
document.addEventListener("DOMContentLoaded",function(){if(!started)play()});
addEventListener("load",function(){if(!started)play()});
addEventListener("pageshow",function(){if(!started)play()});
btn.addEventListener("click",function(){var o=!S.on();S.set(o);ui();if(o)play();else{au.pause();started=0}});
document.addEventListener("snd",ui);
document.addEventListener("visibilitychange",function(){if(document.hidden)au.pause();else if(S.on())play()});
ui();

/* sections open in an overlay frame, so this page (and the music) is never reloaded.
   Every page change is a slide: the next page loads in a hidden frame, and only when it is ready
   does it slide in over (or out from under) the current one - no blank frame, no reload flash. */
var busy=0,RM=window.matchMedia&&matchMedia("(prefers-reduced-motion:reduce)").matches,DUR=RM?0:340;
function mk(u,cls){var f=document.createElement("iframe");f.className="fr "+cls;f.setAttribute("title","Розділ");f.src=u;document.body.appendChild(f);return f}
function ready(f,cb){var d=0;function go(){if(d)return;d=1;requestAnimationFrame(function(){requestAnimationFrame(cb)})}f.addEventListener("load",go);setTimeout(go,1500)}
function openPage(u){
 if(fr||busy)return;busy=1;
 var f=fr=mk(u,"top in-r");history.pushState({fr:1},"");
 if(S.on())play();
 ready(f,function(){f.classList.remove("in-r");setTimeout(function(){busy=0},DUR)});
}
function close(fromPop){
 if(!fr)return;var f=fr;fr=null;busy=1;
 f.className="fr top in-r";
 setTimeout(function(){f.remove();busy=0},DUR+30);
 if(!fromPop)try{history.back()}catch(e){}
}
function swap(u,back){
 if(!fr||busy)return;busy=1;
 var old=fr,n=fr=mk(u,back?"under in-l":"top in-r");
 old.className="fr "+(back?"top":"under");
 ready(n,function(){
  if(back){n.classList.remove("in-l");old.classList.add("in-r")}
  else{n.classList.remove("in-r");old.classList.add("in-l")}
  setTimeout(function(){old.remove();n.className="fr top";busy=0},DUR+30);
 });
}
window.icaoSwap=swap;
document.querySelector("main").addEventListener("click",function(e){
 var a=e.target.closest("a.m");if(!a)return;
 e.preventDefault();
 if(a.dataset.busy)return;
 a.dataset.busy=1;a.classList.add("dn");
 var h=a.getAttribute("href");
 setTimeout(function(){a.classList.remove("dn");delete a.dataset.busy;openPage(h)},170);
},true);
addEventListener("message",function(e){if(fr&&e.source===fr.contentWindow&&e.data&&e.data.icao==="close")close(false)});
function up(fromPop){
 if(!fr)return;
 if(busy){if(fromPop)history.pushState({fr:1},"");return}
 var w;try{w=fr.contentWindow;var l=w.location;
  if(l.hash&&l.hash!=="#"){l.replace(l.href.split("#")[0]+"#");if(fromPop)history.pushState({fr:1},"");return}
  var b=w.document.getElementById("bk"),cur=l.href.split("#")[0];
  if(b){var t=new URL(b.getAttribute("href"),l.href);
   if(!/(^|\/)(index\.html)?$/.test(t.pathname)&&t.href.split("#")[0]!==cur){swap(t.href,true);if(fromPop)history.pushState({fr:1},"");return}}
  else if(/emg\.html$/.test(l.pathname)){swap(new URL("atc.html",l.href).href,true);if(fromPop)history.pushState({fr:1},"");return}
 }catch(x){}
 close(fromPop);
}
addEventListener("popstate",function(){up(true)});
/* Android-застосунок (Capacitor): кнопка/жест «Назад» обробляється тут, а не закриває програму */
var C=window.Capacitor;
if(C&&C.isNativePlatform&&C.isNativePlatform()){
 var A=(C.Plugins&&C.Plugins.App)||(C.registerPlugin&&C.registerPlugin("App"));
 if(A&&A.addListener)A.addListener("backButton",function(){if(fr)up(false);else if(A.exitApp)A.exitApp()});
}
})();
