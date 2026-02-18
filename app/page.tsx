
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
                <div key={agent.name} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.05] border border-white/[0.1] hover:bg-white/[0.1] transition-all cursor-default group shadow-sm">
                  <div className={`w-2 h-2 rounded-full shadow-[0_0_8px] ${agent.status === 'Online' ? 'bg-emerald-400 shadow-emerald-500/50' : 'bg-slate-500 shadow-none'}`} />
                  <span className={`text-xs font-medium ${agent.status === 'Online' ? 'text-white' : 'text-slate-400'}`}>{agent.name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" className="border-white/[0.1] bg-transparent text-slate-300 hover:bg-white/[0.05] hover:text-white text-xs h-8">
              Documentação
            </Button>
            <Button size="sm" className="bg-blue-600 hover:bg-blue-500 text-white text-xs h-8 shadow-[0_0_15px_rgba(37,99,235,0.3)] border border-blue-500/50">
              + Nova Missão
            </Button>
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        
        {/* ESQUERDA: Métricas + Kanban (Ocupa 8 ou 9 colunas) */}
        <div className="col-span-12 lg:col-span-9 space-y-6">
          
          {/* Seção de Métricas (Usage & Costs) */}
          <section className="bg-[#111116] border border-white/[0.06] rounded-xl p-1 shadow-sm overflow-hidden">
             <div className="px-4 py-3 border-b border-white/[0.04] flex justify-between items-center bg-[#15151a]">
               <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                 <span className="text-blue-500">◆</span> Performance & Custos
               </h2>
               <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] h-5 px-2">February 2026</Badge>
             </div>
             <div className="p-4 h-[320px]">
               <UsageStats />
             </div>
          </section>

          {/* Seção Kanban */}
          <section className="flex flex-col min-h-[500px]">
            <div className="flex justify-between items-center mb-4 px-1">
               <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                 <span className="w-1 h-4 bg-emerald-500 rounded-full"></span>
                 Missões & Tarefas
               </h2>
               <div className="text-[10px] text-slate-500 bg-white/[0.03] px-3 py-1 rounded-full border border-white/[0.05]">
                 Drag & Drop Ativo
               </div>
            </div>
            
            {/* Área do Kanban */}
            <div className="flex-1 bg-[#111116]/50 border border-dashed border-white/[0.06] rounded-xl p-4">
              <KanbanBoard />
            </div>
          </section>

        </div>

        {/* DIREITA: Chat Fixo (Ocupa 3 ou 4 colunas) */}
        <div className="col-span-12 lg:col-span-3 flex flex-col h-[calc(100vh-140px)] sticky top-24">
          <ChatWidget />
        </div>

      </main>
    </div>
  );
}
