import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET: Ler dados de uso atuais
export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('api_usage')
      .select('*')
      .eq('date', today)
      .single();

    if (error && error.code === 'PGRST116') {
      // Nenhum registro para hoje — retorna defaults
      return NextResponse.json({
        date: today,
        gemini_flash_text: { requests_used: 0, requests_limit: 200, status: 'OK' },
        gemini_flash_image: { images_generated: 0, images_limit: 1500, status: 'OK' },
        nvidia_kimi: { requests_used: 0, status: 'OK' },
        modal_glm5: { requests_used: 0, status: 'RESERVA' },
        alerts: [],
        last_updated: new Date().toISOString(),
      });
    }

    if (error) throw error;
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erro ao ler usage:', error);
    return NextResponse.json({ error: 'Falha ao buscar usage' }, { status: 500 });
  }
}

// POST: Maestro atualiza os dados de uso
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const today = new Date().toISOString().split('T')[0];

    const payload = {
      date: today,
      gemini_text_used: body.gemini_flash_text?.requests_used ?? 0,
      gemini_text_limit: body.gemini_flash_text?.requests_limit ?? 200,
      gemini_text_status: body.gemini_flash_text?.status ?? 'OK',
      gemini_image_used: body.gemini_flash_image?.images_generated ?? 0,
      gemini_image_limit: body.gemini_flash_image?.images_limit ?? 1500,
      gemini_image_status: body.gemini_flash_image?.status ?? 'OK',
      nvidia_used: body.nvidia_kimi?.requests_used ?? 0,
      nvidia_status: body.nvidia_kimi?.status ?? 'OK',
      modal_used: body.modal_glm5?.requests_used ?? 0,
      modal_status: body.modal_glm5?.status ?? 'RESERVA',
      alerts: body.alerts ?? [],
      last_updated: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('api_usage')
      .upsert(payload, { onConflict: 'date' })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error('Erro ao atualizar usage:', error);
    return NextResponse.json({ error: 'Falha ao atualizar usage' }, { status: 500 });
  }
}
