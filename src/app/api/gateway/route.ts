import { NextRequest, NextResponse } from "next/server";
import { processPrompt } from "@/lib/api/gateway";
import type { GatewayPromptRequest } from "@/lib/api/types";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as GatewayPromptRequest;
  try {
    const result = await processPrompt(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const e = err as { message?: string; status?: number };
    return NextResponse.json({ error: e.message ?? "Unknown error" }, { status: e.status ?? 500 });
  }
}
