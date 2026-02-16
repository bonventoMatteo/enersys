import { Github, Terminal } from "lucide-react";

// components/AuthGate.tsx
export function LoginScreen({ onLogin }: any) {
  return (
    <div className="h-screen w-full bg-[#0F1115] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#161B22] border border-[#21262D] p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Terminal size={18} className="text-white" />
          </div>
          <h1 className="text-xl font-black text-white italic tracking-tighter">WHATDOG_LOGIN</h1>
        </div>
        
        <div className="space-y-4">
          <button className="w-full bg-white text-black py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-200 transition-all">
             <Github size={16} /> SIGN_IN_WITH_GITHUB
          </button>
          <div className="flex items-center gap-2 py-2">
            <div className="h-px bg-[#21262D] flex-1" />
            <span className="text-[10px] font-mono text-slate-600 uppercase">System_Auth</span>
            <div className="h-px bg-[#21262D] flex-1" />
          </div>
          <input placeholder="access_token" className="w-full bg-[#0F1115] border border-[#21262D] rounded-lg px-4 py-2.5 text-xs font-mono outline-none focus:border-blue-500" />
          <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-black text-xs hover:bg-blue-500 shadow-lg shadow-blue-900/20">
            INITIALIZE_SESSION
          </button>
        </div>
      </div>
    </div>
  );
}