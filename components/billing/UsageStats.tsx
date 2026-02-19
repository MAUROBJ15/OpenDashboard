"use client";

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ApiUsage, defaultUsage, agents } from "@/lib/types";
import { MessageSquare, Image, Cpu, Shield, RefreshCw } from "lucide-react";

function QuotaBar({ used, limit, label, icon: Icon, color }: { 
  used: number; limit: number; label: string; icon: React.ElementType; color: string 
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor = pct < 75 ? 'bg-emerald-500' : pct < 100 ? 'bg-amber-500' : 'bg-red-500';
  const statusText = pct < 75 ? 'OK' : pct < 100 ? 'ATENÇÃO' : pct < 115 ? 'CRÍTICO' : 'BLOQUEADO';
  const statusColor = pct < 75 ? 'text-emerald-500' : pct < 100 ? 'text-amber-500' : 'text-red-500';

  return (
    <Card className="bg-card border-border shadow-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${color}`}>
              <Icon className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-xs font-semibold">{label}</span>
          </div>
          <span className={`text-[10px] font-bold uppercase ${statusColor}`}>{statusText}</span>
        </div>
        <div className="h-2.5 w-full bg-accent/30 rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.max(pct, 2)}%` }} />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
          <span>{used.toLocaleString()} / {limit.toLocaleString()}</span>
          <span>{pct}%</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function UsageStats() {
  const [usage, setUsage] = useState<ApiUsage>(defaultUsage);
  const [loading, setLoading] = useState(true);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage');
      if (res.ok) {
        const data = await res.json();
        // Normalize API response to ApiUsage format
        setUsage({
          date: data.date || defaultUsage.date,
          gemini_flash_text: {
            requests_used: data.gemini_text_used ?? data.gemini_flash_text?.requests_used ?? 0,
            requests_limit: data.gemini_text_limit ?? data.gemini_flash_text?.requests_limit ?? 200,
            status: data.gemini_text_status ?? data.gemini_flash_text?.status ?? 'OK',
          },
          gemini_flash_image: {
            images_generated: data.gemini_image_used ?? data.gemini_flash_image?.images_generated ?? 0,
            images_limit: data.gemini_image_limit ?? data.gemini_flash_image?.images_limit ?? 1500,
            status: data.gemini_image_status ?? data.gemini_flash_image?.status ?? 'OK',
          },
          nvidia_kimi: {
            requests_used: data.nvidia_used ?? data.nvidia_kimi?.requests_used ?? 0,
            status: data.nvidia_status ?? data.nvidia_kimi?.status ?? 'OK',
          },
          modal_glm5: {
            requests_used: data.modal_used ?? data.modal_glm5?.requests_used ?? 0,
            status: data.modal_status ?? data.modal_glm5?.status ?? 'RESERVA',
          },
          alerts: data.alerts ?? [],
          last_updated: data.last_updated ?? new Date().toISOString(),
        });
      }
    } catch {
      // Silently use defaults
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000); // Refresh a cada 30s
    return () => clearInterval(interval);
  }, []);

  const totalRequests = usage.gemini_flash_text.requests_used + usage.nvidia_kimi.requests_used + usage.modal_glm5.requests_used;

  // Per-agent estimate (proportional based on typical usage patterns)
  const agentEstimates = [
    { name: 'Maestro', pct: 35, color: '#3b82f6' },
    { name: 'Rex', pct: 25, color: '#ef4444' },
    { name: 'Pixel', pct: 15, color: '#a855f7' },
    { name: 'Scout', pct: 10, color: '#22c55e' },
    { name: 'Marko', pct: 8, color: '#f97316' },
    { name: 'Luna', pct: 5, color: '#ec4899' },
    { name: 'Docu', pct: 2, color: '#06b6d4' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
      
      {/* Left: Quota Bars + Summary Stats */}
      <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
        
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold">Requisições Hoje</CardDescription>
              <CardTitle className="text-xl font-bold">{totalRequests}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold">Imagens Hoje</CardDescription>
              <CardTitle className="text-xl font-bold">{usage.gemini_flash_image.images_generated}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold">Rex (NVIDIA)</CardDescription>
              <CardTitle className="text-xl font-bold">{usage.nvidia_kimi.requests_used}</CardTitle>
            </CardHeader>
          </Card>
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="p-3 pb-1">
              <CardDescription className="text-[10px] uppercase tracking-wider font-bold">Custo Total</CardDescription>
              <div className="flex items-baseline gap-1">
                <CardTitle className="text-xl font-bold text-emerald-500">$0.00</CardTitle>
                <span className="text-[10px] text-muted-foreground">free tier</span>
              </div>
            </CardHeader>
          </Card>
        </div>

        {/* Quota Progress Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
          <QuotaBar
            used={usage.gemini_flash_text.requests_used}
            limit={usage.gemini_flash_text.requests_limit}
            label="Gemini Flash — Texto"
            icon={MessageSquare}
            color="bg-blue-500"
          />
          <QuotaBar
            used={usage.gemini_flash_image.images_generated}
            limit={usage.gemini_flash_image.images_limit}
            label="Gemini Flash — Imagens"
            icon={Image}
            color="bg-purple-500"
          />
          <QuotaBar
            used={usage.nvidia_kimi.requests_used}
            limit={100}
            label="NVIDIA Kimi — Código"
            icon={Cpu}
            color="bg-green-600"
          />
          <QuotaBar
            used={usage.modal_glm5.requests_used}
            limit={50}
            label="Modal GLM-5 — Reserva"
            icon={Shield}
            color="bg-indigo-500"
          />
        </div>

        {/* Alerts */}
        {usage.alerts.length > 0 && (
          <Card className="bg-amber-500/5 border-amber-500/20">
            <CardContent className="p-3 space-y-1">
              {usage.alerts.map((alert, i) => (
                <p key={i} className="text-xs text-amber-500">⚠️ {alert}</p>
              ))}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Right: Agent Distribution */}
      <div className="lg:col-span-1 h-full">
        <Card className="h-full bg-card border-border shadow-sm flex flex-col overflow-hidden">
          <CardHeader className="py-3 px-4 border-b border-border/50 flex-row items-center justify-between">
            <CardTitle className="text-sm font-semibold">Uso por Agente</CardTitle>
            <Badge variant="outline" className="text-[9px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              100% FREE
            </Badge>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-0">
            <div className="divide-y divide-border/50">
              {agentEstimates.map((ag) => {
                const agentDef = agents.find(a => a.name === ag.name);
                const reqEstimate = Math.round(totalRequests * ag.pct / 100);
                return (
                  <div key={ag.name} className="flex items-center gap-3 p-3 hover:bg-accent/5 transition-colors">
                    <Avatar className="h-8 w-8 border border-border shadow-sm">
                      <AvatarFallback style={{ backgroundColor: ag.color }} className="text-white text-[10px] font-bold">
                        {agentDef?.initials || ag.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs">{ag.name}</span>
                        <span className="text-muted-foreground text-[10px] font-mono">~{reqEstimate} req</span>
                      </div>
                      <div className="h-1.5 w-full bg-accent/20 rounded-full overflow-hidden">
                        <div className="h-full transition-all duration-500 rounded-full" style={{ width: `${ag.pct}%`, backgroundColor: ag.color }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground">
                        <span>{ag.pct}% do uso</span>
                        <span className="opacity-70">{agentDef?.provider}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <div className="p-3 border-t border-border/50 flex items-center justify-between text-[9px] text-muted-foreground">
            <span>Atualizado: {new Date(usage.last_updated).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            <button onClick={fetchUsage} className="flex items-center gap-1 hover:text-foreground transition-colors">
              <RefreshCw className="h-3 w-3" />
              Refresh
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
