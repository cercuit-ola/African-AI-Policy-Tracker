# 🌍 African AI Policy Tracker

> A public database and dashboard monitoring AI legislation, regulatory proposals, and policy shifts across all 55 African Union member states.

**Live:** [your-project.vercel.app](https://your-project.vercel.app) &nbsp;|&nbsp; **API:** `/api/policies` &nbsp;|&nbsp; **Built by:** [@cercuit-ola](https://github.com/cercuit-ola)

---

## Why this exists

Africa's data is being shaped by AI policy frameworks designed without African engineers in the room.

Researchers, journalists, civil society organizations, and policymakers currently have no single reliable place to track how African governments are regulating AI — what has passed, what is in draft, and what is changing. This tool is built to close that gap. It is free, open source, and designed to be forked and adapted by any African institution that needs it.

---

## Features

- **Live dashboard** — top policy documents across all 55 AU member states, filterable by type and status
- **REST API** — query policies by country, type, status, date range, with pagination
- **Stats endpoint** — summary counts by status and document type
- **Incremental static regeneration** — pages rebuild automatically every hour
- **Mock data fallback** — dashboard renders even before a database is connected (safe for preview deploys)
- **Open and forkable** — MIT licensed, built on open standards

---

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Database | PostgreSQL (Vercel Postgres / Neon / Supabase / Railway) |
| Hosting | Vercel |
| Styling | Tailwind CSS |
| Language | JavaScript (ES2022) |

---

## Getting started

### Prerequisites

- Node.js 18+
- A PostgreSQL database (see [database options](#database-options) below)

### Local setup

```bash
# 1. Clone the repo
git clone https://github.com/cercuit-ola/african-ai-policy-tracker.git
cd african-ai-policy-tracker

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your DATABASE_URL

# 4. Create the database schema
psql -d your_database -f lib/schema.sql

# 5. Seed with initial data
npm run seed

# 6. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/african-ai-policy-tracker.git
git push -u origin main
```

### Step 2 — Connect Vercel + Postgres

1. Go to [vercel.com](https://vercel.com) → **New Project** → import your repo
2. In your Vercel project: **Storage** tab → **Create Database** → **Postgres**
3. Vercel automatically injects `POSTGRES_URL` into your environment
4. Add one manual environment variable:
   ```
   NEXT_PUBLIC_BASE_URL = https://your-project.vercel.app
   ```

### Step 3 — Set up the database

In Vercel → Storage → your database → **Query** tab, paste and run the contents of `lib/schema.sql`.

Then seed it:

```bash
# Make sure .env.local has your POSTGRES_URL from the Vercel dashboard
npm run seed
```

Your app is live. The dashboard renders with 10 seed documents and the API is immediately available.

---

## Database options

Any PostgreSQL-compatible provider works. Free tiers available on all of these:

| Provider | Notes |
|---|---|
| [Vercel Postgres](https://vercel.com/storage/postgres) | Easiest — auto-injects credentials |
| [Neon](https://neon.tech) | Serverless Postgres, generous free tier |
| [Supabase](https://supabase.com) | Postgres + dashboard + auth |
| [Railway](https://railway.app) | Simple, cheap, no cold starts |

---

## API reference

### `GET /api/policies`

Returns a paginated list of policy documents.

**Query parameters:**

| Parameter | Type | Default | Description |
|---|---|---|---|
| `limit` | number | `10` | Results per page (max 100) |
| `offset` | number | `0` | Pagination offset |
| `years` | number | `2` | How many years back to include |
| `type` | string | — | `legislation` · `regulation` · `framework` · `policy` · `treaty` |
| `status` | string | — | `enacted` · `review` · `draft` · `proposed` · `withdrawn` |
| `country` | string | — | Partial country name match |

**Example:**
```
GET /api/policies?type=legislation&status=enacted&limit=5
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "National Artificial Intelligence Strategy 2024–2030",
      "author": "Ministry of Communications & Digital Economy",
      "country": "Nigeria",
      "flag": "🇳🇬",
      "region": "West Africa",
      "type": "framework",
      "status": "enacted",
      "summary": "...",
      "source_url": "https://nitda.gov.ng",
      "published_at": "2024-03-01"
    }
  ],
  "total": 38,
  "limit": 5,
  "offset": 0
}
```

---

### `GET /api/policies/:id`

Returns a single policy document by ID.

---

### `POST /api/policies`

Creates a new policy document.

**Request body:**
```json
{
  "title": "AI Governance Act",
  "author": "Ministry of Technology",
  "country": "Nigeria",
  "flag": "🇳🇬",
  "region": "West Africa",
  "type": "legislation",
  "status": "draft",
  "summary": "Brief description of the document.",
  "source_url": "https://example.gov.ng",
  "published_at": "2025-01-01"
}
```

---

### `PATCH /api/policies/:id`

Updates specific fields on a policy document. Send only the fields you want to change.

---

### `DELETE /api/policies/:id`

Deletes a policy document. Returns the deleted ID.

---

### `GET /api/stats`

Returns summary statistics across all documents.

**Response:**
```json
{
  "total": 214,
  "countries": 31,
  "recentUpdates": 12,
  "byStatus": {
    "enacted": 38,
    "review": 22,
    "draft": 41,
    "proposed": 113
  },
  "byType": {
    "framework": 61,
    "legislation": 48,
    "regulation": 55,
    "policy": 50
  }
}
```

---

## Project structure

```
african-ai-policy-tracker/
├── app/
│   ├── api/
│   │   ├── policies/
│   │   │   ├── route.js          # GET (list), POST (create)
│   │   │   └── [id]/route.js     # GET, PATCH, DELETE by ID
│   │   └── stats/route.js        # Summary stats
│   ├── components/
│   │   └── Dashboard.jsx         # Client dashboard with filtering
│   ├── layout.jsx
│   ├── page.jsx                  # Server component — fetches data
│   └── globals.css
├── lib/
│   ├── db.js                     # PostgreSQL connection pool
│   └── schema.sql                # Database schema + triggers
├── scripts/
│   └── seed.js                   # Seed 10 initial policy documents
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

---

## Roadmap

- [ ] Web scraper with cron job for automatic policy discovery across AU member state government sites
- [ ] Email and RSS alerts when policy status changes
- [ ] Country detail pages with full legislative history
- [ ] Regional filtering (West Africa, East Africa, North Africa, etc.)
- [ ] Public Participation Platform — multilingual civic engagement in Swahili, Hausa, Yoruba, Amharic
- [ ] Embed widget for NGO and civil society websites
- [ ] Kubernetes deployment config for self-hosted institutions

---

## Contributing

This is open source infrastructure for African AI governance. Contributions are welcome.

**To contribute:**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

**Ways to help beyond code:**
- Submit policy documents that are missing from the database
- Translate the interface into French, Arabic, Swahili, or Amharic
- Connect us with researchers, NGOs, or government bodies working on AI governance in Africa

---

## License

MIT — free to use, fork, and adapt. If you build on this for an African institution, we would love to know about it.

---

## Contact

Built by [@cercuit-ola](https://github.com/cercuit-ola) — a software & Devops engineer and open source volunteer working on AI governance infrastructure for Africa, based in Lagos, Nigeria.

For research collaborations, NGO partnerships, or press enquiries, open an issue or reach out via GitHub.