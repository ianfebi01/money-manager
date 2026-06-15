<p align="center">
  <img alt="Money Manager" src="https://raw.githubusercontent.com/ianfebi01/money-manager/main/public/images/logo.svg" height="64">
</p>

<h1 align="center">Money Manager</h1>

<p align="center">
  A modern, self-hosted personal finance tracker. Track income, expenses, and financial goals with a clean, intuitive interface.
</p>

<p align="center">
  <a href="https://moneymanager.id"><strong>moneymanager.id</strong></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?logo=next.js" alt="Next.js 14">
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript">
  <img src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql" alt="PostgreSQL 16">
  <img src="https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss" alt="Tailwind CSS 3">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="License MIT">
</p>

---

## Features

- **Transaction Tracking** -- Add, edit, and categorize income and expenses with rich metadata.
- **Visual Reports** -- Monthly breakdowns and interactive charts powered by D3.js and ApexCharts.
- **Financial Goals** -- Set targets and monitor progress over time.
- **Google Authentication** -- Secure sign-in via NextAuth.js with Google OAuth.
- **Multi-Language** -- Full English and Bahasa Indonesia support via next-intl.
- **Dark Mode** -- Automatic theme detection with manual toggle.
- **PWA Support** -- Installable on mobile and desktop for offline access.
- **AI-Powered Insights** -- Summaries and suggestions via Vercel AI SDK.
- **Full-Text Search** -- Instant transaction search with Meilisearch.
- **Data Export** -- Export reports to Excel (ExcelJS).

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 14](https://nextjs.org/) (App Router) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/) (raw SQL via `pg`) |
| **Authentication** | [NextAuth.js](https://next-auth.js.org/) (Google OAuth) |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) - [Headless UI](https://headlessui.com/) - SCSS Modules |
| **State & Data** | [TanStack React Query](https://tanstack.com/query) - [TanStack Table](https://tanstack.com/table) |
| **Forms & Validation** | [Formik](https://formik.org/) - [Yup](https://github.com/jquense/yup) - [Zod](https://zod.dev/) |
| **Charts** | [D3.js](https://d3js.org/) - [ApexCharts](https://apexcharts.com/) |
| **Animations** | [GSAP](https://gsap.com/) - [Framer Motion](https://www.framer.com/motion/) |
| **Search** | [Meilisearch](https://www.meilisearch.com/) (via react-instantsearch) |
| **AI** | [Vercel AI SDK](https://sdk.vercel.ai/) |
| **i18n** | [next-intl](https://next-intl-docs.vercel.app/) |
| **PWA** | [next-pwa](https://github.com/shadowwalker/next-pwa) |
| **Rich Text** | [React Quill](https://github.com/zenoamaro/react-quill) - [Marked](https://marked.js.org/) |
| **Containerization** | [Docker](https://www.docker.com/) - Docker Compose |
| **Package Manager** | [pnpm](https://pnpm.io/) |

## Architecture

```
┌──────────────────────────────────────────────┐
│                 Reverse Proxy                 │
│                 (Nginx/Traefik)               │
└──────────────────┬───────────────────────────┘
                   │
       ┌───────────┴────────────┐
       │                        │
┌──────▼──────┐        ┌───────▼────────┐
│   Next.js   │        │  PostgreSQL 16 │
│  (Docker)   │◄──────►│   (Docker)     │
│   :3000      │  net   │   :5432        │
└─────────────┘        └────────────────┘
```

The application is containerized and deployed behind a reverse proxy on a VPS. The Next.js server handles both the frontend and API routes. PostgreSQL runs as a separate container on a shared Docker bridge network.

## Getting Started

### Prerequisites

- **Node.js** 18+
- **pnpm** 9+
- **Docker** & Docker Compose (for production-like environment)
- **PostgreSQL** 16 (local or via Docker)

### Environment Variables

Copy the example file and edit with your credentials:

```bash
cp .env.example .env
```

Required variables:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `NEXTAUTH_SECRET` | NextAuth secret (generate with `openssl rand -base64 32`) |
| `NEXTAUTH_URL` | Canonical URL of the site (e.g. `http://localhost:3000`) |

### Development

```bash
# Start a local PostgreSQL database
docker compose -f docker-compose.dev.yml up -d

# Install dependencies
pnpm install

# Initialize the database schema
pnpm init:db

# Start the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production (Docker)

```bash
# Build and start all services
docker compose up -d --build
```

The app runs on port `3000` behind your configured reverse proxy.

### Database Management

```bash
# Dump the database
./dump-database.sh

# Import a database dump into Docker
./import-database-docker.sh

# Restore from backup
./backup_database.sh
```

## Project Structure

```
money-manager/
├── app/                    # Next.js App Router pages & API routes
│   ├── [locale]/           # Localized routes (en / id)
│   └── api/                # API handlers (auth, transactions, categories, AI)
├── components/             # Reusable UI components
│   ├── Buttons/
│   ├── Cards/
│   ├── Chart/
│   ├── Form/
│   ├── Icons/
│   ├── Inputs/
│   ├── Layouts/
│   ├── Modal/
│   └── Sections/
├── lib/                    # Core utilities & database client
├── i18n/                   # Internationalization config
├── messages/               # Translation JSON files (en.json, id.json)
├── public/                 # Static assets & PWA manifest
├── types/                  # TypeScript type definitions
├── utils/                  # Helper functions
├── scripts/                # DB init & env loader scripts
├── docker-compose.yml      # Production Docker Compose
├── docker-compose.dev.yml  # Development database only
└── Dockerfile              # Multi-stage production build
```

## License

MIT © [Ian Febi](https://github.com/ianfebi01)
