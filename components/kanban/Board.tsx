"use client";

import React, { useState, useEffect } from 'react';
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
} from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Task, TaskStatus } from '@/lib/types'; // Importando tipo centralizado

// --- Types ---

type Column = {
  id: TaskStatus;
  title: string;
};

const columns: Column[] = [
  { id: 'scheduled', title: 'Agendadas' },
  { id: 'queue', title: 'Fila' },
  { id: 'in-progress', title: 'Em Progresso' },
  { id: 'done', title: 'Concluído' },
];

// --- Components ---

// 1. Sortable Task Card
function TaskCard({ task, isOverlay }: { task: Task; isOverlay?: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-slate-800 p-4 rounded-lg border-2 border-slate-700 h-[100px]"
      />
    );
  }

  return (
    <Card 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`bg-slate-900 border-slate-800 cursor-grab hover:border-slate-600 transition-colors mb-2 ${isOverlay ? 'cursor-grabbing shadow-2xl rotate-2 scale-105 z-50' : ''}`}
    >
      <CardHeader className="p-3 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-sm font-medium text-white line-clamp-2">{task.title}</CardTitle>
          <Badge variant={task.priority === "Alta" ? "destructive" : "secondary"} className="text-[10px] px-1 py-0 h-5">
            {task.priority}
          </Badge>
        </div>
        <CardDescription className="text-xs text-slate-400 mt-1 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${task.color}`}></span>
          {task.agent}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

// 2. Column (Droppable)
function KanbanColumn({ column, tasks }: { column: Column; tasks: Task[] }) {
  const { setNodeRef } = useDroppable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    },
  });

  return (
    <div ref={setNodeRef} className="flex flex-col bg-slate-950/50 rounded-lg p-4 min-h-[300px] border border-slate-900/50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-slate-300 text-sm uppercase tracking-wider">{column.title}</h3>
        <Badge variant="outline" className="bg-slate-900 text-slate-400 border-slate-800">{tasks.length}</Badge>
      </div>
      
      <div className="flex-1 flex flex-col gap-2">
        <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}

// 3. Main Board
export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>([]); // Estado inicial vazio, carrega via API
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // --- Efeito para Carregar Dados ---
  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error('Falha ao carregar tarefas:', error);
      }
    }
    fetchTasks();
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragStart(event: DragStartEvent) {
    if (event.active.data.current?.type === 'Task') {
      setActiveTask(event.active.data.current.task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'Task';
    const isOverTask = over.data.current?.type === 'Task';
    const isOverColumn = over.data.current?.type === 'Column';

    if (!isActiveTask) return;

    // Cenário 1: Arrastando sobre outra tarefa
    if (isActiveTask && isOverTask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        
        // Se estiverem em colunas diferentes, muda o status visualmente durante o drag
        if (tasks[activeIndex].status !== tasks[overIndex].status) {
          const newStatus = tasks[overIndex].status;
          tasks[activeIndex].status = newStatus;
          // Persistir no backend
          updateTaskStatus(activeId as string, newStatus);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // Cenário 2: Arrastando sobre uma coluna vazia
    if (isActiveTask && isOverColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        
        if (tasks[activeIndex].status !== overId) {
          const newStatus = overId as TaskStatus;
          const newTasks = [...tasks];
          newTasks[activeIndex] = { 
            ...newTasks[activeIndex], 
            status: newStatus 
          };
          
          // Persistir no backend
          updateTaskStatus(activeId as string, newStatus);
          
          return arrayMove(newTasks, activeIndex, activeIndex); 
        }
        
        return tasks;
      });
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null);
  }

  // --- Função para Atualizar Backend ---
  async function updateTaskStatus(taskId: string, newStatus: TaskStatus) {
    try {
      await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });
    } catch (error) {
      console.error('Erro ao salvar status:', error);
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 h-full min-h-[500px]">
        {columns.map((col) => (
          <KanbanColumn 
            key={col.id} 
            column={col} 
            tasks={tasks.filter((t) => t.status === col.id)} 
          />
        ))}
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}
