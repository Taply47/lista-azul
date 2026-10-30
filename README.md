# Lista Azul 2027 — web

Worker de Cloudflare (web + panel `/admin`), datos en KV (`DB`).

## Deploy
1. Subir este repo a GitHub.
2. Cloudflare → Workers & Pages → Create → Import a repository → elegir el repo (build command vacío, deploy `npx wrangler deploy`).
3. Worker → Settings → Variables and Secrets → agregar **secret** `ADMIN_PASSWORD` con la contraseña del panel.
4. Entrar a `https://<tu-worker>.workers.dev/admin`.

La contraseña no está en el código a propósito.
