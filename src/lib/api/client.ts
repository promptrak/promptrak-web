// Server-side only API client — never imported by "use client" components
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// Token cache (module-level, server process lifetime)
let cachedToken: string | null = null;
let tokenExpiry = 0;

async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const res = await fetch(`${API_BASE}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: process.env.PROMPTRAK_API_KEY ?? "admin-org-a" }),
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Auth failed (${res.status}): ${text}`);
  }

  const data = await res.json();
  cachedToken = data.access_token as string;
  tokenExpiry = Date.now() + (data.expires_in_minutes - 2) * 60 * 1000;
  return cachedToken;
}

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const detail = await res.json().catch(() => ({})) as { detail?: string };
    const err = new Error(detail?.detail ?? res.statusText) as Error & { status: number };
    err.status = res.status;
    throw err;
  }

  return res.json() as Promise<T>;
}
