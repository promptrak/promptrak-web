import { NextRequest, NextResponse } from "next/server";
import { apiFetch } from "@/lib/api/client";

export async function POST(req: NextRequest) {
  const body = await req.json();
  try {
    await apiFetch("/admin/users", {
      method: "POST",
      body: JSON.stringify(body),
    });
    return NextResponse.json({ registered: true });
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number };
    // 409 = already exists — treat as success
    if (e.status === 409) return NextResponse.json({ registered: true });
    return NextResponse.json({ error: e.message ?? "Unknown error" }, { status: e.status ?? 500 });
  }
}
