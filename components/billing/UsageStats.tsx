"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps, Cell } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- Dados Mock (Simulando API futura) ---
const costData = [
  { day: 'Seg', cost: 1.20 },
  { day: 'Ter', cost: 0.85 },
  { day: 'Qua', cost: 2.50 },
  { day: 'Qui', cost: 1.10 },
  { day: 'Sex', cost: 1.45 },
  { day: 'Sáb', cost: 0.50 },
  { day: 'Dom', cost: 0.30 },
];

const agentUsage = [
  { name: "Maestro", cost: 4.80, percent: 60, tokens: "1.2M", avatar: "MA", color: "#3b82f6" },
  { name: "Rex", cost: 2.10, percent: 26, tokens: "500K", avatar: "RE", color: "#ef4444" },
  { name: "Scout", cost: 0.90, percent: 11, tokens: "200K", avatar: "SC", color: "#22c55e" },
  { name: "Luna", cost: 0.20, percent: 3, tokens: "50K", avatar: "LU", color: "#ec4899" },
];

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border p-2 rounded-lg shadow-xl text-xs">
        <p className="font-bold text-foreground mb-1">{label}</p>
        <p className="text-primary font-medium">Custo: ${payload[0].value?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function UsageStats() {
  const totalCost = agentUsage.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Coluna 1: Gráfico e Stats */}
      <div className="lg:col-span-2 space-y-6 flex flex-col h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Custo Total (Mês)', value: `$${totalCost.toFixed(2)}`, trend: '+12%' },
            { label: 'Tokens Totais', value: '1.95M', trend: '+5%' },
            { label: 'Conversas', value: '42', trend: '-2%' },
            { label: 'Atividade', value: '128', trend: '+18%' },
          ].map((stat, i) => (
            <Card key={i} className="bg-card border-border shadow-sm">
              <CardHeader className="p-4">
                <CardDescription className="text-[10px] uppercase tracking-wider font-bold">{stat.label}</CardDescription>
                <div className="flex items-baseline justify-between mt-1">
                  <CardTitle className="text-xl font-bold">{stat.value}</CardTitle>
                  <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.trend}
                  </span>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <Card className="bg-card border-border shadow-sm flex-1 min-h-[250px] flex flex-col">
          <CardHeader className="py-4 px-6 border-b border-border/50">
            <CardTitle className="text-sm font-semibold">Custo Diário ($)</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 pt-6 px-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--primary)" stopOpacity={1} />
                    <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="day" 
                  stroke="currentColor" 
                  className="text-muted-foreground opacity-50"
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  stroke="currentColor" 
                  className="text-muted-foreground opacity-50"
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip cursor={{fill: 'var(--accent)', opacity: 0.2}} content={<CustomTooltip />} />
                <Bar 
                  dataKey="cost" 
                  fill="url(#barGradient)" 
                  radius={[6, 6, 0, 0]} 
                  barSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Coluna 2: Uso por Agente */}
      <div className="lg:col-span-1 h-full">
        <Card className="h-full bg-card border-border shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="py-4 px-6 border-b border-border/50">
            <CardTitle className="text-sm font-semibold">Uso por Agente</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-border/50">
              {agentUsage.map((agent) => (
                <div key={agent.name} className="flex items-center gap-4 p-4 hover:bg-accent/5 transition-colors">
                   <Avatar className="h-10 w-10 border border-border shadow-sm">
                    <AvatarFallback style={{ backgroundColor: agent.color }} className="text-white text-xs font-bold">
                      {agent.avatar}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-xs">{agent.name}</span>
                      <span className="text-muted-foreground text-[10px] font-mono">${agent.cost.toFixed(2)}</span>
                    </div>
                    
                    <div className="h-2 w-full bg-accent/20 rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500" 
                        style={{ width: `${agent.percent}%`, backgroundColor: agent.color }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                      <span>{agent.percent}% do uso total</span>
                      <span className="opacity-70">{agent.tokens} tokens</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
