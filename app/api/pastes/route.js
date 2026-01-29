import connectDB from "@/lib/db";
import Paste from "@/models/Paste";

export async function POST(req) {
  const { content, ttl_seconds, max_views } = await req.json();

  if (!content || typeof content !== "string") {
    return Response.json({ error: "Invalid content" }, { status: 400 });
  }

  await connectDB();

  let expiresAt = null;
  if (ttl_seconds) {
    if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
      return Response.json({ error: "Invalid ttl_seconds" }, { status: 400 });
    }
    expiresAt = new Date(Date.now() + ttl_seconds * 1000);
  }

  if (max_views && (!Number.isInteger(max_views) || max_views < 1)) {
    return Response.json({ error: "Invalid max_views" }, { status: 400 });
  }

  const paste = await Paste.create({
    content,
    expiresAt,
    maxViews: max_views ?? null,
  });

  return Response.json({
    id: paste._id.toString(),
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/p/${paste._id}`,
  });
}
