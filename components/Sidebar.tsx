// components/Sidebar.tsx
import { LayoutDashboard, CheckSquare, Briefcase, BarChart3, Settings, Search } from "lucide-react";

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: CheckSquare, label: "Tasks" },
  { icon: Briefcase, label: "Cases" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Settings, label: "Settings" },
];

const SAVED_VIEWS = [
  { query: "due < 3d", label: "Critical Deadlines", color: "text-critical" },
  { query: "assigned:me", label: "My Stack", color: "text-primary" },
  { query: "priority > 80", label: "High Impact", color: "text-warning" },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-surface flex flex-col">
      <div className="p-4 font-bold text-white tracking-tighter flex items-center gap-2">
        <div className="w-3 h-3 bg-primary rounded-sm" />
        WHATDOG <span className="text-[10px] text-slate-500 font-mono">v1.0.4</span>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {NAV_ITEMS.map((item) => (
          <div key={item.label} className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-white/5 cursor-pointer transition-colors">
            <item.icon size={18} />
            {item.label}
          </div>
        ))}

        <div className="mt-8 pt-4 border-t border-border">
          <p className="text-[10px] font-bold text-slate-500 px-3 mb-2 uppercase tracking-widest">Saved Views</p>
          {SAVED_VIEWS.map((view) => (
            <div key={view.label} className="group flex items-center justify-between px-3 py-1.5 text-xs rounded-md hover:bg-white/5 cursor-pointer">
              <span className="flex items-center gap-2 italic text-slate-400 font-mono">
                {view.label}
              </span>
              <span className={`text-[9px] opacity-0 group-hover:opacity-100 font-mono ${view.color}`}>
                {view.query}
              </span>
            </div>
          ))}
        </div>
      </nav>
    </aside>
  );
}