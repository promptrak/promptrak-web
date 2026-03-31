"use client";
import { useState } from "react";

export function useRetirePattern(onSuccess?: (id: string) => void) {
  const [retiring, setRetiring] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function retire(pattern_id: string, reason = "manual admin retirement") {
    setRetiring(pattern_id);
    setError(null);
    try {
      const res = await fetch(`/api/patterns/${pattern_id}/retire`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const d = await res.json() as { error?: string };
        throw new Error(d.error ?? "Retire failed");
      }
      onSuccess?.(pattern_id);
    } catch (e: unknown) {
      setError((e as Error).message);
    } finally {
      setRetiring(null);
    }
  }

  return { retire, retiring, error };
}
