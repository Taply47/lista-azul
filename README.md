# Lista Azul 2027

Página del centro de estudiantes: propuestas, equipo, votaciones, comentarios con respuestas y panel admin (`/admin`).
Todo corre en un Cloudflare Worker + KV.

## Deploy rápido
1. `npx wrangler kv namespace create LISTA_DB` y pegar el `id` en `wrangler.toml`.
2. `npx wrangler secret put ADMIN_PASSWORD` (la contraseña del panel).
3. `npx wrangler deploy`

## Con GitHub (deploy automático)
Cloudflare > Workers & Pages > Create > Import a repository > elegir `lista-azul`.
Después, en Settings del Worker: agregar el binding KV `LISTA_DB` y la variable secreta `ADMIN_PASSWORD`.
