"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { agents } from "@/lib/types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  TooltipProps,
  CartesianGrid,
} from "recharts";
import { DollarSign, Zap, TrendingUp, Clock } from "lucide-react";

const costData = [
  { day: "Seg", cost: 1.2 },
  { day: "Ter", cost: 0.85 },
  { day: "Qua", cost: 2.5 },
  { day: "Qui", cost: 1.1 },
  { day: "Sex", cost: 1.45 },
  { day: "Sáb", cost: 0.5 },
  { day: "Dom", cost: 0.3 },
];

const agentUsage = [
  { name: "Maestro", cost: 4.8, percent: 60, tokens: "1.2M" },
  { name: "Rex", cost: 2.1, percent: 26, tokens: "500K" },
  { name: "Scout", cost: 0.9, percent: 11, tokens: "200K" },
  { name: "Luna", cost: 0.2, percent: 3, tokens: "50K" },
  { name: "Hawk", cost: 0.0, percent: 0, tokens: "0" },
  { name: "Pixel", cost: 0.0, percent: 0, tokens: "0" },
  { name: "Marko", cost: 0.0, percent: 0, tokens: "0" },
  { name: "Docu", cost: 0.0, percent: 0, tokens: "0" },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold">{label}</p>
        <p className="text-primary mt-1">Custo: ${payload[0].value?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function UsagePage() {
  const totalCost = agentUsage.reduce((acc, a) => acc + a.cost, 0);

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
              <p className="text-sm font-semibold">${totalCost.toFixed(2)}</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Uso & Custos</h1>
          <p className="text-sm text-muted-foreground mt-1">Fevereiro 2026 · Todos os modelos gratuitos via Antigravity</p>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Custo Total</CardDescription>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">${totalCost.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">este mês</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Tokens Totais</CardDescription>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">1.95M</div>
              <p className="text-xs text-muted-foreground mt-1">input + output</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Conversas</CardDescription>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground mt-1">sessões ativas</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Média Diária</CardDescription>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">${(totalCost / 7).toFixed(2)}</div>
              <p className="text-xs text-muted-foreground mt-1">últimos 7 dias</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Custo Diário ($)</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} className="fill-muted-foreground" />
                  <Tooltip cursor={{ className: "fill-accent" }} content={<CustomTooltip />} />
                  <Bar dataKey="cost" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Agent Usage */}
          <Card className="bg-card border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Uso por Agente</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              {agentUsage.map((usage) => {
                const agent = agents.find((a) => a.name === usage.name);
                return (
                  <div key={usage.name} className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback
                        className={`${agent?.color || "bg-slate-500"} text-[9px] font-bold text-white`}
                      >
                        {agent?.initials || "??"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{usage.name}</span>
                        <span className="text-muted-foreground">${usage.cost.toFixed(2)}</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${Math.max(usage.percent, 2)}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground">
                        <span>{usage.percent}%</span>
                        <span>{usage.tokens} tokens</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
