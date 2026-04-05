// Run: node scripts/seed.js
// Make sure .env.local exists with your DATABASE_URL first

require('dotenv').config({ path: '.env.local' })
const { Pool } = require('pg')

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

const policies = [
  {
    title: 'National Artificial Intelligence Strategy 2024–2030',
    author: 'Ministry of Communications & Digital Economy',
    country: 'Nigeria', flag: '🇳🇬', region: 'West Africa',
    type: 'framework', status: 'enacted',
    summary: 'A national strategy outlining Nigeria\'s approach to AI adoption, governance, and investment through 2030.',
    source_url: 'https://nitda.gov.ng',
    published_at: '2024-03-01',
  },
  {
    title: 'Data Protection and AI Accountability Bill',
    author: 'Parliament of Kenya / CA Kenya',
    country: 'Kenya', flag: '🇰🇪', region: 'East Africa',
    type: 'legislation', status: 'review',
    summary: 'Proposed legislation to extend data protection rules to AI-generated decisions affecting Kenyan citizens.',
    source_url: 'https://www.parliament.go.ke',
    published_at: '2024-08-15',
  },
  {
    title: 'AI Governance and Ethics Regulation',
    author: 'South African Dept. of Science & Innovation',
    country: 'South Africa', flag: '🇿🇦', region: 'Southern Africa',
    type: 'regulation', status: 'draft',
    summary: 'Draft regulations establishing ethical guidelines and accountability structures for AI systems deployed in South Africa.',
    source_url: 'https://www.dst.gov.za',
    published_at: '2025-01-10',
  },
  {
    title: 'Continental AI Policy Framework',
    author: 'African Union Commission',
    country: 'AU (all states)', flag: '🌍', region: 'Continental',
    type: 'framework', status: 'enacted',
    summary: 'The AU Commission\'s overarching framework for harmonizing AI governance across all 55 member states.',
    source_url: 'https://au.int',
    published_at: '2024-02-01',
  },
  {
    title: 'Algorithmic Systems and Citizen Rights Act',
    author: 'Parliament of Ghana',
    country: 'Ghana', flag: '🇬🇭', region: 'West Africa',
    type: 'legislation', status: 'proposed',
    summary: 'Proposed act requiring transparency and human oversight for algorithmic systems used in public services.',
    source_url: 'https://www.parliament.gh',
    published_at: '2024-09-20',
  },
  {
    title: 'Rwanda National AI Policy',
    author: 'Rwanda ICT Ministry / RISA',
    country: 'Rwanda', flag: '🇷🇼', region: 'East Africa',
    type: 'policy', status: 'enacted',
    summary: 'Rwanda\'s national policy positioning the country as an AI hub for East Africa, with focus on health and agriculture.',
    source_url: 'https://www.risa.rw',
    published_at: '2024-06-01',
  },
  {
    title: 'Digital Economy and AI Investment Framework',
    author: 'Ministry of Digital Economy, Ethiopia',
    country: 'Ethiopia', flag: '🇪🇹', region: 'East Africa',
    type: 'framework', status: 'draft',
    summary: 'A framework attracting AI investment while establishing sovereign oversight of data and systems.',
    source_url: 'https://www.ethiopia.gov.et',
    published_at: '2024-11-05',
  },
  {
    title: 'Automated Decision-Making Oversight Regulation',
    author: 'Egyptian Cabinet / MCIT',
    country: 'Egypt', flag: '🇪🇬', region: 'North Africa',
    type: 'regulation', status: 'review',
    summary: 'Regulation requiring government agencies to disclose and audit automated decision-making systems.',
    source_url: 'https://mcit.gov.eg',
    published_at: '2024-12-01',
  },
  {
    title: 'National Data Sovereignty and AI Charter',
    author: 'Ministère de la Communication, Sénégal',
    country: 'Senegal', flag: '🇸🇳', region: 'West Africa',
    type: 'policy', status: 'draft',
    summary: 'Charter establishing Senegal\'s rights over citizen data and conditions under which AI systems may operate.',
    source_url: 'https://www.numerique.gouv.sn',
    published_at: '2025-02-14',
  },
  {
    title: 'AI Standards and Public Procurement Policy',
    author: 'TCRA / Ministry of Works',
    country: 'Tanzania', flag: '🇹🇿', region: 'East Africa',
    type: 'policy', status: 'proposed',
    summary: 'Policy requiring AI products procured by the Tanzanian government to meet open standards and auditability requirements.',
    source_url: 'https://www.tcra.go.tz',
    published_at: '2025-03-10',
  },
]

async function seed() {
  const client = await pool.connect()
  try {
    console.log('Creating table if not exists...')
    await client.query(`
      CREATE TABLE IF NOT EXISTS policies (
        id          SERIAL PRIMARY KEY,
        title       TEXT NOT NULL,
        author      TEXT NOT NULL,
        country     TEXT NOT NULL,
        flag        TEXT,
        region      TEXT,
        type        TEXT,
        status      TEXT,
        summary     TEXT,
        source_url  TEXT,
        published_at DATE,
        created_at  TIMESTAMPTZ DEFAULT NOW(),
        updated_at  TIMESTAMPTZ DEFAULT NOW()
      )
    `)

    console.log('Seeding policies...')
    for (const p of policies) {
      await client.query(
        `INSERT INTO policies (title, author, country, flag, region, type, status, summary, source_url, published_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
         ON CONFLICT DO NOTHING`,
        [p.title, p.author, p.country, p.flag, p.region, p.type, p.status, p.summary, p.source_url, p.published_at]
      )
    }
    console.log(`Seeded ${policies.length} policy documents.`)
  } finally {
    client.release()
    await pool.end()
  }
}

seed().catch(console.error)
