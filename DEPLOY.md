# OpenDashboard — Atualização Free Tier

## Arquivos atualizados

```
lib/types.ts                      → Modelos e provedores atualizados (Google Free, NVIDIA Free, Modal Free)
app/api/usage/route.ts            → NOVA API para Maestro enviar dados de uso
app/usage/page.tsx                → Página de Uso reescrita com barras de quota
app/agents/page.tsx               → Página de Agentes com provedores corretos
components/billing/UsageStats.tsx → Dashboard principal com monitoramento de quota
supabase-migration.sql            → SQL para criar tabela api_usage no Supabase
```

## Deploy passo a passo

### 1. Supabase — criar tabela
Abra o SQL Editor do seu projeto Supabase e execute o conteúdo de `supabase-migration.sql`.

### 2. Substituir arquivos no repo
Copie cada arquivo para o caminho correspondente no repositório OpenDashboard:
```bash
cp lib/types.ts            → OpenDashboard/lib/types.ts
cp app/api/usage/route.ts  → OpenDashboard/app/api/usage/route.ts  (NOVA pasta)
cp app/usage/page.tsx       → OpenDashboard/app/usage/page.tsx
cp app/agents/page.tsx      → OpenDashboard/app/agents/page.tsx
cp components/billing/UsageStats.tsx → OpenDashboard/components/billing/UsageStats.tsx
```

### 3. Push e deploy
```bash
cd OpenDashboard
git add -A
git commit -m "feat: migrate to free tier monitoring - remove Antigravity, add quota tracking"
git push origin main
```
Vercel faz deploy automático.

### 4. Variáveis de ambiente na Vercel
Confirme que NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão configuradas no Vercel.

## Como o Maestro atualiza o dashboard

O Maestro faz POST para `/api/usage` com o JSON de uso:
```bash
curl -X POST https://open-dashboard-sigma.vercel.app/api/usage \
  -H "Content-Type: application/json" \
  -d '{
    "gemini_flash_text": {"requests_used": 45, "requests_limit": 200, "status": "OK"},
    "gemini_flash_image": {"images_generated": 3, "images_limit": 1500, "status": "OK"},
    "nvidia_kimi": {"requests_used": 8, "status": "OK"},
    "modal_glm5": {"requests_used": 0, "status": "RESERVA"},
    "alerts": []
  }'
```

O dashboard faz refresh automático a cada 30 segundos.
