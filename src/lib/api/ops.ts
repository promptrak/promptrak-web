import { apiFetch } from "./client";
import type { AlertsResponse, MetricsDetails, MetricsSummary, ReadinessResponse } from "./types";

export const getHealth    = () => apiFetch<{ status: string }>("/health");
export const getReadiness = () => apiFetch<ReadinessResponse>("/ready");
export const getMetrics   = () => apiFetch<MetricsSummary>("/metrics");
export const getMetricsDetails = () => apiFetch<MetricsDetails>("/metrics/details");
export const getAlerts    = () => apiFetch<AlertsResponse>("/alerts");
