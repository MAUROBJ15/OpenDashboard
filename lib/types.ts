
// --- Tipos de Tarefa ---
export type TaskStatus = 'scheduled' | 'queue' | 'in-progress' | 'done';

export type Task = {
  id: string;
  title: string;
  agent: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: TaskStatus;
  color: string;
  createdAt: string;
};
