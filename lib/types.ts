// --- Tipos de Tarefa ---
export type TaskStatus = 'scheduled' | 'queue' | 'in-progress' | 'done';
export type TaskPriority = 'Alta' | 'Média' | 'Baixa';

export type Task = {
  id: string;
  title: string;
  agent: string;
  priority: TaskPriority;
  status: TaskStatus;
  color: string;
  created_at: string;
};

// --- Agentes ---
export type Agent = {
  id: string;
  name: string;
  role: string;
  initials: string;
  color: string;
  model: string;
  status: 'online' | 'idle' | 'offline';
};

export const agents: Agent[] = [
  { id: 'maestro', name: 'Maestro', role: 'Coordenação', initials: 'MA', color: 'bg-blue-500', model: 'Gemini Pro High', status: 'online' },
  { id: 'rex', name: 'Rex', role: 'DevOps / Code', initials: 'RE', color: 'bg-emerald-500', model: 'Claude Opus 4.5', status: 'online' },
  { id: 'luna', name: 'Luna', role: 'Admin / Backup', initials: 'LU', color: 'bg-purple-500', model: 'Gemini Flash', status: 'idle' },
  { id: 'scout', name: 'Scout', role: 'Pesquisa', initials: 'SC', color: 'bg-slate-500', model: 'Gemini Flash', status: 'offline' },
  { id: 'pixel', name: 'Pixel', role: 'Design / UI', initials: 'PX', color: 'bg-pink-500', model: 'Gemini Pro High', status: 'online' },
  { id: 'hawk', name: 'Hawk', role: 'QA / Segurança', initials: 'HW', color: 'bg-amber-500', model: 'Gemini Pro High', status: 'online' },
  { id: 'marko', name: 'Marko', role: 'Marketing', initials: 'MK', color: 'bg-red-500', model: 'Gemini Pro High', status: 'idle' },
  { id: 'docu', name: 'Docu', role: 'Documentação', initials: 'DC', color: 'bg-cyan-500', model: 'Gemini Flash', status: 'offline' },
];
