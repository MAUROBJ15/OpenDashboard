"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { agents, ApiUsage, defaultUsage } from "@/lib/types";
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
import { Clock, MessageSquare, Image, Cpu, Shield, Zap, RefreshCw, AlertTriangle } from "lucide-react";

function ProgressCard({ label, used, limit, icon: Icon, bgColor, description }: {
  label: string; used: number; limit: number; icon: React.ElementType; bgColor: string; description: string;
}) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const barColor = pct < 75 ? 'bg-emerald-500' : pct < 100 ? 'bg-amber-500' : 'bg-red-500';
  const statusLabel = pct < 75 ? '✅ OK' : pct < 100 ? '⚠️ Atenção' : pct < 115 ? '🔴 Crítico' : '🚫 Bloqueado';

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${bgColor}`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-[10px] text-muted-foreground">{description}</p>
            </div>
          </div>
          <span className="text-xs font-medium">{statusLabel}</span>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="font-mono font-semibold">{used.toLocaleString()}</span>
            <span className="text-muted-foreground">de {limit.toLocaleString()}</span>
          </div>
          <div className="h-3 w-full bg-accent/30 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all duration-700 ${barColor}`} style={{ width: `${Math.max(pct, 2)}%` }} />
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 text-right">{pct}% utilizado</p>
        </div>
      </CardContent>
    </Card>
  );
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg text-xs">
        <p className="font-semibold">{label}</p>
        <p className="text-primary mt-1">{payload[0].value} requisições</p>
      </div>
    );
  }
  return null;
};

export default function UsagePage() {
  const [usage, setUsage] = useState<ApiUsage>(defaultUsage);

  const fetchUsage = async () => {
    try {
      const res = await fetch('/api/usage');
      if (res.ok) {
        const data = await res.json();
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
    } catch { /* use defaults */ }
  };

  useEffect(() => {
    fetchUsage();
    const interval = setInterval(fetchUsage, 30000);
    return () => clearInterval(interval);
  }, []);

  const totalReqs = usage.gemini_flash_text.requests_used + usage.nvidia_kimi.requests_used + usage.modal_glm5.requests_used;

  // Mock weekly data — will be replaced by Supabase historical query
  const weeklyData = [
    { day: 'Seg', reqs: 45 },
    { day: 'Ter', reqs: 72 },
    { day: 'Qua', reqs: 38 },
    { day: 'Qui', reqs: 91 },
    { day: 'Sex', reqs: 56 },
    { day: 'Sáb', reqs: 12 },
    { day: 'Dom', reqs: 0 },
  ];

  const agentUsageData = [
    { name: "Maestro", reqs: Math.round(totalReqs * 0.35), provider: "Google", avatar: "MA", color: "#3b82f6" },
    { name: "Rex", reqs: usage.nvidia_kimi.requests_used, provider: "NVIDIA", avatar: "RX", color: "#ef4444" },
    { name: "Pixel", reqs: usage.gemini_flash_image.images_generated, provider: "Google Img", avatar: "PX", color: "#a855f7" },
    { name: "Scout", reqs: Math.round(totalReqs * 0.10), provider: "Google", avatar: "SC", color: "#22c55e" },
    { name: "Luna", reqs: Math.round(totalReqs * 0.05), provider: "Google", avatar: "LN", color: "#ec4899" },
    { name: "Marko", reqs: Math.round(totalReqs * 0.08), provider: "Google", avatar: "MK", color: "#f97316" },
    { name: "Hawk", reqs: 0, provider: "Google", avatar: "HK", color: "#eab308" },
    { name: "Docu", reqs: Math.round(totalReqs * 0.02), provider: "Google", avatar: "DC", color: "#06b6d4" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="flex h-14 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString("pt-BR", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px] gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Free Tier Ativo
            </Badge>
            <button onClick={fetchUsage} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="h-3.5 w-3.5" />
              Atualizar
            </button>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Uso & Quotas</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitoramento em tempo real · Reset diário às 04:00 BRT
          </p>
        </div>

        {/* Alerts */}
        {usage.alerts.length > 0 && (
          <Card className="bg-amber-500/5 border-amber-500/30">
            <CardContent className="p-4 flex items-start gap-3">
              <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
              <div className="space-y-1">
                {usage.alerts.map((alert, i) => (
                  <p key={i} className="text-sm text-amber-200">{alert}</p>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Requisições Hoje</CardDescription>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{totalReqs}</div>
              <p className="text-xs text-muted-foreground mt-1">todos os provedores</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Imagens Geradas</CardDescription>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{usage.gemini_flash_image.images_generated}</div>
              <p className="text-xs text-muted-foreground mt-1">Pixel (Gemini Image)</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Rex (Código)</CardDescription>
              <Cpu className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold">{usage.nvidia_kimi.requests_used}</div>
              <p className="text-xs text-muted-foreground mt-1">NVIDIA Kimi K2.5</p>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4 space-y-0">
              <CardDescription className="text-xs">Custo Total</CardDescription>
              <Zap className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-bold text-emerald-500">$0.00</div>
              <p className="text-xs text-muted-foreground mt-1">100% free tier 🎉</p>
            </CardContent>
          </Card>
        </div>

        {/* Quota Bars */}
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Quotas de API</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ProgressCard
              label="Gemini Flash — Texto"
              used={usage.gemini_flash_text.requests_used}
              limit={usage.gemini_flash_text.requests_limit}
              icon={MessageSquare}
              bgColor="bg-blue-500"
              description="Maestro, Scout, Luna, Marko, Hawk, Docu"
            />
            <ProgressCard
              label="Gemini Flash — Imagens"
              used={usage.gemini_flash_image.images_generated}
              limit={usage.gemini_flash_image.images_limit}
              icon={Image}
              bgColor="bg-purple-500"
              description="Pixel · Artes TOONZ, marketing, restauração"
            />
            <ProgressCard
              label="NVIDIA Kimi K2.5"
              used={usage.nvidia_kimi.requests_used}
              limit={100}
              icon={Cpu}
              bgColor="bg-green-600"
              description="Rex · Código complexo, debug, scripts"
            />
            <ProgressCard
              label="Modal GLM-5"
              used={usage.modal_glm5.requests_used}
              limit={50}
              icon={Shield}
              bgColor="bg-indigo-500"
              description="Fallback de emergência · Usar só se tudo falhar"
            />
          </div>
        </div>

        {/* Chart + Agent Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 bg-card border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Requisições por Dia</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 h-[280px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                  <XAxis dataKey="day" fontSize={11} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} className="fill-muted-foreground" />
                  <Tooltip cursor={{ className: "fill-accent" }} content={<CustomTooltip />} />
                  <Bar dataKey="reqs" fill="hsl(217, 91%, 60%)" radius={[6, 6, 0, 0]} barSize={36} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-sm font-semibold">Por Agente</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-3">
              {agentUsageData.map((ag) => {
                const agentDef = agents.find((a) => a.name === ag.name);
                return (
                  <div key={ag.name} className="flex items-center gap-3">
                    <Avatar className="h-7 w-7 border border-border">
                      <AvatarFallback style={{ backgroundColor: ag.color }} className="text-[9px] font-bold text-white">
                        {ag.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium">{ag.name}</span>
                        <span className="text-muted-foreground">{ag.reqs} req</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-accent overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${totalReqs > 0 ? Math.max((ag.reqs / totalReqs) * 100, 2) : 2}%`, backgroundColor: ag.color }} />
                      </div>
                      <div className="flex justify-between text-[9px] text-muted-foreground">
                        <span>{ag.provider}</span>
                        <span>{agentDef?.model}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Rate Limits Reference */}
        <Card className="bg-card border-border">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm font-semibold">Limites do Free Tier (Referência)</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-muted-foreground font-medium">Provedor</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">RPM</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">RPD</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">TPM</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Contexto</th>
                    <th className="text-left py-2 text-muted-foreground font-medium">Custo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr><td className="py-2 font-medium">Gemini 2.5 Flash (texto)</td><td className="py-2">10/min</td><td className="py-2">250/dia</td><td className="py-2">250K</td><td className="py-2">1M tokens</td><td className="py-2 text-emerald-500">GRÁTIS</td></tr>
                  <tr><td className="py-2 font-medium">Gemini Flash Image</td><td className="py-2">2 img/min</td><td className="py-2">1.500/dia</td><td className="py-2">—</td><td className="py-2">—</td><td className="py-2 text-emerald-500">GRÁTIS</td></tr>
                  <tr><td className="py-2 font-medium">NVIDIA Kimi K2.5</td><td className="py-2">~10/min</td><td className="py-2">créditos/mês</td><td className="py-2">variável</td><td className="py-2">131K tokens</td><td className="py-2 text-emerald-500">GRÁTIS</td></tr>
                  <tr><td className="py-2 font-medium">Modal GLM-5</td><td className="py-2">variável</td><td className="py-2">variável</td><td className="py-2">variável</td><td className="py-2">131K tokens</td><td className="py-2 text-emerald-500">GRÁTIS</td></tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <p className="text-[10px] text-center text-muted-foreground">
          Última atualização: {new Date(usage.last_updated).toLocaleString('pt-BR')} · Reset diário: 04:00 BRT (meia-noite Pacífico)
        </p>
      </div>
    </div>
  );
}
