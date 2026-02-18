
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import KanbanBoard from "@/components/kanban/Board";
import ChatWidget from "@/components/chat/ChatWidget";
import UsageStats from "@/components/billing/UsageStats";

export default function Home() {
  const agents = [
    { name: "Maestro", role: "Coordenação", status: "Online", avatar: "MA", color: "bg-blue-500" },
    { name: "Rex", role: "DevOps/Code", status: "Online", avatar: "RE", color: "bg-green-500" },
    { name: "Luna", role: "Admin/Backup", status: "Idle", avatar: "LU", color: "bg-purple-500" },
    { name: "Scout", role: "Pesquisa", status: "Offline", avatar: "SC", color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-50 font-sans selection:bg-blue-500/30">
      
      {/* --- HEADER --- */}
      <header className="border-b border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-white">OpenMauro HQ</h1>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">Sistema Operacional</p>
              </div>
            </div>
            
            {/* Squad Pills (Compacto) */}
            <div className="hidden md:flex items-center gap-2 pl-6 border-l border-white/[0.08]">
              <span className="text-[10px] text-slate-500 font-bold uppercase mr-1">Squad</span>
              {agents.map((agent) => (
                <div key={agent.name} className="flex items-center gap-2 px-2 py-1 rounded-full bg-white/[0.03] border border-white/[0.05] hover:bg-white/[0.08] transition-colors cursor-default group">
                  <div className={`w-1.5 h-1.5 rounded-full ${agent.status === 'Online' ? 'bg-emerald-400' : 'bg-slate-600'}`} />
                  <span className="text-xs text-slate-300 font-medium">{agent.name}</span>
                <div key={agent.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-all cursor-default group shadow-sm">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${agent.status === 'Online' ? 'bg-emerald-400 shadow-emerald-500/50' : 'bg-slate-500 shadow-none'}`} />
                  <span className={`text-xs font-medium ${agent.status === 'Online' ? 'text-white' : 'text-slate-400'}`}>{agent.name}</span>
                </div>
              ))}
            </div>
