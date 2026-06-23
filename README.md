# MyVisa

A visa-assistance web app — implementation of the **MyVisa** Claude Design
(`MyVisa.dc.html`). Built with **Next.js (App Router, TypeScript)**, **PostgreSQL +
Prisma**, containerized with **Docker**, and deployed to **k3s** via **GitHub Actions**.

## Pages

| Route | Description |
| --- | --- |
| `/` | Marketing home — hero with an interactive **visa checker**, how-it-works, services, DIY-vs-MyVisa comparison, searchable **destinations**, pricing, FAQ. |
| `/apply` | 5-step **application wizard** (Personal → Travel → Documents → Review → Payment) with validation; submit persists an `Application`. |
| `/dashboard` | The user's applications with a **status timeline**, document states, specialist messages, and payment summary. |
| `/contact` | Contact form — persists a `ContactMessage`. |
| `/admin` | Admin panel — customers table, revenue stats, customer **detail dialog** with refund. Behind a basic-auth gate (`src/middleware.ts`). |

> **Design note:** the shared design export contained full markup only for the Home
> and Admin pages. The Apply wizard, Dashboard, and Contact pages were reconstructed
> from the design's embedded logic, fields, validation rules, and seed data, in the
> same visual language. Uploads and payment are mocked (metadata only), matching the design.

## Local development

Postgres runs in Docker on host port **5433**.

```bash
docker compose up -d db          # or: docker start myvisa-pg
npm install
npm run db:push                  # sync schema (or: npx prisma migrate dev)
npm run db:seed                  # 8 admin customers + 3 demo dashboard apps
npm run dev                      # http://localhost:3000
```

Environment (`.env`, see `.env.example`):

```
DATABASE_URL="postgresql://myvisa:myvisa@localhost:5433/myvisa?schema=public"
ADMIN_USER="admin"
ADMIN_PASSWORD="myvisa-admin"   # leave empty to disable the /admin gate locally
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `db:push`, `db:reset`, `db:seed`.

## Docker

```bash
docker build -t myvisa .
docker run -p 3000:3000 -e DATABASE_URL=... myvisa
```

Multi-stage build → Next.js **standalone** output, runs as non-root (uid 1001). The
image also bundles the Prisma CLI + schema + migrations so the k8s init-container can
run `prisma migrate deploy`.

## Deployment (k3s)

`k8s/` mirrors the Avero reference setup:

- `namespace.yaml` — `myvisa` namespace
- `postgres.yaml` — in-cluster Postgres 16 (Deployment + PVC + Service)
- `deployment.yaml` — web Deployment; **init-container** runs migrations; envFrom `myvisa-secrets`
- `service.yaml` — ClusterIP `:80 → http`
- `ingress.yaml` — traefik + cert-manager (`letsencrypt-prod`) TLS for **myvisa.aydex.nl**

`.github/workflows/`:

- `ci.yml` — lint, typecheck, build on every push/PR
- `deploy.yml` — build & push image to GHCR, SSH to the VPS, sync manifests + secrets,
  roll the deployment, https smoke test

### Required GitHub repo secrets

| Secret | Purpose |
| --- | --- |
| `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` | SSH access to the k3s VPS |
| `MYVISA_DB_PASSWORD` | Postgres password (used for the in-cluster DB **and** `DATABASE_URL`) |
| `MYVISA_ADMIN_USER`, `MYVISA_ADMIN_PASSWORD` | `/admin` basic-auth credentials |
| `GHCR_PULL_TOKEN` | GHCR read:packages token for the cluster image-pull secret |

`DATABASE_URL` is assembled by the workflow to point at the in-cluster service
(`myvisa-postgres:5432`). To populate demo data in the cluster, run the seed against the
DB once (e.g. `kubectl port-forward svc/myvisa-postgres 5433:5432` then `npm run db:seed`).
