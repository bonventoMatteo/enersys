// components/Auth.tsx
"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Terminal, Github, Mail } from 'lucide-react';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Envia um link mágico para o email (sem senha, mais seguro)
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert('Check your email for the login link!');
    setLoading(false);
  };

  const loginWithGithub = () => supabase.auth.signInWithOAuth({ provider: 'github' });

  return (
    <div className="h-screen w-full bg-[#0F1115] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#161B22] border border-[#21262D] p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <Terminal size={24} className="text-blue-500" />
          <h1 className="text-xl font-black text-white italic tracking-tighter">WHATDOG_AUTH</h1>
        </div>

        <div className="space-y-4">
          <button onClick={loginWithGithub} className="w-full bg-white text-black py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
            <Github size={16} /> CONTINUE_WITH_GITHUB
          </button>
          
          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#21262D]"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono"><span className="bg-[#161B22] px-2 text-slate-500">Or use email</span></div>
          </div>

          <form onSubmit={handleLogin} className="space-y-3">
            <input 
              type="email" placeholder="user@company.com" 
              className="w-full bg-[#0F1115] border border-[#21262D] rounded-lg px-4 py-2.5 text-xs font-mono outline-none focus:border-blue-500"
              value={email} onChange={(e) => setEmail(e.target.value)}
            />
            <button disabled={loading} className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-black text-xs hover:bg-blue-500 shadow-lg shadow-blue-900/20 disabled:opacity-50">
              {loading ? 'INITIALIZING...' : 'SEND_MAGIC_LINK'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}