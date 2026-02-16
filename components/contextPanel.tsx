// components/ContextPanel.tsx
"use client";
import { useState } from "react";

export default function ContextPanel() {
  const [activeTab, setActiveTab] = useState<'overview' | 'json'>('overview');

  return (
    <aside className="w-96 bg-surface border-l border-border flex flex-col">
      <div className="flex border-b border-border">
        {['Overview', 'Activity', 'History', 'JSON'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase() as any)}
            className={`flex-1 px-4 py-3 text-[10px] font-bold uppercase tracking-tighter border-b-2 transition-colors ${
              activeTab === tab.toLowerCase() ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {activeTab === 'json' ? (
          <pre className="text-[11px] font-mono text-blue-400 bg-black/30 p-4 rounded-lg overflow-x-auto leading-relaxed border border-white/5">
            {JSON.stringify({
              id: "TSK-8821",
              title: "Refactor Auth Middleware",
              score: 92,
              status: "in_progress",
              assigned: "m_bonvento",
              metadata: {
                latency: "12ms",
                voters: ["alice", "bob"],
                priority: "critical"
              }
            }, null, 2)}
          </pre>
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="text-xs font-mono text-slate-500 mb-2">/ description</h3>
              <p className="text-sm leading-relaxed">Implement edge runtime compatibility for the authentication layer.</p>
            </div>
            {/* Outros campos de Overview */}
          </div>
        )}
      </div>
    </aside>
  );
}