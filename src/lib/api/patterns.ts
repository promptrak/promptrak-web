import { apiFetch } from "./client";
import type { PatternStats, PatternsResponse } from "./types";

export const listPatterns = (status_filter?: string) =>
  apiFetch<PatternsResponse>(
    `/admin/fl-patterns${status_filter ? `?status_filter=${status_filter}` : ""}`
  );

export const getPatternStats = () =>
  apiFetch<PatternStats>("/admin/fl-patterns/stats");

export const retirePattern = (pattern_id: string, reason: string) =>
  apiFetch<{ retired: boolean; pattern_id: string; reason: string }>(
    `/admin/fl-patterns/${pattern_id}/retire`,
    { method: "POST", body: JSON.stringify({ reason }) }
  );
