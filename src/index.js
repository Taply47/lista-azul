// Lista Azul 2027 - Worker (API de comentarios, votaciones y panel admin).
// La página (public/) la sirve Cloudflare como archivos estáticos.
// Necesita: KV binding DB y secret ADMIN_PASSWORD

const DEFAULTS = {
  hero: 'Somos Lista Azul. Queremos que el colegio sea un lugar más cómodo para todos. Escribinos tus ideas.',
  proposals: 'Mejorar los baños y los bebederos\nMás lugares para sentarse en los recreos\nEspacios para estudiar tranquilos\nUn buzón de ideas que realmente se responda',
  members: 'Presidente/a: a completar\nVicepresidente/a: a completar\nSecretario/a: a completar',
  instagram: 'listaazul2027'
};

const J = (o, s) => new Response(JSON.stringify(o), { status: s || 200, headers: { 'content-type': 'application/json' } });
const cut = (s, n) => String(s || '').trim().slice(0, n);

async function getDb(env) {
  const d = (await env.DB.get('db', 'json')) || {};
  return { settings: Object.assign({}, DEFAULTS, d.settings), comments: d.comments || [], polls: d.polls || [] };
}
const save = (env, d) => env.DB.put('db', JSON.stringify(d));
const id = () => crypto.randomUUID().slice(0, 8);

export default {
  async fetch(req, env) {
    const p = new URL(req.url).pathname;
    if (p === '/api/data') {
      const d = await getDb(env);
      d.comments = d.comments.filter((c) => c.approved !== false);
      return J(d);
    }
    if (req.method === 'POST' && p === '/api/comment') {
      const b = await req.json().catch(() => ({}));
      const name = cut(b.name, 40), text = cut(b.text, 400);
      if (!name || !text) return J({ error: 'vacío' }, 400);
      const d = await getDb(env);
      d.comments.unshift({ id: id(), name, text, time: Date.now(), reply: '', approved: false });
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
      if (b.a === 'data') return J(d);
      if (b.a === 'reply') { const c = d.comments.find((x) => x.id === b.id); if (c) c.reply = cut(b.reply, 400); }
      else if (b.a === 'approve') { const c = d.comments.find((x) => x.id === b.id); if (c) c.approved = true; }
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
    return env.ASSETS.fetch(req);
  }
};

