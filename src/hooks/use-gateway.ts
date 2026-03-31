"use client";
import { useState } from "react";
import type { GatewayPromptResponse } from "@/lib/api/types";

export function useGateway() {
  const [result, setResult] = useState<GatewayPromptResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(prompt: string, organization = "org_a", user_id = "web-ui-user") {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/gateway", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, organization, user_id }),
      });
      const data = await res.json() as GatewayPromptResponse & { error?: string };
      if (!res.ok) throw new Error(data.error ?? res.statusText);
      setResult(data);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("lastGatewayResult", JSON.stringify(data));
      }
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return { result, loading, error, submit };
}
