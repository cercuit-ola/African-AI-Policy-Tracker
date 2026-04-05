import Dashboard from './components/Dashboard'

export const revalidate = 3600 // re-fetch every hour (ISR)

async function getData() {
  const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
  try {
    const [policiesRes, statsRes] = await Promise.all([
      fetch(`${base}/api/policies?limit=10&years=2`, { next: { revalidate: 3600 } }),
      fetch(`${base}/api/stats`, { next: { revalidate: 3600 } }),
    ])
    const policies = await policiesRes.json()
    const stats = await statsRes.json()
    return { policies: policies.data || [], stats }
  } catch {
    // Fallback to mock data if DB not connected yet
    return { policies: mockPolicies, stats: mockStats }
  }
}

export default async function Home() {
  const { policies, stats } = await getData()
  return <Dashboard initialPolicies={policies} initialStats={stats} />
}

// --- Mock data (used when DB is not yet connected) ---
const mockPolicies = [
  { id:1, title:'National Artificial Intelligence Strategy 2024–2030', author:'Ministry of Communications & Digital Economy', country:'Nigeria', flag:'🇳🇬', type:'framework', status:'enacted', published_at:'2024-03-01' },
  { id:2, title:'Data Protection and AI Accountability Bill', author:'Parliament of Kenya / CA Kenya', country:'Kenya', flag:'🇰🇪', type:'legislation', status:'review', published_at:'2024-08-15' },
  { id:3, title:'AI Governance and Ethics Regulation', author:'South African Dept. of Science & Innovation', country:'South Africa', flag:'🇿🇦', type:'regulation', status:'draft', published_at:'2025-01-10' },
  { id:4, title:'Continental AI Policy Framework', author:'African Union Commission', country:'AU (all states)', flag:'🌍', type:'framework', status:'enacted', published_at:'2024-02-01' },
  { id:5, title:'Algorithmic Systems and Citizen Rights Act', author:'Parliament of Ghana', country:'Ghana', flag:'🇬🇭', type:'legislation', status:'proposed', published_at:'2024-09-20' },
  { id:6, title:'Rwanda National AI Policy', author:'Rwanda ICT Ministry / RISA', country:'Rwanda', flag:'🇷🇼', type:'policy', status:'enacted', published_at:'2024-06-01' },
  { id:7, title:'Digital Economy and AI Investment Framework', author:'Ministry of Digital Economy, Ethiopia', country:'Ethiopia', flag:'🇪🇹', type:'framework', status:'draft', published_at:'2024-11-05' },
  { id:8, title:'Automated Decision-Making Oversight Regulation', author:'Egyptian Cabinet / MCIT', country:'Egypt', flag:'🇪🇬', type:'regulation', status:'review', published_at:'2024-12-01' },
  { id:9, title:'National Data Sovereignty and AI Charter', author:'Ministère de la Communication, Sénégal', country:'Senegal', flag:'🇸🇳', type:'policy', status:'draft', published_at:'2025-02-14' },
  { id:10, title:'AI Standards and Public Procurement Policy', author:'TCRA / Ministry of Works', country:'Tanzania', flag:'🇹🇿', type:'policy', status:'proposed', published_at:'2025-03-10' },
]

const mockStats = {
  total: 214, countries: 31, recentUpdates: 12,
  byStatus: { enacted: 38, review: 22, draft: 41, proposed: 113 },
  byType: { framework: 61, legislation: 48, regulation: 55, policy: 50 },
}
