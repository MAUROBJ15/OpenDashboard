"use client";

import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { agents } from "@/lib/types";
import { PlusCircle, Loader2 } from "lucide-react";

export function NewMissionModal({ children }: { children?: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [agentId, setAgentId] = useState('maestro');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const agent = agents.find(a => a.id === agentId);
      
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          agent: agent?.name || 'Maestro',
          priority: 'Média',
          status: 'scheduled',
          color: agent?.color.replace('bg-', 'text-') || 'text-blue-500'
        }),
      });

      if (res.ok) {
        setOpen(false);
        setTitle('');
        window.location.reload(); // Atualiza para mostrar a nova tarefa
      }
    } catch (error) {
      console.error('Erro ao criar missão:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full justify-start gap-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">
            <PlusCircle className="h-4 w-4" />
            <span className="text-xs font-semibold">New Mission</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Criar Nova Missão</DialogTitle>
            <DialogDescription>
              Descreva o trabalho e selecione o agente responsável.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Título da Missão</label>
              <Input 
                placeholder="Ex: Analisar relatório de vendas..." 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="bg-accent/50 border-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Agente Especialista</label>
              <select 
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="w-full h-9 rounded-md bg-accent/50 border-none px-3 text-sm focus:ring-1 focus:ring-primary outline-none"
              >
                {agents.map(agent => (
                  <option key={agent.id} value={agent.id} className="bg-card text-foreground">
                    {agent.name} ({agent.role})
                  </option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading || !title}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lançar Missão
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
