export type TaskStatus = 'scheduled' | 'queue' | 'in-progress' | 'done';

export type Task = {
  id: string;
  title: string;
  agent: string;
  priority: 'Alta' | 'Média' | 'Baixa';
  status: TaskStatus;
  color: string;
  createdAt?: string;
  created_at?: string; // Adicionado para compatibilidade com o banco
};

export const agents = [
  { id: 'maestro', name: 'Maestro', initials: 'MA', role: 'Squad Lead', model: 'Gemini 3 Pro High', color: 'bg-blue-500', status: 'online' },
  { id: 'rex', name: 'Rex', initials: 'RX', role: 'Lead Developer', model: 'Claude Opus 4.5', color: 'bg-red-500', status: 'online' },
  { id: 'scout', name: 'Scout', initials: 'SC', role: 'Research', model: 'Gemini 3 Flash', color: 'bg-green-500', status: 'online' },
  { id: 'pixel', name: 'Pixel', initials: 'PX', role: 'UX/UI Design', model: 'Gemini 3 Pro High', color: 'bg-purple-500', status: 'online' },
  { id: 'hawk', name: 'Hawk', initials: 'HK', role: 'Security & QA', model: 'Gemini 3 Pro High', color: 'bg-yellow-500', status: 'online' },
  { id: 'luna', name: 'Luna', initials: 'LN', role: 'Personal Assistant', model: 'Gemini 3 Flash', color: 'bg-pink-500', status: 'online' },
  { id: 'marko', name: 'Marko', initials: 'MK', role: 'Marketing', model: 'Gemini 3 Pro High', color: 'bg-orange-500', status: 'online' },
  { id: 'docu', name: 'Docu', initials: 'DC', role: 'Documentation', model: 'Gemini 3 Flash', color: 'bg-cyan-500', status: 'online' },
];
