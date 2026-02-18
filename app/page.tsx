
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import KanbanBoard from "@/components/kanban/Board";
import ChatWidget from "@/components/chat/ChatWidget";
import UsageStats from "@/components/billing/UsageStats"; // Importando UsageStats

export default function Home() {
  const agents = [
    { name: "Maestro", role: "Coordenação", status: "Online", avatar: "MA", color: "bg-blue-500" },
    { name: "Rex", role: "DevOps/Code", status: "Online", avatar: "RE", color: "bg-green-500" },
    { name: "Luna", role: "Admin/Backup", status: "Idle", avatar: "LU", color: "bg-purple-500" },
    { name: "Scout", role: "Pesquisa", status: "Offline", avatar: "SC", color: "bg-gray-500" },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 p-8 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Centro de Comando</h1>
          <p className="text-slate-400">OpenMauro HQ • Sistema Operacional</p>
        </div>
        <div className="flex gap-4">
          <Badge variant="outline" className="text-green-400 border-green-900 bg-green-950/30 px-3 py-1">
            Sistema Online
          </Badge>
          <Button variant="secondary" size="sm">
            Nova Missão
          </Button>
        </div>
      </header>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 min-h-[calc(100vh-200px)]">
        
        {/* Coluna 1: Status dos Agentes */}
        <div className="md:col-span-1 space-y-4 flex flex-col">
          <h2 className="text-lg font-semibold text-slate-300 mb-2">Squad Ativo</h2>
          <div className="space-y-2">
            {agents.map((agent) => (
              <Card key={agent.name} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardContent className="flex items-center gap-4 p-3">
                  <Avatar className="h-8 w-8 border-2 border-slate-700">
                    <AvatarFallback className={`${agent.color} text-white text-xs font-bold`}>{agent.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{agent.name}</p>
                    <div className="flex items-center gap-2">
                      <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "Online" ? "bg-green-500 animate-pulse" : agent.status === "Idle" ? "bg-yellow-500" : "bg-gray-500"}`}></span>
                      <span className="text-[10px] text-slate-400 uppercase tracking-wide">{agent.role}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Widget de Chat */}
          <div className="flex-1 mt-4">
            <ChatWidget />
          </div>
        </div>

        {/* Coluna 2, 3 e 4: Kanban e Estatísticas (Tabulados) */}
        <div className="md:col-span-3 space-y-6 flex flex-col">
          
          {/* Seção 1: Billing / Custos (Novo!) */}
          <div className="h-[350px]">
             <div className="flex justify-between items-center mb-2">
               <h2 className="text-lg font-semibold text-slate-300">Usage & Costs</h2>
               <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                 This Month
               </div>
            </div>
            <UsageStats />
          </div>

          {/* Seção 2: Kanban */}
          <div className="flex-1 min-h-[400px]">
            <div className="flex justify-between items-center mb-2">
               <h2 className="text-lg font-semibold text-slate-300">Missões & Tarefas</h2>
               <div className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                 Arraste os cards para mover
               </div>
            </div>
            <KanbanBoard />
          </div>
          
        </div>

      </div>
    </div>
  );
}
