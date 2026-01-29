import pool from "@/lib/db";

export async function GET(req, { params }) {
  const { id } = params;

  const client = await pool.connect();

  try {
    const result = await client.query(
      `SELECT id, content, views, max_views, expires_at
       FROM pastes
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const paste = result.rows[0];
    const now = Date.now();

    if (paste.expires_at && now > new Date(paste.expires_at).getTime()) {
      return Response.json({ error: "Expired" }, { status: 404 });
    }

    if (paste.max_views !== null && paste.views >= paste.max_views) {
      return Response.json({ error: "View limit exceeded" }, { status: 404 });
    }

    await client.query(
      `UPDATE pastes SET views = views + 1 WHERE id = $1`,
      [id]
    );

    return Response.json({
      content: paste.content,
      remaining_views:
        paste.max_views === null ? null : paste.max_views - paste.views - 1,
      expires_at: paste.expires_at,
    });
  } finally {
    client.release();
  }
}
