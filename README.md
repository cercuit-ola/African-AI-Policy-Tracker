# African AI Policy Tracker

A public database and dashboard monitoring AI legislation, regulatory proposals, and policy shifts across all 55 African Union member states.

Built by [@cercuit-ola](https://github.com/cercuit-ola) — part of the open source infrastructure for African AI governance.

---

## Deploy to Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/african-ai-policy-tracker.git
git push -u origin main
```

### 2. Connect Vercel
1. Go to [vercel.com](https://vercel.com) → New Project → Import your repo
2. In your Vercel project: **Storage** tab → **Create Database** → **Postgres**
3. Vercel auto-injects `POSTGRES_URL` into your environment

### 3. Add env variable
In Vercel → Project Settings → Environment Variables:
```
NEXT_PUBLIC_BASE_URL = https://your-project.vercel.app
```

### 4. Seed the database
In Vercel → Storage → your database → **Query** tab, paste the contents of `lib/schema.sql` and run it.

Then locally:
```bash
cp .env.example .env.local
# Fill in POSTGRES_URL from Vercel dashboard
npm install
npm run seed
```

---

## Local development

```bash
npm install
cp .env.example .env.local    # add your DATABASE_URL
npm run seed                   # populate the database
npm run dev                    # http://localhost:3000
```

---

## API Reference

### GET /api/policies
Returns paginated policy documents.

| Param | Description | Default |
|-------|-------------|---------|
| `limit` | Number of results (max 100) | 10 |
| `offset` | Pagination offset | 0 |
| `years` | How many years back | 2 |
| `type` | Filter by type: `legislation`, `regulation`, `framework`, `policy` | — |
| `status` | Filter by status: `enacted`, `review`, `draft`, `proposed` | — |
| `country` | Filter by country name (partial match) | — |

**Example:**
```
GET /api/policies?type=legislation&status=enacted&limit=5
```

### GET /api/policies/:id
Returns a single policy document.

### POST /api/policies
Creates a new policy document.

```json
{
  "title": "AI Governance Act",
  "author": "Ministry of Technology",
  "country": "Nigeria",
  "flag": "🇳🇬",
  "region": "West Africa",
  "type": "legislation",
  "status": "draft",
  "summary": "...",
  "source_url": "https://example.gov.ng",
  "published_at": "2025-01-01"
}
```

### PATCH /api/policies/:id
Updates specific fields on a policy document.

### DELETE /api/policies/:id
Deletes a policy document.

### GET /api/stats
Returns summary statistics:
```json
{
  "total": 214,
  "countries": 31,
  "recentUpdates": 12,
  "byStatus": { "enacted": 38, "review": 22, "draft": 41, "proposed": 113 },
  "byType": { "framework": 61, "legislation": 48, "regulation": 55, "policy": 50 }
}
```

---

## Stack

- **Framework:** Next.js 14 (App Router)
- **Database:** PostgreSQL (Vercel Postgres / Neon / Supabase / Railway)
- **Hosting:** Vercel
- **Styling:** Tailwind CSS + inline styles

## Roadmap

- [ ] Web scraper + cron job for automatic policy discovery
- [ ] Email/RSS alerts when laws change
- [ ] Country detail pages
- [ ] Public Participation Platform (multilingual civic engagement)
- [ ] Embed widget for NGO websites

---

## Contributing

This is open source infrastructure for African AI governance. PRs welcome.
Reach out via [GitHub](https://github.com/cercuit-ola).
# African-AI-Policy-Tracker
