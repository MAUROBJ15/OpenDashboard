"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import KanbanBoard from "@/components/kanban/Board";
import ChatWidget from "@/components/chat/ChatWidget";
import UsageStats from "@/components/billing/UsageStats";

const agents = [
  { name: "Maestro", role: "Coordenação", status: "online", initials: "MA", color: "bg-blue-500" },
  { name: "Rex", role: "DevOps / Code", status: "online", initials: "RE", color: "bg-green-500" },
  { name: "Luna", role: "Admin / Backup", status: "idle", initials: "LU", color: "bg-purple-500" },
  { name: "Scout", role: "Pesquisa", status: "offline", initials: "SC", color: "bg-slate-500" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0B0D12] text-white antialiased">

      {/* ── HEADER ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0B0D12]/90 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-[1800px] items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-xs font-black">OM</div>
            <div className="leading-tight">
              <p className="text-sm font-semibold tracking-tight">Centro de Comando</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest">OpenMauro HQ</p>
            </div>
          </div>

          {/* Squad pills */}
          <div className="hidden md:flex items-center gap-1.5">
            {agents.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-2.5 py-1 text-[11px] text-slate-300 hover:bg-white/[0.06] transition-colors"
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    a.status === "online"
                      ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.6)]"
                      : a.status === "idle"
                      ? "bg-amber-400"
                      : "bg-slate-600"
                  }`}
                />
                {a.name}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Badge className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-[10px]">
              Sistema Online
            </Badge>
            <Button
              size="sm"
              className="h-7 bg-blue-600 px-3 text-xs font-medium hover:bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,.25)]"
            >
              + Nova Missão
            </Button>
          </div>
        </div>
      </header>

      {/* ── BODY ── */}
      <div className="mx-auto max-w-[1800px] p-5 space-y-5">

        {/* ROW 1 ─ Squad + Stats + Agent Usage */}
        <div className="grid grid-cols-12 gap-5">

          {/* Squad Ativo (col 1‑3) */}
          <section className="col-span-12 md:col-span-3 lg:col-span-2 space-y-1.5">
            <h2 className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Squad Ativo</h2>
            {agents.map((a) => (
              <div
                key={a.name}
                className="flex items-center gap-3 rounded-xl border border-white/[0.04] bg-[#12141A] px-3 py-2.5 hover:bg-white/[0.03] transition-colors"
              >
                <Avatar className="h-9 w-9 border border-white/[0.08]">
                  <AvatarFallback className={`${a.color} text-[11px] font-bold text-white`}>
                    {a.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] font-medium leading-none text-white truncate">{a.name}</p>
                  <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                    <span
                      className={`inline-block h-1.5 w-1.5 rounded-full ${
                        a.status === "online"
                          ? "bg-emerald-400"
                          : a.status === "idle"
                          ? "bg-amber-400"
                          : "bg-slate-600"
                      }`}
                    />
                    {a.role}
                  </p>
                </div>
              </div>
            ))}
          </section>

          {/* Usage & Costs (col 4‑9) */}
          <section className="col-span-12 md:col-span-9 lg:col-span-7 rounded-xl border border-white/[0.04] bg-[#12141A] overflow-hidden">
            <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Performance & Custos</h2>
              <Badge variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px]">
                Fevereiro 2026
              </Badge>
            </div>
            <div className="p-4 h-[320px]">
              <UsageStats />
            </div>
          </section>

          {/* Chat (col 10‑12) */}
          <section className="col-span-12 lg:col-span-3 h-[400px]">
            <ChatWidget />
          </section>
        </div>

        {/* ROW 2 ─ Kanban (full width) */}
        <section className="rounded-xl border border-white/[0.04] bg-[#12141A] overflow-hidden">
          <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
            <div className="flex items-center gap-2">
              <span className="h-4 w-1 rounded-full bg-emerald-500" />
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Missões & Tarefas</h2>
            </div>
            <p className="text-[10px] text-slate-600">Arraste os cards para mover</p>
          </div>
          <div className="p-5">
            <KanbanBoard />
          </div>
        </section>

      </div>
    </div>
  );
}
