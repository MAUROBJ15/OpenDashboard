-- =============================================
-- OpenMauro Dashboard — Tabela api_usage
-- Execute no Supabase SQL Editor
-- =============================================

-- Tabela principal de monitoramento de uso de API
CREATE TABLE IF NOT EXISTS api_usage (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  
  -- Gemini Flash Text (Maestro, Scout, Luna, Marko, Hawk, Docu)
  gemini_text_used INT DEFAULT 0,
  gemini_text_limit INT DEFAULT 200,
  gemini_text_status TEXT DEFAULT 'OK',
  
  -- Gemini Flash Image (Pixel)
  gemini_image_used INT DEFAULT 0,
  gemini_image_limit INT DEFAULT 1500,
  gemini_image_status TEXT DEFAULT 'OK',
  
  -- NVIDIA Kimi K2.5 (Rex)
  nvidia_used INT DEFAULT 0,
  nvidia_status TEXT DEFAULT 'OK',
  
  -- Modal GLM-5 (Fallback)
  modal_used INT DEFAULT 0,
  modal_status TEXT DEFAULT 'RESERVA',
  
  -- Alertas e metadata
  alerts JSONB DEFAULT '[]'::jsonb,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index para busca rápida por data
CREATE INDEX IF NOT EXISTS idx_api_usage_date ON api_usage(date);

-- Habilitar RLS (Row Level Security)
ALTER TABLE api_usage ENABLE ROW LEVEL SECURITY;

-- Policy: leitura pública (o dashboard lê)
CREATE POLICY "Permitir leitura pública" ON api_usage
  FOR SELECT USING (true);

-- Policy: escrita via service_role ou anon (o Maestro/API escreve)
CREATE POLICY "Permitir escrita" ON api_usage
  FOR ALL USING (true) WITH CHECK (true);

-- =============================================
-- Inserir registro de hoje como ponto de partida
-- =============================================
INSERT INTO api_usage (date) 
VALUES (CURRENT_DATE)
ON CONFLICT (date) DO NOTHING;
