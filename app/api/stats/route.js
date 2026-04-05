import { query } from '@/lib/db'

export async function GET() {
  try {
    const [total, byStatus, byType, countries, recent] = await Promise.all([
      query('SELECT COUNT(*) FROM policies'),
      query('SELECT status, COUNT(*) FROM policies GROUP BY status'),
      query('SELECT type, COUNT(*) FROM policies GROUP BY type'),
      query('SELECT COUNT(DISTINCT country) FROM policies'),
      query("SELECT COUNT(*) FROM policies WHERE updated_at >= date_trunc('month', NOW())"),
    ])

    return Response.json({
      total: parseInt(total.rows[0].count),
      countries: parseInt(countries.rows[0].count),
      recentUpdates: parseInt(recent.rows[0].count),
      byStatus: Object.fromEntries(byStatus.rows.map(r => [r.status, parseInt(r.count)])),
      byType: Object.fromEntries(byType.rows.map(r => [r.type, parseInt(r.count)])),
    })
  } catch (err) {
    return Response.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}
