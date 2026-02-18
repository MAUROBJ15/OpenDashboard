
// --- Tipos de Tarefa ---
export type Task = {
  id: string;
  title: string;
  agent: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: 'todo' | 'in-progress' | 'done';
  color: string;
  createdAt: string;
};
