// components/KanbanCard.tsx
export default function KanbanCard({ task }: any) {
  return (
    <div className="group bg-surface border border-border p-3 rounded hover:border-primary/50 transition-all cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start mb-2">
        <span className="text-[10px] font-mono text-slate-500">WD-{task.id}</span>
        <div className="flex items-center gap-1 font-mono text-[10px] bg-white/5 px-1.5 py-0.5 rounded">
          <span className="text-primary">SCORE</span>
          <span className="text-white font-bold">{task.score}</span>
        </div>
      </div>
      
      <h4 className="text-sm font-medium text-slate-200 mb-3 group-hover:text-white">{task.title}</h4>

      <div className="flex items-center justify-between mt-auto">
        <div className="flex -space-x-2">
          <div className="w-5 h-5 rounded-full border border-background bg-slate-700 text-[8px] flex items-center justify-center font-bold">MB</div>
        </div>
        
        <div className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
          <span className="text-critical animate-pulse italic">2d 4h left</span>
        </div>
      </div>
    </div>
  );
}