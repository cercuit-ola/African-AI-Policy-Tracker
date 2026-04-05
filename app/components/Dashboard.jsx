'use client'
import { useState, useEffect, useCallback } from 'react'

const STATUS = {
  enacted:  { label: 'Enacted',    cls: { bg:'#E1F5EE', color:'#085041' } },
  review:   { label: 'In review',  cls: { bg:'#E6F1FB', color:'#0C447C' } },
  draft:    { label: 'Draft',      cls: { bg:'#FAEEDA', color:'#633806' } },
  proposed: { label: 'Proposed',   cls: { bg:'#EEEDFE', color:'#3C3489' } },
  withdrawn:{ label: 'Withdrawn',  cls: { bg:'#FCEBEB', color:'#791F1F' } },
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-GB', { month:'short', year:'numeric' })
}

export default function Dashboard({ initialPolicies, initialStats }) {
  const [policies, setPolicies]   = useState(initialPolicies)
  const [stats, setStats]         = useState(initialStats)
  const [filter, setFilter]       = useState('all')
  const [loading, setLoading]     = useState(false)

  const load = useCallback(async (type) => {
    setLoading(true)
    try {
      const url = `/api/policies?limit=10&years=2${type !== 'all' ? `&type=${type}` : ''}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.data) setPolicies(json.data)
    } catch {}
    setLoading(false)
  }, [])

  const handleFilter = (f) => {
    setFilter(f)
    load(f)
  }

  const active = (f) => ({
    padding:'4px 12px', borderRadius:99, fontSize:12, border:'none', cursor:'pointer',
    background: filter === f ? '#1D9E75' : 'transparent',
    color: filter === f ? '#fff' : '#666',
    fontWeight: filter === f ? '500' : '400',
    outline: filter !== f ? '0.5px solid #ccc' : 'none',
  })

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'2rem 1.5rem' }}>

      {/* Header */}
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#1D9E75', display:'inline-block', animation:'pulse 1.8s infinite' }}/>
          <h1 style={{ fontSize:22, fontWeight:500, margin:0 }}>African AI Policy Tracker</h1>
        </div>
        <p style={{ fontSize:13, color:'#666', margin:0 }}>
          Monitoring AI legislation and regulatory proposals across 55 AU member states
        </p>
      </div>

      {/* Metric cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,minmax(0,1fr))', gap:10, marginBottom:'1.5rem' }}>
        {[
          { label:'Documents tracked', value: stats?.total ?? '—', sub:'Across 55 member states' },
          { label:'Active legislation', value: (stats?.byStatus?.enacted ?? 0) + (stats?.byStatus?.review ?? 0), sub:'Enacted or in review' },
          { label:'Updates this month', value: stats?.recentUpdates ?? '—', sub:'Recent changes' },
          { label:'Countries active', value: stats?.countries ?? '—', sub:'Of 55 AU members' },
        ].map(m => (
          <div key={m.label} style={{ background:'#f3f3f1', borderRadius:8, padding:'14px 16px' }}>
            <div style={{ fontSize:12, color:'#888', marginBottom:6 }}>{m.label}</div>
            <div style={{ fontSize:24, fontWeight:500 }}>{m.value}</div>
            <div style={{ fontSize:11, color:'#aaa', marginTop:3 }}>{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:8, marginBottom:'1rem', flexWrap:'wrap', alignItems:'center' }}>
        <span style={{ fontSize:12, color:'#888' }}>Filter:</span>
        {['all','legislation','regulation','framework','policy'].map(f => (
          <button key={f} style={active(f)} onClick={() => handleFilter(f)}>
            {f === 'all' ? 'All types' : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ border:'0.5px solid #e0e0e0', borderRadius:12, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse', fontSize:13, tableLayout:'fixed' }}>
          <colgroup>
            <col style={{ width:32 }} />
            <col style={{ width:'36%' }} />
            <col style={{ width:'18%' }} />
            <col style={{ width:'12%' }} />
            <col style={{ width:'13%' }} />
            <col style={{ width:'13%' }} />
          </colgroup>
          <thead style={{ background:'#f7f7f5' }}>
            <tr>
              {['#','Document / Author','Country','Type','Status','Date'].map(h => (
                <th key={h} style={{ padding:'10px 14px', textAlign:'left', fontWeight:500, fontSize:12, color:'#888', borderBottom:'0.5px solid #e0e0e0' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody style={{ opacity: loading ? 0.5 : 1, transition:'opacity 0.2s' }}>
            {policies.map((p, i) => {
              const s = STATUS[p.status] || STATUS.proposed
              return (
                <tr key={p.id} style={{ borderBottom:'0.5px solid #f0f0f0' }}
                  onMouseEnter={e => e.currentTarget.style.background='#fafaf8'}
                  onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <td style={{ padding:'12px 14px', color:'#aaa', fontSize:12 }}>{i+1}</td>
                  <td style={{ padding:'12px 14px' }}>
                    <div style={{ fontWeight:500, lineHeight:1.4 }}>{p.title}</div>
                    <div style={{ fontSize:11, color:'#888', marginTop:3 }}>{p.author}</div>
                  </td>
                  <td style={{ padding:'12px 14px', whiteSpace:'nowrap' }}>
                    <span style={{ fontSize:15, marginRight:5 }}>{p.flag}</span>
                    {p.country}
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ fontSize:10, padding:'2px 7px', borderRadius:3, background:'#f0f0ee', color:'#666', border:'0.5px solid #ddd', whiteSpace:'nowrap' }}>
                      {p.type}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px' }}>
                    <span style={{ fontSize:11, padding:'2px 8px', borderRadius:99, fontWeight:500, whiteSpace:'nowrap', ...s.cls }}>
                      {s.label}
                    </span>
                  </td>
                  <td style={{ padding:'12px 14px', fontSize:12, color:'#888', whiteSpace:'nowrap' }}>
                    {fmt(p.published_at)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div style={{ marginTop:'1rem', fontSize:11, color:'#aaa', display:'flex', justifyContent:'space-between' }}>
        <span>Data refreshes every hour. Source links in full records.</span>
        <a href="https://github.com/cercuit-ola" target="_blank" rel="noopener noreferrer"
           style={{ color:'#1D9E75', textDecoration:'none', fontSize:12 }}>
          github.com/cercuit-ola ↗
        </a>
      </div>

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  )
}
