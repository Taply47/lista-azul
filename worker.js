// Lista Azul 2027 - Cloudflare Worker (página + API + panel admin)
// Necesita: KV binding LISTA_DB y secret ADMIN_PASSWORD

const DEFAULTS = {
  hero: 'Somos Lista Azul. Queremos que el colegio sea un lugar más cómodo para todos. Escribinos tus ideas.',
  proposals: 'Mejorar los baños y los bebederos\nMás lugares para sentarse en los recreos\nEspacios para estudiar tranquilos\nUn buzón de ideas que realmente se responda',
  members: 'Presidente/a: a completar\nVicepresidente/a: a completar\nSecretario/a: a completar',
  instagram: 'listaazul2027'
};

const LOGO = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1E5BFF"/><stop offset="1" stop-color="#5CC8FF"/></linearGradient></defs><rect x="6" y="6" width="108" height="108" rx="34" fill="url(#g)"/><ellipse cx="60" cy="26" rx="42" ry="18" fill="#fff" opacity=".22"/><g fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"><path d="M31 36V82H51"/><path d="M53 82L71 36L89 82M59 66H83"/></g></svg>';

const CSS = ':root{--n:#08224F;--b:#1E6BFF;--s:#37B4FF}*{box-sizing:border-box;margin:0}[hidden]{display:none!important}#pn{display:grid;gap:16px}label{display:block;font-size:.9rem}body{font:16px/1.55 Sora,system-ui,sans-serif;color:var(--n);min-height:100vh;background:linear-gradient(165deg,#0A3AA0 0%,#2A82FF 45%,#A5E3FF 100%) fixed;overflow-x:hidden;padding:env(safe-area-inset-top) 0 env(safe-area-inset-bottom)}canvas{position:fixed;inset:0;width:100%;height:100%;z-index:0;pointer-events:none}main{position:relative;z-index:1;max-width:560px;margin:0 auto;padding:24px 16px 56px;display:grid;gap:16px}.g{background:linear-gradient(135deg,rgba(255,255,255,.7),rgba(255,255,255,.34));backdrop-filter:blur(18px) saturate(170%);-webkit-backdrop-filter:blur(18px) saturate(170%);border:1px solid rgba(255,255,255,.75);border-radius:26px;padding:20px;color:var(--n);box-shadow:inset 0 1px 0 #fff,0 12px 32px rgba(10,58,160,.25)}h1{font-size:2.5rem;line-height:1.05;letter-spacing:-.03em;color:#fff}h2{font-size:1.15rem;margin-bottom:10px}.hero{text-align:center;display:grid;gap:12px;justify-items:center;color:#fff;padding:18px 0 6px}.hero p{max-width:34ch}.logo{width:116px;height:116px;filter:drop-shadow(0 14px 22px rgba(8,34,79,.35));animation:fl 6s ease-in-out infinite}.hero>*{animation:in .9s cubic-bezier(.2,.8,.2,1) both}.hero>:nth-child(2){animation-delay:.12s}.hero>:nth-child(3){animation-delay:.24s}.hero>:nth-child(4){animation-delay:.36s}.chip{background:rgba(255,255,255,.22);border:1px solid rgba(255,255,255,.6);border-radius:999px;padding:4px 14px;font-size:.85rem;backdrop-filter:blur(10px)}@keyframes in{from{opacity:0;transform:translateY(18px) scale(.97)}}@keyframes fl{50%{transform:translateY(-8px)}}ul{padding-left:1.2em;display:grid;gap:6px}.btn{display:inline-block;border:0;border-radius:999px;padding:12px 22px;font:inherit;font-weight:600;color:#fff;text-decoration:none;text-align:center;background:linear-gradient(135deg,#1E6BFF,#37B4FF);box-shadow:inset 0 1px 0 rgba(255,255,255,.5),0 8px 18px rgba(30,107,255,.4);cursor:pointer;transition:transform .15s}.btn:active{transform:scale(.96)}.btn.s{padding:8px 14px;font-size:.9rem}.btn.r{background:#C93A4B;box-shadow:none}input,textarea{width:100%;font:inherit;color:var(--n);background:rgba(255,255,255,.75);border:1px solid rgba(8,34,79,.2);border-radius:16px;padding:12px;margin:6px 0}:focus-visible{outline:3px solid #fff;outline-offset:2px}form{display:grid;gap:4px}.c{border-top:1px solid rgba(8,34,79,.15);padding:12px 0;display:grid;gap:4px}.c small{opacity:.7}.rp{background:rgba(30,107,255,.14);border-radius:14px;padding:8px 12px;margin-top:4px}.o{position:relative;display:block;width:100%;text-align:left;margin:6px 0;padding:12px 14px;border-radius:16px;border:1px solid rgba(8,34,79,.2);background:rgba(255,255,255,.6);font:inherit;color:var(--n);overflow:hidden;cursor:pointer}.o i{position:absolute;inset:0 auto 0 0;background:rgba(55,180,255,.4);transition:width .6s}.o span{position:relative}dialog{border:0;margin:auto;max-width:340px;background:rgba(255,255,255,.85)}dialog::backdrop{background:rgba(8,34,79,.45);backdrop-filter:blur(6px)}dialog p{margin-bottom:14px}@media(prefers-reduced-motion:reduce){*{animation:none!important;transition:none!important}}';

const HEAD = '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><meta name="theme-color" content="#1E6BFF"><title>Lista Azul 2027</title><link rel="icon" href="/logo.svg"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Sora:wght@400;600;700&display=swap"><style>' + CSS + '</style></head><body>';

const HOME = HEAD + `<canvas id="p"></canvas><main>
<header class="hero"><img class="logo" src="/logo.svg" alt="Logo de Lista Azul"><span class="chip">Centro de estudiantes 2027</span><h1>Lista Azul</h1><p id="hero"></p></header>
<section class="g"><h2>Nuestras propuestas</h2><ul id="prop"></ul></section>
<section class="g"><h2>El equipo</h2><ul id="mem"></ul></section>
<section class="g" id="vs" hidden><h2>Votaciones</h2><div id="polls"></div></section>
<section class="g"><h2>Preguntas y propuestas</h2><button class="btn" id="wb">Escribir un comentario</button>
<form id="f" hidden><input id="n" maxlength="40" placeholder="Tu nombre" required><textarea id="t" rows="4" maxlength="400" placeholder="Tu pregunta o propuesta" required></textarea><button class="btn">Enviar</button></form><div id="cm"></div></section>
<a id="ig" class="btn" target="_blank" rel="noopener">Seguinos en Instagram</a></main>
<dialog id="w" class="g"><h2>Antes de escribir</h2><p>Si escribís un comentario inapropiado, lo vamos a eliminar. Escribí con respeto.</p><button class="btn" id="ok">Entendido</button></dialog>
<script>
var $=function(s){return document.querySelector(s)};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function lst(id,txt){var u=$(id);u.textContent='';txt.split('\\n').forEach(function(l){if(l.trim())u.appendChild(h('li','',l.trim()))})}
function voted(id){try{return localStorage.getItem('v'+id)}catch(e){return null}}
function render(d){
 $('#hero').textContent=d.settings.hero;lst('#prop',d.settings.proposals);lst('#mem',d.settings.members);
 $('#ig').href='https://instagram.com/'+d.settings.instagram.replace('@','');
 var pe=$('#polls');pe.textContent='';$('#vs').hidden=!d.polls.length;
 d.polls.forEach(function(p){var b=h('div');b.appendChild(h('strong','',p.q));var tot=p.o.reduce(function(a,x){return a+x.v},0),mine=voted(p.id);
  p.o.forEach(function(x,i){var o=h('button','o');o.type='button';var bar=h('i');bar.style.width=mine!==null?(tot?x.v*100/tot:0)+'%':'0';o.appendChild(bar);
   o.appendChild(h('span','',x.t+(mine!==null?' · '+x.v:'')));
   o.onclick=function(){if(mine!==null)return;try{localStorage.setItem('v'+p.id,i)}catch(e){}
    fetch('/api/vote',{method:'POST',body:JSON.stringify({id:p.id,i:i})}).then(load)};b.appendChild(o)});pe.appendChild(b)});
 var cm=$('#cm');cm.textContent='';
 d.comments.forEach(function(c){var e=h('div','c');e.appendChild(h('strong','',c.name));e.appendChild(h('span','',c.text));
  e.appendChild(h('small','',new Date(c.time).toLocaleDateString('es-AR')));if(c.reply){var r=h('div','rp');r.appendChild(h('strong','','Lista Azul: '));r.appendChild(document.createTextNode(c.reply));e.appendChild(r)}cm.appendChild(e)});
}
function load(){return fetch('/api/data').then(function(r){return r.json()}).then(render)}
$('#wb').onclick=function(){$('#w').showModal()};
$('#ok').onclick=function(){$('#w').close();$('#f').hidden=false;$('#wb').hidden=true;$('#n').focus()};
$('#f').onsubmit=function(e){e.preventDefault();fetch('/api/comment',{method:'POST',body:JSON.stringify({name:$('#n').value,text:$('#t').value})}).then(function(){$('#t').value='';return load()})};
load();
// partículas
(function(){var c=$('#p'),x=c.getContext('2d'),W,H,ps=[];function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener('resize',rs);
for(var i=0;i<28;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:2+Math.random()*7,v:.15+Math.random()*.45,d:Math.random()*6});
function f(t){x.clearRect(0,0,W,H);ps.forEach(function(p){p.y-=p.v;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}var px=p.x+Math.sin(t/1800+p.d)*14;
x.beginPath();x.arc(px,p.y,p.r,0,7);x.fillStyle='rgba(255,255,255,.28)';x.fill();x.strokeStyle='rgba(255,255,255,.55)';x.stroke()});
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(f)}requestAnimationFrame(f)})();
</script></body></html>`;

const ADMIN = HEAD + `<main><section class="g" id="lg"><h2>Panel de Lista Azul</h2><form id="lf"><input id="pw" type="password" placeholder="Contraseña" autocomplete="current-password" required><button class="btn">Entrar</button></form><small id="er"></small></section>
<div id="pn" hidden><section class="g"><h2>Textos de la página</h2><form id="sf"><label>Texto de inicio<textarea id="s1" rows="3"></textarea></label><label>Propuestas (una por línea)<textarea id="s2" rows="4"></textarea></label><label>Integrantes (uno por línea)<textarea id="s3" rows="4"></textarea></label><label>Usuario de Instagram<input id="s4"></label><button class="btn">Guardar cambios</button></form></section>
<section class="g"><h2>Nueva votación</h2><form id="pf"><input id="q" maxlength="120" placeholder="Pregunta" required><textarea id="op" rows="3" placeholder="Una opción por línea (mínimo 2)" required></textarea><button class="btn">Crear votación</button></form><div id="pl"></div></section>
<section class="g"><h2>Comentarios</h2><div id="cl"></div></section></div></main>
<script>
var $=function(s){return document.querySelector(s)};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var P=sessionStorage.getItem('p')||'';
function A(a,d){return fetch('/api/admin',{method:'POST',headers:{'x-pass':P},body:JSON.stringify(Object.assign({a:a},d||{}))}).then(function(r){if(r.status===401){sessionStorage.removeItem('p');P='';$('#lg').hidden=false;$('#pn').hidden=true;$('#er').textContent='Contraseña incorrecta';throw 0}return r.json()})}
function load(){return fetch('/api/data').then(function(r){return r.json()}).then(function(d){
 $('#s1').value=d.settings.hero;$('#s2').value=d.settings.proposals;$('#s3').value=d.settings.members;$('#s4').value=d.settings.instagram;
 var pl=$('#pl');pl.textContent='';d.polls.forEach(function(p){var e=h('div','c');e.appendChild(h('strong','',p.q));e.appendChild(h('span','',p.o.map(function(x){return x.t+': '+x.v}).join(' | ')));
  var b=h('button','btn s r','Eliminar');b.onclick=function(){A('delPoll',{id:p.id}).then(load)};e.appendChild(b);pl.appendChild(e)});
 var cl=$('#cl');cl.textContent='';if(!d.comments.length)cl.textContent='Todavía no hay comentarios.';
 d.comments.forEach(function(c){var e=h('div','c');e.appendChild(h('strong','',c.name));e.appendChild(h('span','',c.text));
  var i=h('input');i.placeholder='Tu respuesta';i.value=c.reply||'';e.appendChild(i);
  var b=h('button','btn s','Responder');b.onclick=function(){A('reply',{id:c.id,reply:i.value}).then(load)};
  var x=h('button','btn s r','Eliminar');x.onclick=function(){if(confirm('¿Eliminar este comentario?'))A('delete',{id:c.id}).then(load)};
  e.appendChild(b);e.appendChild(x);cl.appendChild(e)})})}
function enter(){A('check').then(function(){$('#lg').hidden=true;$('#pn').hidden=false;load()}).catch(function(){})}
$('#lf').onsubmit=function(e){e.preventDefault();P=$('#pw').value;sessionStorage.setItem('p',P);enter()};
$('#sf').onsubmit=function(e){e.preventDefault();A('settings',{hero:$('#s1').value,proposals:$('#s2').value,members:$('#s3').value,instagram:$('#s4').value}).then(function(){alert('Guardado')})};
$('#pf').onsubmit=function(e){e.preventDefault();A('addPoll',{q:$('#q').value,o:$('#op').value.split('\\n')}).then(function(){$('#q').value='';$('#op').value='';load()})};
$('#pn').hidden=true;if(P)enter();
</script></body></html>`;

const J = (o, s) => new Response(JSON.stringify(o), { status: s || 200, headers: { 'content-type': 'application/json' } });
const page = (b) => new Response(b, { headers: { 'content-type': 'text/html;charset=utf-8' } });
const cut = (s, n) => String(s || '').trim().slice(0, n);

async function getDb(env) {
  const d = (await env.LISTA_DB.get('db', 'json')) || {};
  return { settings: Object.assign({}, DEFAULTS, d.settings), comments: d.comments || [], polls: d.polls || [] };
}
const save = (env, d) => env.LISTA_DB.put('db', JSON.stringify(d));
const id = () => crypto.randomUUID().slice(0, 8);

export default {
  async fetch(req, env) {
    const p = new URL(req.url).pathname;
    if (p === '/logo.svg') return new Response(LOGO, { headers: { 'content-type': 'image/svg+xml', 'cache-control': 'public,max-age=86400' } });
    if (p === '/admin') return page(ADMIN);
    if (p === '/api/data') return J(await getDb(env));
    if (req.method === 'POST' && p === '/api/comment') {
      const b = await req.json().catch(() => ({}));
      const name = cut(b.name, 40), text = cut(b.text, 400);
      if (!name || !text) return J({ error: 'vacío' }, 400);
      const d = await getDb(env);
      d.comments.unshift({ id: id(), name, text, time: Date.now(), reply: '' });
      d.comments = d.comments.slice(0, 300);
      await save(env, d);
      return J({ ok: 1 });
    }
    if (req.method === 'POST' && p === '/api/vote') {
      const b = await req.json().catch(() => ({}));
      const d = await getDb(env);
      const pl = d.polls.find((x) => x.id === b.id);
      if (!pl || !pl.o[b.i]) return J({ error: 'no existe' }, 400);
      pl.o[b.i].v++;
      await save(env, d);
      return J({ ok: 1 });
    }
    if (req.method === 'POST' && p === '/api/admin') {
      if (!env.ADMIN_PASSWORD || req.headers.get('x-pass') !== env.ADMIN_PASSWORD) return J({ error: 'no autorizado' }, 401);
      const b = await req.json().catch(() => ({}));
      const d = await getDb(env);
      if (b.a === 'reply') { const c = d.comments.find((x) => x.id === b.id); if (c) c.reply = cut(b.reply, 400); }
      else if (b.a === 'delete') d.comments = d.comments.filter((x) => x.id !== b.id);
      else if (b.a === 'settings') {
        d.settings = { hero: cut(b.hero, 400), proposals: cut(b.proposals, 1500), members: cut(b.members, 1500), instagram: cut(b.instagram, 40) || DEFAULTS.instagram };
      } else if (b.a === 'addPoll') {
        const o = (b.o || []).map((t) => cut(t, 60)).filter(Boolean).slice(0, 6);
        if (o.length < 2 || !cut(b.q, 120)) return J({ error: 'datos' }, 400);
        d.polls.unshift({ id: id(), q: cut(b.q, 120), o: o.map((t) => ({ t, v: 0 })) });
      } else if (b.a === 'delPoll') d.polls = d.polls.filter((x) => x.id !== b.id);
      else if (b.a !== 'check') return J({ error: 'acción' }, 400);
      if (b.a !== 'check') await save(env, d);
      return J({ ok: 1 });
    }
    return page(HOME);
  }
};
