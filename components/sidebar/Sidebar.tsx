"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  LayoutDashboard,
  Bot,
  ListTodo,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/agents", label: "Agentes", icon: Bot },
  { href: "/tasks", label: "Tarefas", icon: ListTodo },
  { href: "/usage", label: "Uso & Custos", icon: BarChart3 },
  { href: "/chat", label: "Chat", icon: MessageSquare },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-56 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-5">
        <Image src="/logo.svg" alt="OpenMauro" width={32} height={32} className="rounded-lg" />
        <div className="leading-tight">
          <p className="text-sm font-semibold tracking-tight">OMHQ</p>
          <p className="text-[9px] text-muted-foreground uppercase tracking-widest">OpenMauro</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-3 space-y-2">
        <div className="flex items-center gap-2 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8 border border-border">
            <AvatarFallback className="bg-blue-600 text-xs font-bold text-white">
              MJ
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate">Mauro</p>
            <p className="text-[10px] text-muted-foreground">Admin</p>
          </div>
          <ThemeToggle />
        </div>
        <div className="flex gap-1">
          <Link
            href="/settings"
            className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <Settings className="h-3.5 w-3.5" />
            Settings
          </Link>
          <button className="flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
            <LogOut className="h-3.5 w-3.5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
