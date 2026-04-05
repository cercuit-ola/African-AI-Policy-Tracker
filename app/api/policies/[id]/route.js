import { query } from '@/lib/db'

export async function GET(_, { params }) {
  try {
    const result = await query('SELECT * FROM policies WHERE id = $1', [params.id])
    if (!result.rows.length) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json({ data: result.rows[0] })
  } catch (err) {
    return Response.json({ error: 'Failed to fetch policy' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const body = await request.json()
    const fields = ['title','author','country','flag','region','type','status','summary','source_url','published_at']
    const updates = []
    const values = []
    let i = 1

    for (const f of fields) {
      if (body[f] !== undefined) {
        updates.push(`${f} = $${i++}`)
        values.push(body[f])
      }
    }

    if (!updates.length) {
      return Response.json({ error: 'No fields to update' }, { status: 400 })
    }

    values.push(params.id)
    const result = await query(
      `UPDATE policies SET ${updates.join(', ')} WHERE id = $${i} RETURNING *`,
      values
    )

    if (!result.rows.length) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json({ data: result.rows[0] })
  } catch (err) {
    return Response.json({ error: 'Failed to update policy' }, { status: 500 })
  }
}

export async function DELETE(_, { params }) {
  try {
    const result = await query('DELETE FROM policies WHERE id = $1 RETURNING id', [params.id])
    if (!result.rows.length) {
      return Response.json({ error: 'Not found' }, { status: 404 })
    }
    return Response.json({ message: 'Deleted', id: params.id })
  } catch (err) {
    return Response.json({ error: 'Failed to delete policy' }, { status: 500 })
  }
}
