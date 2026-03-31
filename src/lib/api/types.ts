// TypeScript mirror of the FastAPI Pydantic models

export type PolicyAction = "allow" | "sanitize" | "minimize" | "local-only" | "block";
export type RiskLevel = "safe" | "sanitize" | "minimize" | "local-only" | "block";
export type ExposureRisk = "low" | "medium" | "high" | "critical";
export type PatternStatus = "promoted" | "candidate" | "retired" | "shadow_rejected";
export type AlertSeverity = "High" | "Medium" | "Low";

// --- Auth ---
export interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in_minutes: number;
}

// --- Gateway ---
export interface DetectionFinding {
  start: number;
  end: number;
  text: string;
  label: string;
  confidence: number;
  sensitivity_tier?: number;
}

export interface GatewayPromptRequest {
  prompt: string;
  user_id: string;
  organization: string;
  context_tags?: string[];
  local_only_context?: boolean;
  task_type?: string;
  detect_only?: boolean;
}

export interface GatewayPromptResponse {
  request_id: string;
  action: PolicyAction;
  risk_level: RiskLevel;
  risk_score: number;
  exposure_risk: ExposureRisk;
  recommended_route: PolicyAction;
  findings: DetectionFinding[];
  sanitized_prompt: string;
  minimized_prompt: string;
  retrieved_context: string[];
  outbound_prompt: string;
  outbound_context: string[];
  model_response: string;
  model_route: string;
  output_blocked: boolean;
  output_findings: string[];
  policy_reasons: string[];
  policy_trace: Record<string, unknown>[];
  policy_version: string;
  tenant_id: string;
  actor_id: string;
  created_at: string;
}

// --- Ops / Metrics ---
export interface MetricsSummary {
  [key: string]: number;
}

export interface MetricsDetails {
  gateway_action: Partial<Record<PolicyAction, number>>;
  [key: string]: unknown;
}

export interface ReadinessResponse {
  status: string;
  gemini: string;
  intent_model?: string;
  router_model?: string;
}

// --- Alerts ---
export interface Alert {
  alert_id: string;
  tenant_id: string;
  severity: AlertSeverity;
  title: string;
  stage?: string;
  created_at: string;
  detail?: string;
}

export interface AlertsResponse {
  alerts: Alert[];
}

// --- FL Patterns ---
export interface FLPattern {
  pattern_id: string;
  pattern: string;
  label: string;
  confidence: number;
  votes: number;
  tenant_count: number;
  status: PatternStatus;
  promoted_at: string | null;
  created_at: string;
}

export interface PatternStats {
  promoted: number;
  candidate: number;
  retired: number;
  shadow_rejected: number;
}

export interface PatternsResponse {
  stats: PatternStats;
  patterns: FLPattern[];
}
