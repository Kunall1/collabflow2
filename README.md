# CollabFlow — Influencer Brand Collaboration Dashboard

A production-ready SaaS dashboard for influencers to manage brand collaborations, built with **Next.js 14**, **Tailwind CSS**, **PostgreSQL**, **Prisma ORM**, and **NextAuth.js**.

![Stack](https://img.shields.io/badge/Next.js-14-black?style=flat-square) ![Stack](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=flat-square) ![Stack](https://img.shields.io/badge/PostgreSQL-16-336791?style=flat-square) ![Stack](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square) ![Stack](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square)

---

## Features

| Module | Description |
|---|---|
| **Dashboard** | Stat widgets, earnings chart, platform split, upcoming deliverables, brand health scores |
| **Brand Database** | Full CRUD, relationship scoring, contact management, color-coded brands |
| **Campaign Tracking** | Budget utilization bars, deliverable progress, status toggling, timeline tracking |
| **Deliverable Tracker** | Filterable table, inline status updates via API, payment linkage per deliverable |
| **Payment Tracking** | Paid/pending/invoiced summary, transaction history with method tracking |
| **Campaign Calendar** | Monthly grid with color-coded events, navigation between months |
| **Analytics** | Revenue trends, revenue by brand, platform distribution, campaign performance, brand scores |
| **Authentication** | NextAuth.js credentials provider, JWT sessions, middleware-protected routes |
| **API** | 16 REST endpoints with full CRUD, auth-protected, query filtering |

---

## Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/collabflow.git
cd collabflow
npm install
```

### 2. Set Up Database

You need a PostgreSQL database. Free options:

- **[Neon](https://neon.tech)** — Recommended, serverless PostgreSQL (free tier)
- **[Supabase](https://supabase.com)** — PostgreSQL with extras (free tier)
- **[Vercel Postgres](https://vercel.com/storage/postgres)** — Native Vercel integration

Copy the connection string and create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
DATABASE_URL="postgresql://user:password@host:5432/collabflow?sslmode=require"
NEXTAUTH_SECRET="run-this: openssl rand -base64 32"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Push Schema & Seed

```bash
npx prisma db push        # Creates all tables
npm run db:seed            # Inserts demo data
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**Demo login:** `demo@collabflow.io` / `demo123`

---

## Deploy to Vercel

### One-click deploy:

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) → Import your repo
3. Add environment variables:
   - `DATABASE_URL` — your PostgreSQL connection string
   - `NEXTAUTH_SECRET` — `openssl rand -base64 32`
   - `NEXTAUTH_URL` — your Vercel domain (e.g., `https://collabflow.vercel.app`)
4. Deploy!
5. After deploy, visit `/login` and click **"Seed Database"** to populate demo data

### Using Vercel Postgres:

```bash
npm i @vercel/postgres
vercel env pull .env.local
npx prisma db push
npm run db:seed
```

---

## Project Structure

```
collabflow/
├── prisma/
│   ├── schema.prisma          # Database models (6 tables)
│   └── seed.ts                # Demo data seeder
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── login/page.tsx     # Auth page with seed button
│   │   ├── dashboard/
│   │   │   ├── layout.tsx     # Sidebar + header shell
│   │   │   ├── page.tsx       # Main dashboard
│   │   │   ├── brands/        # Brand CRUD
│   │   │   ├── campaigns/     # Campaign management
│   │   │   ├── deliverables/  # Deliverable tracking
│   │   │   ├── payments/      # Payment history
│   │   │   ├── calendar/      # Monthly calendar view
│   │   │   └── analytics/     # Charts & scores
│   │   └── api/
│   │       ├── auth/          # NextAuth handler
│   │       ├── brands/        # GET, POST, PUT, DELETE
│   │       ├── campaigns/     # GET, POST, PATCH, DELETE
│   │       ├── deliverables/  # GET, POST, PATCH, DELETE
│   │       ├── payments/      # GET, POST
│   │       ├── analytics/     # Aggregated dashboard data
│   │       └── seed/          # One-click DB seed from UI
│   ├── components/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   ├── Providers.tsx
│   │   ├── ui/               # StatusBadge, ScoreRing, StatCard, ProgressBar
│   │   └── charts/           # Recharts wrappers
│   └── lib/
│       ├── prisma.ts          # Prisma singleton
│       ├── auth.ts            # NextAuth config
│       └── utils.ts           # Helpers (formatCurrency, cn, etc.)
├── .env.example
├── tailwind.config.js
└── package.json
```

---

## API Reference

Base: `/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/[...nextauth]` | NextAuth login/session |
| `GET` | `/api/brands` | List all brands |
| `POST` | `/api/brands` | Create brand |
| `GET` | `/api/brands/:id` | Get brand details |
| `PUT` | `/api/brands/:id` | Update brand |
| `DELETE` | `/api/brands/:id` | Delete brand |
| `GET` | `/api/campaigns` | List campaigns (with brand info) |
| `POST` | `/api/campaigns` | Create campaign |
| `PATCH` | `/api/campaigns/:id` | Update campaign |
| `DELETE` | `/api/campaigns/:id` | Delete campaign |
| `GET` | `/api/deliverables` | List deliverables (filterable) |
| `POST` | `/api/deliverables` | Create deliverable |
| `PATCH` | `/api/deliverables/:id` | Update deliverable status |
| `DELETE` | `/api/deliverables/:id` | Delete deliverable |
| `GET` | `/api/payments` | List payments (filterable) |
| `POST` | `/api/payments` | Record payment |
| `GET` | `/api/analytics` | Aggregated dashboard stats |
| `POST` | `/api/seed` | Seed database with demo data |

---

## Database Schema

6 tables with proper foreign keys, indexes, and constraints:

- **users** — Auth, profiles
- **brands** — Partners with relationship scores
- **campaigns** — Budget tracking, date ranges, platform types
- **deliverables** — Per-campaign content pieces with payment linkage
- **payments** — Transaction history with method and status
- **calendar_events** — Deadlines and meetings

---

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS 3.4
- **Database:** PostgreSQL
- **ORM:** Prisma 5
- **Auth:** NextAuth.js 4 (Credentials)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Language:** TypeScript 5
- **Deploy:** Vercel

---

## Author

**Rishabh Bhargava**

Built as a portfolio project demonstrating full-stack SaaS architecture with real API integration.
