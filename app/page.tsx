"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { agents } from "@/lib/types";
import {
  DollarSign,
  Zap,
  MessageSquare,
  Activity,
  ArrowUpRight,
  Clock,
} from "lucide-react";

const stats = [
  { label: "Custo Hoje", value: "$0.73", icon: DollarSign, trend: "-12%", trendUp: false },
  { label: "Custo Mês", value: "$8.00", icon: DollarSign, trend: "+4%", trendUp: true },
  { label: "Tokens Usados", value: "1.95M", icon: Zap, trend: "+18%", trendUp: true },
  { label: "Conversas", value: "42", icon: MessageSquare, trend: "+6", trendUp: true },
];

const recentActivity = [
  { agent: "Rex", action: "Commit push: redesign dashboard", time: "há 2 min", color: "bg-emerald-500" },
  { agent: "Maestro", action: "Delegou tarefa para Pixel", time: "há 15 min", color: "bg-blue-500" },
  { agent: "Luna", action: "Backup diário concluído", time: "há 1h", color: "bg-purple-500" },
  { agent: "Hawk", action: "Code review aprovado", time: "há 2h", color: "bg-amber-500" },
  { agent: "Scout", action: "Pesquisa de ferramentas finalizada", time: "há 3h", color: "bg-slate-500" },
];

export default function DashboardPage() {
  const onlineAgents = agents.filter((a) => a.status === "online").length;
  const totalAgents = agents.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              {" · "}
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hoje</p>
              <p className="text-sm font-semibold">$0.73</p>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fev</p>
              <p className="text-sm font-semibold">$8.00</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {onlineAgents} de {totalAgents} agentes online · Sistema operacional
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="bg-card border-border">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-4">
                <CardDescription className="text-xs font-medium">{stat.label}</CardDescription>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs mt-1 flex items-center gap-1 ${stat.trendUp ? "text-emerald-500" : "text-red-500"}`}>
                  <ArrowUpRight className={`h-3 w-3 ${!stat.trendUp ? "rotate-90" : ""}`} />
                  {stat.trend} vs semana passada
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Squad Ativo */}
          <Card className="lg:col-span-1 bg-card border-border">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Squad Ativo</CardTitle>
                <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
                  {onlineAgents} online
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors"
                >
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarFallback className={`${agent.color} text-[10px] font-bold text-white`}>
                      {agent.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{agent.name}</p>
                    <p className="text-[10px] text-muted-foreground">{agent.role}</p>
                  </div>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      agent.status === "online"
                        ? "bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,.5)]"
                        : agent.status === "idle"
                        ? "bg-amber-400"
                        : "bg-slate-400 dark:bg-slate-600"
                    }`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Atividade Recente */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="p-4 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold">Atividade Recente</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {recentActivity.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg p-2 hover:bg-accent transition-colors">
                    <Avatar className="h-7 w-7 border border-border mt-0.5">
                      <AvatarFallback className={`${item.color} text-[9px] font-bold text-white`}>
                        {item.agent.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{item.agent}</span>
                        <span className="text-muted-foreground"> · {item.action}</span>
                      </p>
                    </div>
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap mt-0.5">{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
