function DashboardView() {
  return (
    <div className="grid grid-cols-4 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <StatCard title="Critical Tasks" value="12" sub="Score > 85" color="text-critical" />
      <StatCard title="Avg Completion" value="1.4d" sub="-12% vs last week" color="text-primary" />
      <StatCard title="Active Cases" value="442" sub="Across 8 regions" color="text-white" />
      <StatCard title="System Risk" value="Low" sub="99.9% health" color="text-green-500" />
      
      <div className="col-span-3 bg-[#161B22] border border-[#21262D] rounded-lg p-6">
        <h3 className="text-xs font-mono text-slate-500 uppercase mb-4 tracking-widest">Recent Activity Stream</h3>
        <div className="space-y-4">
          {/* Listagem densa de eventos */}
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
               <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="text-xs font-mono text-slate-500">22:04:11</span>
                  <span className="text-sm font-medium text-slate-200 uppercase tracking-tighter">Case #882 updated by System Daemon</span>
               </div>
               <span className="text-[10px] font-mono bg-white/5 px-2 py-0.5 rounded text-slate-400">LATENCY: 12ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, sub, color }: any) {
  return (
    <div className="bg-[#161B22] border border-[#21262D] p-5 rounded-lg">
      <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mb-3">{title}</p>
      <div className={`text-3xl font-bold tracking-tighter ${color}`}>{value}</div>
      <p className="text-[10px] text-slate-600 font-mono mt-1 italic">{sub}</p>
    </div>
  );
}