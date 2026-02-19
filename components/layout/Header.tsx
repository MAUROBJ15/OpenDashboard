"use client";

import React from 'react';
import { Search, Bell, Moon, Sun } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-40 px-6 flex items-center justify-between">
      <div className="flex items-center flex-1 max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search missions, tasks, agents..."
            className="w-full bg-accent/50 border-none pl-9 h-9 text-sm focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-4">
        <div className="hidden md:flex flex-col items-end mr-2">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold">Cost (Month)</span>
          <span className="text-sm font-bold text-primary">$8.00</span>
        </div>
        
        <div className="flex items-center gap-1 border-l border-border pl-4">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
            <Sun className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
