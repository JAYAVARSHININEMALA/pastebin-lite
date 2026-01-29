import connectDB from "@/lib/db";
import Paste from "@/models/Paste";
import { now } from "@/lib/time";

export async function GET(req, { params }) {
  await connectDB();
  const paste = await Paste.findById(params.id);

  if (!paste) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const currentTime = now(req);

  if (paste.expiresAt && currentTime > paste.expiresAt.getTime()) {
    return Response.json({ error: "Expired" }, { status: 404 });
  }

  if (paste.maxViews !== null && paste.views >= paste.maxViews) {
    return Response.json({ error: "View limit exceeded" }, { status: 404 });
  }

  paste.views += 1;
  await paste.save();

  return Response.json({
    content: paste.content,
    remaining_views:
      paste.maxViews === null ? null : paste.maxViews - paste.views,
    expires_at: paste.expiresAt,
  });
}
