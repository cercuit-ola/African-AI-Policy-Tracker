import { query } from '@/lib/db'

export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const type    = searchParams.get('type')
  const status  = searchParams.get('status')
  const country = searchParams.get('country')
  const years   = parseInt(searchParams.get('years') || '2')
  const limit   = Math.min(parseInt(searchParams.get('limit') || '10'), 100)
  const offset  = parseInt(searchParams.get('offset') || '0')

  const conditions = [`published_at >= NOW() - INTERVAL '${years} years'`]
  const values = []
  let i = 1

  if (type)    { conditions.push(`type = $${i++}`);    values.push(type) }
  if (status)  { conditions.push(`status = $${i++}`);  values.push(status) }
  if (country) { conditions.push(`country ILIKE $${i++}`); values.push(`%${country}%`) }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : ''

  try {
    const [rows, countResult] = await Promise.all([
      query(
        `SELECT id, title, author, country, flag, region, type, status, summary, source_url, published_at
         FROM policies ${where}
         ORDER BY published_at DESC
         LIMIT ${limit} OFFSET ${offset}`,
        values
      ),
      query(`SELECT COUNT(*) FROM policies ${where}`, values),
    ])

    return Response.json({
      data: rows.rows,
      total: parseInt(countResult.rows[0].count),
      limit,
      offset,
    })
  } catch (err) {
    console.error('DB error:', err)
    return Response.json({ error: 'Failed to fetch policies' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { title, author, country, flag, region, type, status, summary, source_url, published_at } = body

    if (!title || !author || !country) {
      return Response.json({ error: 'title, author, and country are required' }, { status: 400 })
    }

    const result = await query(
      `INSERT INTO policies (title, author, country, flag, region, type, status, summary, source_url, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING *`,
      [title, author, country, flag, region, type, status, summary, source_url, published_at]
    )

    return Response.json({ data: result.rows[0] }, { status: 201 })
  } catch (err) {
    console.error('DB error:', err)
    return Response.json({ error: 'Failed to create policy' }, { status: 500 })
  }
}
