"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task, TaskStatus, agents } from "@/lib/types";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  useDroppable,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Search,
  Plus,
  Calendar,
  ExternalLink,
  LayoutGrid,
  List,
  Clock,
  Filter,
} from "lucide-react";

// ── Column Config ──
type Column = { id: TaskStatus; title: string; color: string; dot: string };

const columns: Column[] = [
  { id: "scheduled", title: "Agendadas", color: "bg-slate-50 dark:bg-slate-900/30", dot: "bg-slate-400" },
  { id: "queue", title: "Fila", color: "bg-cyan-50/50 dark:bg-cyan-900/10", dot: "bg-cyan-400" },
  { id: "in-progress", title: "Em Progresso", color: "bg-amber-50/50 dark:bg-amber-900/10", dot: "bg-amber-400" },
  { id: "done", title: "Concluído", color: "bg-emerald-50/50 dark:bg-emerald-900/10", dot: "bg-emerald-400" },
];

// ── Task Card ──
function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({
      id: task.id,
      data: { type: "Task", task },
    });

  const style = { transform: CSS.Translate.toString(transform), transition };

  const agent = agents.find((a) => a.name === task.agent || a.id === task.agent);
  const dateStr = (task.created_at || task.createdAt)
    ? new Date((task.created_at || task.createdAt) as string).toLocaleDateString("pt-BR", {
        weekday: "short",
        day: "numeric",
        month: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-accent rounded-lg border-2 border-dashed border-primary/30 h-[80px]"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group rounded-lg border border-border bg-card p-3 cursor-grab hover:shadow-md hover:border-primary/20 transition-all ${
        isOverlay ? "cursor-grabbing shadow-xl rotate-1 scale-105 z-50" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground">
          <ExternalLink className="h-3 w-3" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5 border border-border">
            <AvatarFallback
              className={`${agent?.color || "bg-slate-500"} text-[8px] font-bold text-white`}
            >
              {agent?.initials || "??"}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{agent?.name || task.agent}</span>
        </div>
        {dateStr && (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-medium text-amber-700 dark:text-amber-400">
            <Calendar className="h-2.5 w-2.5" />
            {dateStr}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Kanban Column ──
function KanbanColumn({
  column,
  tasks,
  onAddTask,
}: {
  column: Column;
  tasks: Task[];
  onAddTask: (status: TaskStatus) => void;
}) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: { type: "Column", column },
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl ${column.color} min-h-[400px] border border-border/50`}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <span className={`h-2 w-2 rounded-full ${column.dot}`} />
          <h3 className="text-sm font-semibold">{column.title}</h3>
        </div>
        <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
          {tasks.length}
        </Badge>
      </div>

      <div className="flex-1 space-y-2 px-3 pb-2">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.length === 0 ? (
            <p className="text-center text-xs text-muted-foreground py-8">Sem tarefas</p>
          ) : (
            tasks.map((task) => <TaskCard key={task.id} task={task} />)
          )}
        </SortableContext>
      </div>

      <button
        onClick={() => onAddTask(column.id)}
        className="flex items-center justify-center gap-1.5 border-t border-border/50 px-4 py-2.5 text-xs text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-b-xl"
      >
        <Plus className="h-3 w-3" />
        Adicionar tarefa
      </button>
    </div>
  );
}

// ── New Task Modal (inline simple) ──
function NewTaskModal({
  status,
  onClose,
  onSave,
}: {
  status: TaskStatus;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}) {
  const [title, setTitle] = useState("");
  const [agent, setAgent] = useState(agents[0].id);
  const [priority, setPriority] = useState<"Alta" | "Média" | "Baixa">("Média");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      agent: agents.find((a) => a.id === agent)?.name || agent,
      priority,
      status,
      color: agents.find((a) => a.id === agent)?.color || "bg-slate-500",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-2xl space-y-4"
      >
        <h3 className="text-lg font-semibold">Nova Tarefa</h3>

        <div>
          <label className="text-xs font-medium text-muted-foreground">Título</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Descreva a tarefa..."
            autoFocus
            className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-medium text-muted-foreground">Agente</label>
            <select
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              {agents.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground">Prioridade</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as "Alta" | "Média" | "Baixa")}
              className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" size="sm" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-500 text-white">
            Criar Tarefa
          </Button>
        </div>
      </form>
    </div>
  );
}

// ── Main Page ──
export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [search, setSearch] = useState("");
  const [filterAgent, setFilterAgent] = useState("all");
  const [newTaskStatus, setNewTaskStatus] = useState<TaskStatus | null>(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("/api/tasks");
        const data = await res.json();
        if (Array.isArray(data)) setTasks(data);
      } catch (err) {
        console.error("Falha ao carregar tarefas:", err);
      }
    }
    fetchTasks();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === "Task";
    const isOverTask = over.data.current?.type === "Task";
    const isOverColumn = over.data.current?.type === "Column";

    if (!isActiveTask) return;

    if (isOverTask) {
      setTasks((prev) => {
        const ai = prev.findIndex((t) => t.id === activeId);
        const oi = prev.findIndex((t) => t.id === overId);
        if (prev[ai].status !== prev[oi].status) {
          prev[ai].status = prev[oi].status;
          updateTaskStatus(activeId as string, prev[oi].status);
        }
        return arrayMove(prev, ai, oi);
      });
    }

    if (isOverColumn) {
      setTasks((prev) => {
        const ai = prev.findIndex((t) => t.id === activeId);
        if (prev[ai].status !== overId) {
          const ns = overId as TaskStatus;
          const newTasks = [...prev];
          newTasks[ai] = { ...newTasks[ai], status: ns };
          updateTaskStatus(activeId as string, ns);
          return arrayMove(newTasks, ai, ai);
        }
        return prev;
      });
    }
  }

  function handleDragEnd() {
    setActiveTask(null);
  }

  async function updateTaskStatus(id: string, status: TaskStatus) {
    try {
      await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  }

  async function handleCreateTask(task: Partial<Task>) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
      });
      const data = await res.json();
      if (data && data.id) setTasks((prev) => [data, ...prev]);
    } catch (err) {
      console.error("Erro ao criar tarefa:", err);
    }
  }

  // Filtered tasks
  const filtered = tasks.filter((t) => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchAgent = filterAgent === "all" || t.agent === filterAgent;
    return matchSearch && matchAgent;
  });

  const activeCount = filtered.filter((t) => t.status !== "done").length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Hoje</p>
              <p className="text-sm font-semibold">$0.73</p>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Fev</p>
              <p className="text-sm font-semibold">$8.00</p>
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-5">
        {/* Tabs */}
        <div className="flex items-center gap-6 border-b border-border pb-3">
          <button className="text-sm font-medium text-primary border-b-2 border-primary pb-3 -mb-3">
            Tarefas
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground pb-3 -mb-3">
            Templates <Badge variant="secondary" className="ml-1 text-[10px]">0</Badge>
          </button>
          <button className="text-sm text-muted-foreground hover:text-foreground pb-3 -mb-3">
            Recorrentes <Badge variant="secondary" className="ml-1 text-[10px]">0</Badge>
          </button>
        </div>

        {/* Title & Actions */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Tarefas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {activeCount} ativas · {filtered.length} total
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button className="p-2 bg-accent text-foreground">
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button className="p-2 text-muted-foreground hover:text-foreground">
                <List className="h-4 w-4" />
              </button>
            </div>
            <Button
              size="sm"
              onClick={() => setNewTaskStatus("scheduled")}
              className="bg-blue-600 hover:bg-blue-500 text-white gap-1"
            >
              <Plus className="h-4 w-4" />
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar tarefas..."
              className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-muted-foreground"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={filterAgent}
              onChange={(e) => setFilterAgent(e.target.value)}
              className="appearance-none rounded-lg border border-border bg-background pl-8 pr-8 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="all">Todos os agentes</option>
              {agents.map((a) => (
                <option key={a.id} value={a.name}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Kanban Board */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={filtered.filter((t) => t.status === col.id)}
                onAddTask={(status) => setNewTaskStatus(status)}
              />
            ))}
          </div>

          <DragOverlay
            dropAnimation={{
              sideEffects: defaultDropAnimationSideEffects({
                styles: { active: { opacity: "0.5" } },
              }),
            }}
          >
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* New Task Modal */}
      {newTaskStatus && (
        <NewTaskModal
          status={newTaskStatus}
          onClose={() => setNewTaskStatus(null)}
          onSave={handleCreateTask}
        />
      )}
    </div>
  );
}
