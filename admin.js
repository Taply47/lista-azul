var $=function(s){return document.querySelector(s)};
function h(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var P=sessionStorage.getItem('p')||'';
function A(a,d){return fetch('/api/admin',{method:'POST',headers:{'x-pass':P},body:JSON.stringify(Object.assign({a:a},d||{}))}).then(function(r){if(r.status===401){sessionStorage.removeItem('p');P='';$('#lg').hidden=false;$('#pn').hidden=true;$('#er').textContent='Contraseña incorrecta';throw 0}return r.json()})}
function load(){return A('data').then(function(d){
 $('#s1').value=d.settings.hero;$('#s2').value=d.settings.proposals;$('#s3').value=d.settings.members;$('#s4').value=d.settings.instagram;
 var pl=$('#pl');pl.textContent='';d.polls.forEach(function(p){var e=h('div','c');e.appendChild(h('strong','',p.q));e.appendChild(h('span','',p.o.map(function(x){return x.t+': '+x.v}).join(' | ')));
  var b=h('button','btn s r','Eliminar');b.onclick=function(){A('delPoll',{id:p.id}).then(load)};e.appendChild(b);pl.appendChild(e)});
 var cl=$('#cl');cl.textContent='';if(!d.comments.length)cl.textContent='Todavía no hay comentarios.';
 d.comments.forEach(function(c){var e=h('div','c');e.appendChild(h('strong','',c.name));if(c.approved===false)e.appendChild(h('em','','Pendiente de aprobación'));e.appendChild(h('span','',c.text));
  var i=h('input');i.placeholder='Tu respuesta';i.value=c.reply||'';e.appendChild(i);
  var b=h('button','btn s','Responder');b.onclick=function(){A('reply',{id:c.id,reply:i.value}).then(load)};
  var x=h('button','btn s r','Eliminar');x.onclick=function(){if(confirm('¿Eliminar este comentario?'))A('delete',{id:c.id}).then(load)};
  if(c.approved===false){var ap=h('button','btn s','Aprobar');ap.onclick=function(){A('approve',{id:c.id}).then(load)};e.appendChild(ap)}
  e.appendChild(b);e.appendChild(x);cl.appendChild(e)})})}
function enter(){A('check').then(function(){$('#lg').hidden=true;$('#pn').hidden=false;load()}).catch(function(){})}
$('#lf').onsubmit=function(e){e.preventDefault();P=$('#pw').value;sessionStorage.setItem('p',P);enter()};
$('#sf').onsubmit=function(e){e.preventDefault();A('settings',{hero:$('#s1').value,proposals:$('#s2').value,members:$('#s3').value,instagram:$('#s4').value}).then(function(){alert('Guardado')})};
$('#pf').onsubmit=function(e){e.preventDefault();A('addPoll',{q:$('#q').value,o:$('#op').value.split('\n')}).then(function(){$('#q').value='';$('#op').value='';load()})};
$('#pn').hidden=true;if(P)enter();
