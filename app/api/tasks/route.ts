
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ler todas as tarefas do Supabase
export async function GET() {
  try {
    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return NextResponse.json(tasks);
  } catch (error) {
    console.error('Erro ao ler tarefas:', error);
    return NextResponse.json({ error: 'Falha ao buscar tarefas' }, { status: 500 });
  }
}

// POST: Criar nova tarefa
export async function POST(req: NextRequest) {
  try {
    const newTask = await req.json();
    
    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          title: newTask.title,
          agent: newTask.agent,
          priority: newTask.priority,
          status: newTask.status,
          color: newTask.color
        }
      ])
      .select();

    if (error) throw error;
    
    return NextResponse.json(data[0], { status: 201 });
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    return NextResponse.json({ error: 'Falha ao criar tarefa' }, { status: 500 });
  }
}

// PUT: Atualizar status de uma tarefa
export async function PUT(req: NextRequest) {
  try {
    const { id, status } = await req.json();
    
    const { error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id);

    if (error) throw error;
    
    return NextResponse.json({ success: true });
  } catch (error) {
     console.error('Erro ao atualizar tarefa:', error);
     return NextResponse.json({ error: 'Falha ao atualizar tarefa' }, { status: 500 });
  }
}
