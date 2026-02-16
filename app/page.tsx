"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, CheckSquare, BarChart3, Search, Zap, 
  LayoutGrid, Table as TableIcon, Clock, ChevronRight, Activity, 
  X, Terminal, Cpu, Plus, Trash2, Edit3, AlertCircle, TrendingUp, 
  LogOut, Mail, Lock, CheckCircle2, ShieldCheck, Filter, ArrowUpRight
} from 'lucide-react';

// --- SUPABASE SETUP ---
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// --- TYPES ---
type View = 'dashboard' | 'tasks' | 'analytics';
type Status = 'todo' | 'in-progress' | 'review' | 'done';
interface Task {
  id: string; title: string; score: number; due: string;
  status: Status; assigned: string; case_group: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string; created_at?: string;
}

export default function WhatdogEnterprise() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (loading) return (
    <div className="h-screen bg-[#09090b] flex items-center justify-center font-sans">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="w-12 h-12 border-2 border-blue-500/20 rounded-full border-t-blue-500 animate-spin" />
          <Terminal size={18} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-blue-500" />
        </div>
        <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 font-medium">Initializing Secure Environment</span>
      </div>
    </div>
  );

  return !session ? <AuthScreen /> : <MainPlatform session={session} />;
}

// --- TELA DE AUTENTICAÇÃO (CLEAN ENTERPRISE) ---
function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ 
        email, password, options: { emailRedirectTo: window.location.origin } 
      });
      if (error) setMsg({ type: 'error', text: error.message });
      else if (data.user && !data.session) setMsg({ type: 'success', text: 'VERIFICATION_SENT: Confirme seu email.' });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg({ type: 'error', text: error.message });
    }
    setLoading(false);
  };

  return (
    <div className="h-screen w-full bg-[#09090b] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900/10 via-transparent to-transparent">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-12 justify-center">
          <div className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
            <ShieldCheck size={20} className="text-blue-500" />
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight">Whatdog <span className="text-zinc-600 font-normal">OS</span></h1>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400 ml-1">Work Email</label>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-700" placeholder="name@company.com" />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-zinc-400 ml-1">Password</label>
            <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-zinc-900/50 border border-zinc-800 rounded-lg px-4 py-3 text-sm text-white focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-zinc-700" placeholder="••••••••" />
          </div>

          {msg.text && <p className={`text-[11px] text-center ${msg.type === 'error' ? 'text-red-400' : 'text-green-400'}`}>{msg.text}</p>}

          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-blue-500/10">
            {loading ? 'Authenticating...' : isSignUp ? 'Create Workspace' : 'Sign In'}
          </button>

          <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="w-full text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors pt-2">
            {isSignUp ? 'Already have an account? Sign in' : 'New to Whatdog? Create an account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

// --- MAIN PLATFORM ---
function MainPlatform({ session }: { session: any }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [currentView, setCurrentView] = useState<View>('tasks');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [latency, setLatency] = useState(24);

  useEffect(() => {
    const fetchTasks = async () => {
      const { data } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });
      if (data) setTasks(data);
    };
    fetchTasks();

    const channel = supabase.channel('enterprise-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          setTasks(prev => prev.some(t => t.id === payload.new.id) ? prev : [payload.new as Task, ...prev]);
        }
        if (payload.eventType === 'UPDATE') setTasks(prev => prev.map(t => t.id === payload.new.id ? payload.new as Task : t));
        if (payload.eventType === 'DELETE') setTasks(prev => prev.filter(t => t.id !== payload.old.id));
      })
      .subscribe();

    const timer = setInterval(() => setLatency(Math.floor(Math.random() * 10) + 12), 5000);
    return () => { supabase.removeChannel(channel); clearInterval(timer); };
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: Status) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
    await supabase.from('tasks').update({ status: newStatus }).eq('id', id);
  };

  const handleCreateTask = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const newTask: Task = {
      id: `WD-${Math.floor(1000 + Math.random() * 9000)}`,
      title: fd.get('title') as string,
      score: Number(fd.get('score')),
      due: fd.get('due') as string,
      status: 'todo',
      priority: fd.get('priority') as any,
      case_group: fd.get('case') as string,
      description: fd.get('description') as string,
      assigned: session.user.email,
      created_at: new Date().toISOString()
    };
    setTasks(prev => [newTask, ...prev]);
    setIsAddingTask(false);
    const { error } = await supabase.from('tasks').insert([newTask]);
    if (error) setTasks(prev => prev.filter(t => t.id !== newTask.id));
  };

  const stats = useMemo(() => ({
    critical: tasks.filter(t => t.priority === 'critical').length,
    avgScore: tasks.length ? Math.round(tasks.reduce((a, b) => a + b.score, 0) / tasks.length) : 0,
    total: tasks.length
  }), [tasks]);

  const filtered = tasks.filter(t => t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.id.includes(searchQuery));

  return (
    <div className="flex h-screen w-full bg-[#09090b] text-zinc-300 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside className="w-64 border-r border-zinc-800 bg-[#09090b] hidden lg:flex flex-col z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="w-7 h-7 bg-blue-600 rounded flex items-center justify-center">
            <Terminal size={14} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white tracking-tight">Whatdog <span className="text-zinc-500 font-normal italic">Enterprise</span></span>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          <NavItem active={currentView === 'dashboard'} icon={LayoutDashboard} label="Dashboard" onClick={() => setCurrentView('dashboard')} />
          <NavItem active={currentView === 'tasks'} icon={CheckSquare} label="Task Board" onClick={() => setCurrentView('tasks')} />
          <NavItem active={currentView === 'analytics'} icon={BarChart3} label="Analytics" onClick={() => setCurrentView('analytics')} />
        </nav>

        <div className="p-4 border-t border-zinc-800">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-900/50 border border-zinc-800/50">
            <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center text-xs font-bold border border-blue-500/20">
              {session.user.email[0].toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-semibold text-zinc-200 truncate">{session.user.email.split('@')[0]}</p>
              <button onClick={() => supabase.auth.signOut()} className="text-[9px] text-zinc-500 hover:text-red-400 flex items-center gap-1 mt-0.5">
                <LogOut size={10} /> Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-zinc-800 bg-[#09090b]/80 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-medium text-zinc-500">{currentView.toUpperCase()}</span>
            <ChevronRight size={14} className="text-zinc-700" />
            <div className="flex items-center gap-2 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-mono text-zinc-400">{latency}ms latency</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500" size={14} />
              <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search tasks..." className="bg-zinc-900/50 border border-zinc-800 rounded-md pl-9 pr-4 py-1.5 text-xs focus:ring-1 focus:ring-blue-500/50 outline-none w-48 lg:w-64 transition-all" />
            </div>
            <button onClick={() => setIsAddingTask(true)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition-all">
              <Plus size={14} /> New Task
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-hidden p-6">
          <AnimatePresence mode="wait">
            
            {currentView === 'tasks' ? (
              <motion.div key="tasks" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex bg-zinc-900 border border-zinc-800 p-1 rounded-md">
                    <button onClick={() => setViewMode('kanban')} className={`px-4 py-1 text-[10px] font-semibold rounded ${viewMode === 'kanban' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>KANBAN</button>
                    <button onClick={() => setViewMode('table')} className={`px-4 py-1 text-[10px] font-semibold rounded ${viewMode === 'table' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}>TABLE</button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
                    <Filter size={12} /> Filter by Priority
                  </div>
                </div>

                <div className="flex-1 overflow-hidden">
                  {viewMode === 'kanban' ? (
                    <div className="h-full flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                      {(['todo', 'in-progress', 'review', 'done'] as Status[]).map(status => (
                        <div key={status} onDragOver={e => e.preventDefault()} onDrop={e => handleUpdateStatus(e.dataTransfer.getData("taskId"), status)} className="min-w-[280px] lg:min-w-[320px] flex flex-col bg-zinc-900/30 rounded-lg border border-zinc-800/50">
                          <div className="p-3 flex justify-between items-center text-[10px] font-bold text-zinc-600 uppercase tracking-wider border-b border-zinc-800/50">
                            {status.replace('-', ' ')} <span className="bg-zinc-900 px-1.5 py-0.5 rounded">{tasks.filter(t => t.status === status).length}</span>
                          </div>
                          <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                            {filtered.filter(t => t.status === status).map(t => (
                              <TaskCard key={t.id} task={t} onClick={() => setSelectedTask(t)} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full border border-zinc-800 bg-zinc-900/30 rounded-lg overflow-auto custom-scrollbar">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-zinc-900/80 sticky top-0 text-[10px] font-bold text-zinc-500 uppercase tracking-widest z-10">
                            <tr className="border-b border-zinc-800">
                              <th className="px-6 py-4 font-bold">Task ID</th>
                              <th className="px-6 py-4 font-bold">Description</th>
                              <th className="px-6 py-4 font-bold">Priority</th>
                              <th className="px-6 py-4 font-bold text-right">Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filtered.map(t => (
                              <tr key={t.id} onClick={() => setSelectedTask(t)} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer transition-colors group">
                                <td className="px-6 py-4 text-[10px] font-mono text-zinc-500">{t.id}</td>
                                <td className="px-6 py-4 text-xs font-semibold text-zinc-200">{t.title}</td>
                                <td className="px-6 py-4"><PriorityBadge priority={t.priority} /></td>
                                <td className="px-6 py-4 text-right font-mono text-blue-400 text-xs font-bold">{t.score}</td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div key="dash" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <DashCard label="Tasks Under Management" value={stats.total} icon={CheckSquare} sub="Active instances" />
                <DashCard label="High Risk Detection" value={stats.critical} icon={AlertCircle} color="text-red-500" sub="Requires attention" />
                <DashCard label="Network Productivity" value={`${stats.avgScore}%`} icon={TrendingUp} color="text-green-500" sub="Efficiency index" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* DETAIL PANEL (DRAWER) */}
      <AnimatePresence>
        {selectedTask && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTask(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" />
            <motion.aside initial={{ x: 500 }} animate={{ x: 0 }} exit={{ x: 500 }} transition={{ type: 'spring', damping: 28, stiffness: 200 }} className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-zinc-950 border-l border-zinc-800 z-[110] flex flex-col shadow-2xl">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-900/50">
                <div className="flex items-center gap-2">
                  <div className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] font-mono text-zinc-500">{selectedTask.id}</div>
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Metadata View</span>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-1 hover:bg-zinc-800 rounded-md text-zinc-500 transition-all"><X size={16}/></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                <PriorityBadge priority={selectedTask.priority} />
                <h1 className="text-2xl font-bold text-white mt-4 tracking-tight leading-snug">{selectedTask.title}</h1>
                <p className="text-zinc-400 mt-4 text-sm leading-relaxed font-medium">{selectedTask.description || "No specific documentation provided for this unit."}</p>
                
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Impact Score</p>
                    <p className="text-2xl font-bold text-blue-500 font-mono">{selectedTask.score}</p>
                  </div>
                  <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase mb-1">Due Estimation</p>
                    <p className="text-2xl font-bold text-red-500 font-mono">{selectedTask.due}</p>
                  </div>
                </div>

                <div className="mt-12 space-y-4">
                  <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest italic border-b border-zinc-800 pb-2">Technical Manifest</h3>
                  <pre className="p-4 bg-zinc-900/50 rounded-lg text-[11px] font-mono text-blue-300 border border-zinc-800 overflow-x-auto">
                    {JSON.stringify(selectedTask, null, 2)}
                  </pre>
                </div>
              </div>

              <div className="p-6 border-t border-zinc-800 bg-zinc-900/20 grid grid-cols-2 gap-4">
                <button onClick={() => {
                  if(confirm("Permanently purge this instance?")) {
                    supabase.from('tasks').delete().eq('id', selectedTask.id).then(() => {
                      setTasks(prev => prev.filter(t => t.id !== selectedTask.id));
                      setSelectedTask(null);
                    });
                  }
                }} className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 py-2.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider">Purge</button>
                <button className="bg-zinc-100 hover:bg-white text-zinc-950 py-2.5 rounded-md text-xs font-bold transition-all uppercase tracking-wider">Update Status</button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* CREATE MODAL */}
      <AnimatePresence>
        {isAddingTask && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.form initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} onSubmit={handleCreateTask} className="bg-zinc-950 border border-zinc-800 w-full max-w-xl rounded-xl p-10 space-y-8 shadow-2xl">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
                <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-3">
                  <Plus size={20} className="text-blue-500" />
                  Initialize Task Instance
                </h2>
                <button type="button" onClick={() => setIsAddingTask(false)} className="text-zinc-600 hover:text-zinc-300"><X size={20}/></button>
              </div>

              <div className="space-y-5">
                <FormInput name="title" label="Task Title" placeholder="e.g. Optimize API Latency" required />
                <div className="grid grid-cols-2 gap-6">
                   <FormInput name="score" label="Impact Score (0-100)" type="number" placeholder="90" required />
                   <FormInput name="due" label="Estimated Interval" placeholder="2h 15m" required />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Threat Level</label>
                    <select name="priority" className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white outline-none focus:border-blue-500 appearance-none font-bold">
                      <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
                    </select>
                  </div>
                  <FormInput name="case" label="Identifier / Project" placeholder="SYS_CORE" required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1">Documentation</label>
                  <textarea name="description" placeholder="Technical breakdown..." className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-4 text-xs text-white h-32 focus:border-blue-500 outline-none resize-none font-medium" />
                </div>
              </div>

              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-lg font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10">Deploy to Environment</button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #18181b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #27272a; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}

// --- ENTERPRISE HELPERS ---

function NavItem({ icon: Icon, label, active, onClick }: any) {
  return (
    <div onClick={onClick} className={`flex items-center gap-4 px-4 py-3 text-xs font-semibold rounded-md transition-all cursor-pointer ${active ? 'bg-zinc-900 text-white border border-zinc-800' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/50'}`}>
      <Icon size={16} className={active ? 'text-blue-500' : 'text-zinc-600'} /> {label}
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: any = {
    low: 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20',
    medium: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    critical: 'bg-red-500/10 text-red-500 border-red-500/20'
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase border ${colors[priority]}`}>
      {priority}
    </span>
  );
}

function DashCard({ label, value, icon: Icon, sub, color = "text-blue-500" }: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 p-8 rounded-lg hover:border-zinc-700 transition-all group relative overflow-hidden">
      <div className={`p-2 rounded bg-zinc-900 w-fit mb-6 ${color}`}><Icon size={18}/></div>
      <p className="text-4xl font-bold text-white mb-1 tracking-tight">{value}</p>
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{label}</p>
      <div className="mt-4 flex items-center gap-1 text-[9px] text-zinc-600">
        <ArrowUpRight size={10} /> {sub}
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }: any) {
  return (
    <motion.div 
      draggable 
      // Utilizamos onDragStartCapture para ignorar o conflito com a API de gestos do Framer Motion
      onDragStartCapture={(e: React.DragEvent<HTMLDivElement>) => {
        e.dataTransfer.setData("taskId", task.id);
      }}
      onClick={onClick} 
      layoutId={task.id} 
      className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg hover:border-zinc-600 transition-all cursor-grab active:cursor-grabbing group shadow-md relative overflow-hidden"
    >
      {task.priority === 'critical' && (
        <div className="absolute left-0 top-0 h-full w-1 bg-red-500 shadow-[4px_0_20px_rgba(239,68,68,0.5)]" />
      )}
      
      <div className="flex justify-between items-start mb-4">
        <span className="text-[9px] font-mono text-zinc-600 group-hover:text-blue-500 transition-colors uppercase font-bold tracking-tighter">
          {task.id}
        </span>
        <span className="text-[10px] font-mono font-black text-blue-400 bg-blue-500/10 border border-blue-500/20 px-4 py-1 rounded-full uppercase italic shadow-inner">
          {task.score} SC
        </span>
      </div>

      <h4 className="text-xl font-black text-slate-200 leading-[1.1] group-hover:text-white mb-8 uppercase tracking-tighter italic">
        {task.title}
      </h4>

      <div className="flex justify-between items-center text-[10px] font-mono text-slate-700 border-t border-white/5 pt-6 uppercase tracking-widest">
        <PriorityBadge priority={task.priority} />
        <span className="text-red-500 font-black italic shadow-red-500/30 drop-shadow-md">
          {task.due} LEFT
        </span>
      </div>
    </motion.div>
  );
}

function FormInput({ label, ...props }: any) {
  return (
    <div className="space-y-2">
      <label className="text-[10px] font-bold text-zinc-500 uppercase ml-1 tracking-wider">{label}</label>
      <input className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-2.5 text-xs text-white focus:border-blue-500 outline-none transition-all placeholder:text-zinc-700 font-medium" {...props} />
    </div>
  );
}