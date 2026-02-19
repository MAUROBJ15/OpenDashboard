"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { agents } from "@/lib/types";
import { Clock, Bot, Cpu, Activity } from "lucide-react";

export default function AgentsPage() {
  const online = agents.filter((a) => a.status === "online").length;

  return (
    <div className="min-h-screen bg-background">
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
            </span>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-[10px]">
            {online} de {agents.length} online
          </Badge>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agentes</h1>
          <p className="text-sm text-muted-foreground mt-1">Squad completo do OpenMauro HQ</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {agents.map((agent) => (
            <Card key={agent.id} className="bg-card border-border hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12 border-2 border-border">
                    <AvatarFallback className={`${agent.color} text-sm font-bold text-white`}>
                      {agent.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold">{agent.name}</h3>
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
                    <p className="text-sm text-muted-foreground">{agent.role}</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Cpu className="h-3.5 w-3.5" />
                    <span>{agent.model}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Activity className="h-3.5 w-3.5" />
                    <span>
                      {agent.status === "online"
                        ? "Ativo agora"
                        : agent.status === "idle"
                        ? "Em espera"
                        : "Offline"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <Badge
                    variant="secondary"
                    className={`text-[10px] ${
                      agent.status === "online"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : agent.status === "idle"
                        ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
                        : "bg-slate-500/10 text-slate-500"
                    }`}
                  >
                    {agent.status === "online"
                      ? "Online"
                      : agent.status === "idle"
                      ? "Idle"
                      : "Offline"}
                  </Badge>
                  <Badge variant="secondary" className="text-[10px]">
                    Antigravity
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
