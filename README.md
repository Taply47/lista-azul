# Lista Azul 2027

Página del centro de estudiantes: propuestas, equipo, votaciones y comentarios con respuestas.
Panel admin en `/admin`. Corre en Cloudflare Workers + KV.

## Estructura
- `public/` la página (index, admin, estilos, scripts y logo)
- `src/worker.js` la API (comentarios, votos, admin)
- `wrangler.toml` configuración de Cloudflare

## Deploy desde GitHub
1. Subí esta carpeta al repo `lista-azul`.
2. Cloudflare > Workers & Pages > Create > Import a repository > `lista-azul` (deploy command: `npx wrangler deploy`).
3. En el Worker > Settings > Variables and Secrets: agregá el secret `ADMIN_PASSWORD`.
4. Si no se creó solo el KV `LISTA_DB`, creá uno y asociarlo en Settings > Bindings.

## Probar en tu PC
```
npm install
copy .dev.vars.example .dev.vars   (y cambiá la contraseña)
npm run dev
```
