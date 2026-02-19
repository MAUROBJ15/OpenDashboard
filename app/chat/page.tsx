"use client";

import ChatWidget from "@/components/chat/ChatWidget";
import { Clock } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
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
        </div>
      </header>

      <div className="flex-1 p-6">
        <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)]">
          <ChatWidget />
        </div>
      </div>
    </div>
  );
}
