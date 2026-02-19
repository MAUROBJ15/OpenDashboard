"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, Brain } from "lucide-react";

type Message = {
  id: string;
  sender: "user" | "agent";
  agentName?: string;
  content: string;
  timestamp: Date;
};

const initialMessages: Message[] = [
  {
    id: "1",
    sender: "agent",
    agentName: "Maestro",
    content: "Olá, Mauro! O Dashboard está online. Como posso ajudar hoje?",
    timestamp: new Date(),
  },
];

export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      sender: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");

    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        sender: "agent",
        agentName: "Maestro",
        content: `Recebido: "${inputValue}". Estou processando sua solicitação...`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, response]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-full flex flex-col rounded-xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3 bg-card">
        <Brain className="h-5 w-5 text-primary" />
        <div>
          <p className="text-sm font-semibold">OpenMauro Chat</p>
          <p className="text-[10px] text-muted-foreground">Canal Seguro · Squad Ativo</p>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 pb-2">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.sender === "agent" && (
                <Avatar className="h-7 w-7 border border-border mt-1 shrink-0">
                  <AvatarFallback className="bg-blue-500 text-[9px] font-bold text-white">
                    {msg.agentName?.substring(0, 2).toUpperCase() || <Bot size={12} />}
                  </AvatarFallback>
                </Avatar>
              )}

              <div
                className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-none"
                    : "bg-accent text-foreground border border-border rounded-tl-none"
                }`}
              >
                {msg.sender === "agent" && (
                  <p className="text-[10px] font-bold text-primary mb-1 uppercase tracking-wider">
                    {msg.agentName}
                  </p>
                )}
                <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                <span
                  className={`text-[9px] mt-1 block text-right ${
                    msg.sender === "user" ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}
                >
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              {msg.sender === "user" && (
                <Avatar className="h-7 w-7 border border-border mt-1 shrink-0">
                  <AvatarFallback className="bg-blue-600 text-[9px] font-bold text-white">
                    <User size={12} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-3 flex gap-2 bg-card">
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Digite sua mensagem..."
          className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
        />
        <Button
          size="icon"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
}
