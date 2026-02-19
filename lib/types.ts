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

export const agents = [
  { id: 'maestro', name: 'Maestro', role: 'Squad Lead', model: 'Gemini 3 Pro High', color: 'bg-blue-500', status: 'Online' },
  { id: 'rex', name: 'Rex', role: 'Lead Developer', model: 'Claude Opus 4.5', color: 'bg-red-500', status: 'Online' },
  { id: 'scout', name: 'Scout', role: 'Research', model: 'Gemini 3 Flash', color: 'bg-green-500', status: 'Online' },
  { id: 'pixel', name: 'Pixel', role: 'UX/UI Design', model: 'Gemini 3 Pro High', color: 'bg-purple-500', status: 'Online' },
  { id: 'hawk', name: 'Hawk', role: 'Security & QA', model: 'Gemini 3 Pro High', color: 'bg-yellow-500', status: 'Online' },
  { id: 'luna', name: 'Luna', role: 'Personal Assistant', model: 'Gemini 3 Flash', color: 'bg-pink-500', status: 'Online' },
  { id: 'marko', name: 'Marko', role: 'Marketing', model: 'Gemini 3 Pro High', color: 'bg-orange-500', status: 'Online' },
  { id: 'docu', name: 'Docu', role: 'Documentation', model: 'Gemini 3 Flash', color: 'bg-cyan-500', status: 'Online' },
];
