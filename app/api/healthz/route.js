import connectDB from "@/lib/db";

export async function GET() {
  try {
    await connectDB();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
