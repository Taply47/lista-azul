var $=function(s){return document.querySelector(s)};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function lst(id,txt){var u=$(id);u.textContent='';txt.split('\n').forEach(function(l){if(l.trim())u.appendChild(h('li','',l.trim()))})}
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
$('#f').onsubmit=function(e){e.preventDefault();fetch('/api/comment',{method:'POST',body:JSON.stringify({name:$('#n').value,text:$('#t').value})}).then(function(){$('#t').value='';$('#msg').hidden=false;return load()})};
load();
// partículas
(function(){var c=$('#p'),x=c.getContext('2d'),W,H,ps=[];function rs(){W=c.width=innerWidth;H=c.height=innerHeight}rs();addEventListener('resize',rs);
for(var i=0;i<28;i++)ps.push({x:Math.random()*W,y:Math.random()*H,r:2+Math.random()*7,v:.15+Math.random()*.45,d:Math.random()*6});
function f(t){x.clearRect(0,0,W,H);ps.forEach(function(p){p.y-=p.v;if(p.y<-10){p.y=H+10;p.x=Math.random()*W}var px=p.x+Math.sin(t/1800+p.d)*14;
x.beginPath();x.arc(px,p.y,p.r,0,7);x.fillStyle='rgba(255,255,255,.28)';x.fill();x.strokeStyle='rgba(255,255,255,.55)';x.stroke()});
if(!matchMedia('(prefers-reduced-motion:reduce)').matches)requestAnimationFrame(f)}requestAnimationFrame(f)})();
