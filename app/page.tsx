"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import KanbanBoard from "@/components/kanban/Board";
import ChatWidget from "@/components/chat/ChatWidget";
import UsageStats from "@/components/billing/UsageStats";
import { agents } from "@/lib/types";
import { Activity, Zap, Shield, Cpu } from "lucide-react";

export default function Home() {
  const squad = agents.slice(0, 4); // Mostra os 4 primeiros no overview

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Centro de Comando</h1>
          <p className="text-muted-foreground text-sm">Monitoramento em tempo real do ecossistema OpenMauro.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20 px-3 py-1 gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Sistemas Online
          </Badge>
          <div className="text-xs font-medium text-muted-foreground border-l pl-3 border-border">
            v2.1.0-beta
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* Left Column: Squad & Chat */}
        <div className="xl:col-span-1 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Squad Ativo</h2>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {squad.map((agent) => (
                <Card key={agent.id} className="bg-card border-border hover:shadow-md transition-all cursor-default overflow-hidden group">
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="relative">
                      <Avatar className="h-10 w-10 border border-border shadow-sm">
                        <AvatarFallback className={`${agent.color} text-white text-xs font-bold`}>
                          {agent.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{agent.name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wide font-medium truncate">{agent.role}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          <section className="h-[400px] flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Canal Seguro</h2>
            </div>
            <div className="flex-1 bg-card rounded-xl border border-border overflow-hidden shadow-inner">
              <ChatWidget />
            </div>
          </section>
        </div>

        {/* Right Column: Stats & Tasks */}
        <div className="xl:col-span-3 space-y-8">
          
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Performance & Custo</h2>
              </div>
            </div>
            <div className="bg-card/50 p-1 rounded-2xl border border-border shadow-sm">
              <UsageStats />
            </div>
          </section>

          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Fluxo de Missões</h2>
              </div>
              <Badge variant="outline" className="text-[10px] bg-accent/50">Real-time Updates</Badge>
            </div>
            <div className="bg-card/30 p-4 rounded-2xl border border-border/50">
              <KanbanBoard />
            </div>
          </section>
          
        </div>

      </div>
    </div>
  );
}
