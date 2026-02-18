
"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Brain } from "lucide-react";

// --- Tipos ---
type Message = {
  id: string;
  sender: 'user' | 'agent';
  agentName?: string; 
  content: string;
  timestamp: Date;
};

// --- Dados Mock (Inicial) ---
const initialMessages: Message[] = [
  { 
    id: '1', 
    sender: 'agent', 
    agentName: 'Maestro', 
    content: 'Olá, Mauro! O Dashboard está online. Como posso ajudar hoje?', 
    timestamp: new Date() 
  }
];

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll para última mensagem
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue("");

    // Simulação de resposta (placeholder para backend real)
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        agentName: 'Rex',
        content: `Recebido: "${inputValue}". Estou processando sua solicitação...`,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, response]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="h-full flex flex-col bg-slate-900 border-slate-800 shadow-xl overflow-hidden rounded-xl">
      <CardHeader className="py-3 border-b border-slate-800 shrink-0 bg-slate-950">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-blue-500" />
          <div>
            <CardTitle className="text-sm text-white">OpenMauro Chat</CardTitle>
            <CardDescription className="text-xs text-slate-400">Canal Seguro • Squad Ativo</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <div className="flex-1 flex flex-col overflow-hidden bg-slate-900/50">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4 pb-2">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'agent' && (
                  <Avatar className="h-8 w-8 border border-slate-700 mt-1 shrink-0">
                    <AvatarFallback className="bg-slate-800 text-xs text-blue-400 font-bold">
                      {msg.agentName?.substring(0, 2).toUpperCase() || <Bot size={14} />}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div 
                  className={`max-w-[85%] rounded-lg px-3 py-2 text-sm shadow-md ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-tl-none'
                  }`}
                >
                  {msg.sender === 'agent' && (
                    <p className="text-[10px] font-bold text-blue-400 mb-1 uppercase tracking-wider">{msg.agentName}</p>
                  )}
                  <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  <span className={`text-[9px] mt-1 block text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-500'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 border border-slate-700 mt-1 shrink-0">
                    <AvatarFallback className="bg-blue-900 text-xs text-white font-bold">
                      <User size={14} />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </div>

      <div className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2 shrink-0">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 bg-slate-900 border border-slate-800 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500 transition-all"
        />
        <Button 
          size="icon" 
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="bg-blue-600 hover:bg-blue-500 text-white transition-colors"
        >
          <Send size={16} />
        </Button>
      </div>
    </Card>
  );
}
