"use client";
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, Terminal, Zap } from 'lucide-react';
import { useUIStore } from '@/store/use-ui-store';

export default function CommandPalette() {
  const { isCommandPaletteOpen, toggleCommandPalette } = useUIStore();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleCommandPalette();
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={toggleCommandPalette}
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
            className="w-full max-w-2xl bg-[#161B22] border border-[#30363D] rounded-xl shadow-2xl overflow-hidden relative z-10"
          >
            <div className="flex items-center px-4 py-4 border-b border-[#30363D]">
              <Search className="w-5 h-5 text-slate-500 mr-3" />
              <input 
                autoFocus
                placeholder="Search tasks, cases or run commands..." 
                className="bg-transparent border-none outline-none text-lg w-full text-slate-200"
              />
              <kbd className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-mono">ESC</kbd>
            </div>
            <div className="p-2">
              <CommandItem icon={<Plus />} label="Create new task" shortcut="N" />
              <CommandItem icon={<Zap />} label="Run automation rule" shortcut="R" />
              <CommandItem icon={<Terminal />} label="Open raw cases" shortcut="G C" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function CommandItem({ icon, label, shortcut }: any) {
  return (
    <div className="flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-primary/10 hover:text-primary cursor-pointer transition-all group">
      <div className="flex items-center gap-3">
        <span className="text-slate-500 group-hover:text-primary">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">{shortcut}</span>
    </div>
  );
}