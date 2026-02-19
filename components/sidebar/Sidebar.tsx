"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Users, 
  BarChart3, 
  MessageSquare, 
  Settings, 
  LogOut,
  PlusCircle
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
  { icon: CheckSquare, label: 'Tasks', href: '/tasks' },
  { icon: Users, label: 'Agents', href: '/agents' },
  { icon: BarChart3, label: 'Usage', href: '/usage' },
  { icon: MessageSquare, label: 'Chat', href: '/chat' },
];

import { Sidebar } from "@/components/sidebar/Sidebar";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/theme-provider";
import { NewMissionModal } from "@/components/missions/NewMissionModal";

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold">M</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm">OpenMauro HQ</span>
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Command Center</span>
        </div>
      </div>

      <div className="px-4 mb-4">
        <NewMissionModal />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
              pathname === item.href 
                ? "bg-primary text-primary-foreground font-medium" 
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-border mt-auto">
        <div className="flex items-center gap-3 px-3 py-4 mb-2">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src="" />
            <AvatarFallback className="bg-slate-200 dark:bg-slate-800 text-xs font-bold">MJ</AvatarFallback>
          </Avatar>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">Mauro Junior</span>
            <span className="text-[10px] text-muted-foreground truncate">Super Admin</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-muted-foreground">
            <Settings className="h-4 w-4" />
            <span className="text-xs">Settings</span>
          </Button>
          <Button variant="ghost" size="sm" className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10">
            <LogOut className="h-4 w-4" />
            <span className="text-xs">Logout</span>
          </Button>
        </div>
      </div>
    </aside>
  );
}
