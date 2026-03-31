"use client";

import { useEffect, useState, FormEvent } from "react";
import { useConsoleAuth } from "@/lib/console-auth";
import { Network, RefreshCw, Plus } from "lucide-react";
import type { FLPattern, PatternsResponse } from "@/lib/api/types";

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "promoted"        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
    status === "candidate"       ? "bg-teal-500/10 text-teal-400 border-teal-500/20" :
    status === "retired"         ? "bg-zinc-700 text-zinc-500 border-zinc-600" :
    status === "shadow_rejected" ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                   "bg-zinc-800 text-zinc-400 border-zinc-700";
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${styles}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function PatternsPage() {
  const { authFetch } = useConsoleAuth();
  const [data, setData]     = useState<PatternsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  // New pattern form
  const [pattern, setPattern]   = useState("");
  const [label, setLabel]       = useState("");
  const [confidence, setConf]   = useState("0.9");
  const [addLoading, setAddLoading] = useState(false);
  const [addSuccess, setAddSuccess] = useState(false);
  const [addError, setAddError]     = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const d = await authFetch<PatternsResponse>("/admin/fl-patterns");
      setData(d);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleAdd(e: FormEvent) {
    e.preventDefault();
    setAddLoading(true);
    setAddError(null);
    setAddSuccess(false);
    try {
      await authFetch("/admin/fl-patterns", {
        method: "POST",
        body: JSON.stringify({ pattern, label, confidence: parseFloat(confidence) }),
      });
      setAddSuccess(true);
      setPattern("");
      setLabel("");
      setConf("0.9");
      setAdding(false);
      await load();
    } catch (e) {
      setAddError((e as Error).message);
    } finally {
      setAddLoading(false);
    }
  }

  const stats = data?.stats;
  const patterns = data?.patterns ?? [];

  const inputCls = "w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/30 transition-colors";

  return (
    <div className="flex-1 overflow-y-auto">
      <header className="h-14 border-b border-zinc-800 bg-zinc-900 flex items-center justify-between px-6 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-zinc-500" />
          <h1 className="text-base font-semibold text-zinc-100">FL Patterns</h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAdding((v) => !v)}
            className="flex items-center gap-2 rounded-md border border-teal-700 bg-teal-600/20 px-3 py-1.5 text-xs text-teal-400 hover:bg-teal-600/30 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> Add Pattern
          </button>
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-xs text-zinc-300 hover:bg-zinc-700 disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </header>

      <main className="p-6 max-w-screen-xl mx-auto space-y-5">
        {error && (
          <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">{error}</div>
        )}

        {/* Stats row */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Promoted",        value: stats.promoted,        color: "text-emerald-400" },
              { label: "Candidate",       value: stats.candidate,       color: "text-teal-400" },
              { label: "Shadow Rejected", value: stats.shadow_rejected, color: "text-red-400" },
              { label: "Retired",         value: stats.retired,         color: "text-zinc-500" },
            ].map(({ label, value, color }) => (
              <div key={label} className="rounded-lg border border-zinc-800 bg-zinc-900 p-4 hover:border-zinc-700 transition-colors">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
                <p className={`text-3xl font-bold tabular-nums ${color}`}>{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Add pattern form */}
        {adding && (
          <div className="rounded-lg border border-zinc-700 bg-zinc-900 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-100">Add New Pattern</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Hot-patched live — no restart required.</p>
            </div>
            <form onSubmit={handleAdd} className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Regex Pattern</label>
                  <input className={inputCls} value={pattern} onChange={(e) => setPattern(e.target.value)} placeholder="\\bMRN-\d{4,8}\\b" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Label</label>
                  <input className={inputCls} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="INTERNAL_ID" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Confidence (0–1)</label>
                  <input type="number" min="0" max="1" step="0.01" className={inputCls} value={confidence} onChange={(e) => setConf(e.target.value)} required />
                </div>
                <div className="md:col-span-3 flex items-center gap-3">
                  {addSuccess && <span className="text-xs text-emerald-400">Pattern added successfully.</span>}
                  {addError && <span className="text-xs text-red-400">{addError}</span>}
                  <button
                    type="submit"
                    disabled={addLoading}
                    className="ml-auto rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-500 disabled:opacity-40 transition-colors"
                  >
                    {addLoading ? "Adding..." : "Add Pattern"}
                  </button>
                  <button type="button" onClick={() => setAdding(false)} className="text-sm text-zinc-500 hover:text-zinc-300">Cancel</button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Patterns table */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 overflow-hidden">
          <div className="px-5 py-3 border-b border-zinc-800 flex items-center justify-between">
            <h3 className="text-sm font-medium text-zinc-100">All Patterns</h3>
            <span className="text-xs text-zinc-500 tabular-nums">{patterns.length} total</span>
          </div>
          {loading ? (
            <div className="p-8 text-center text-sm text-zinc-600">Loading patterns...</div>
          ) : patterns.length === 0 ? (
            <div className="p-8 text-center text-sm text-zinc-600">No patterns yet.</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Pattern</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Label</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Status</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Confidence</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Votes</th>
                  <th className="px-5 py-2.5 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-500">Tenants</th>
                </tr>
              </thead>
              <tbody>
                {patterns.map((p: FLPattern) => (
                  <tr key={p.pattern_id} className="border-b border-zinc-800/50 hover:bg-zinc-800/40 transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-zinc-300 max-w-xs truncate">{p.pattern}</td>
                    <td className="px-5 py-3 text-xs font-mono text-teal-400">{p.label}</td>
                    <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-5 py-3 text-xs tabular-nums text-zinc-400">{(p.confidence * 100).toFixed(0)}%</td>
                    <td className="px-5 py-3 text-xs tabular-nums text-zinc-400">{p.votes}</td>
                    <td className="px-5 py-3 text-xs tabular-nums text-zinc-400">{p.tenant_count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
}
