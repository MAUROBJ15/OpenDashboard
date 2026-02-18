
"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, TooltipProps } from "recharts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// --- Dados Mock (Inicial) ---
const costData = [
  { day: 'Seg', cost: 1.20 },
  { day: 'Ter', cost: 0.85 },
  { day: 'Qua', cost: 2.50 }, // Pico
  { day: 'Qui', cost: 1.10 },
  { day: 'Sex', cost: 1.45 },
  { day: 'Sáb', cost: 0.50 },
  { day: 'Dom', cost: 0.30 },
];

const agentUsage = [
  { name: "Maestro", cost: 4.80, percent: 60, tokens: "1.2M", avatar: "MA", color: "bg-blue-500" },
  { name: "Rex", cost: 2.10, percent: 26, tokens: "500K", avatar: "RE", color: "bg-green-500" },
  { name: "Scout", cost: 0.90, percent: 11, tokens: "200K", avatar: "SC", color: "bg-gray-500" },
  { name: "Luna", cost: 0.20, percent: 3, tokens: "50K", avatar: "LU", color: "bg-purple-500" },
];

// --- Componentes Auxiliares ---

// Tooltip customizado para o gráfico
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-lg text-xs">
        <p className="font-bold text-white mb-1">{label}</p>
        <p className="text-blue-400">Custo: ${payload[0].value?.toFixed(2)}</p>
      </div>
    );
  }
  return null;
};

export default function UsageStats() {
  const totalCost = agentUsage.reduce((acc, curr) => acc + curr.cost, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Coluna 1: Gráfico de Barras */}
      <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-xs">Custo Total (Mês)</CardDescription>
              <CardTitle className="text-xl text-white">${totalCost.toFixed(2)}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-xs">Tokens Totais</CardDescription>
              <CardTitle className="text-xl text-white">1.95M</CardTitle>
            </CardHeader>
          </Card>
           {/* Cards placeholder */}
           <Card className="bg-slate-900 border-slate-800 hidden md:block opacity-50">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-xs">Conversas</CardDescription>
              <CardTitle className="text-xl text-white">42</CardTitle>
            </CardHeader>
          </Card>
           <Card className="bg-slate-900 border-slate-800 hidden md:block opacity-50">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-xs">Atividade</CardDescription>
              <CardTitle className="text-xl text-white">128</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800 flex-1 min-h-[200px]">
          <CardHeader className="py-2">
            <CardTitle className="text-sm text-slate-300">Custo Diário ($)</CardTitle>
          </CardHeader>
          <CardContent className="h-[180px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
                <XAxis 
                  dataKey="day" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `$${value}`} 
                />
                <Tooltip cursor={{fill: '#1e293b'}} content={<CustomTooltip />} />
                <Bar 
                  dataKey="cost" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]} 
                  barSize={30}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Coluna 2: Tabela por Agente */}
      <div className="lg:col-span-1 h-full">
        <Card className="h-full bg-slate-900 border-slate-800 flex flex-col">
          <CardHeader className="py-3">
            <CardTitle className="text-sm text-slate-300">Uso por Agente</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-3">
            <div className="space-y-4">
              {agentUsage.map((agent) => (
                <div key={agent.name} className="flex items-center gap-3">
                   <Avatar className="h-8 w-8 border border-slate-700">
                    <AvatarFallback className={`${agent.color} text-white text-xs font-bold`}>{agent.avatar}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-white font-medium text-xs">{agent.name}</span>
                      <span className="text-slate-400 text-xs">${agent.cost.toFixed(2)}</span>
                    </div>
                    
                    {/* Barra de progresso customizada */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div 
                        className={`h-full`} 
                        style={{ width: `${agent.percent}%`, backgroundColor: agent.color.includes('blue') ? '#3b82f6' : agent.color.includes('green') ? '#22c55e' : agent.color.includes('purple') ? '#a855f7' : '#6b7280' }}
                      />
                    </div>
                    
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span>{agent.percent}% do total</span>
                      <span>{agent.tokens} tokens</span>
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
