import { NextRequest, NextResponse } from "next/server";
import { retirePattern } from "@/lib/api/patterns";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { reason } = (await req.json()) as { reason?: string };
  try {
    const result = await retirePattern(params.id, reason ?? "manual admin retirement");
    return NextResponse.json(result);
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number };
    return NextResponse.json({ error: e.message ?? "Unknown error" }, { status: e.status ?? 500 });
  }
}
