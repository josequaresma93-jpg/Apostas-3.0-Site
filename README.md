# Apostas 4.0 Pro

Sistema web profissional para análise de jogos de futebol com Poisson, BTTS, Over/Under, Handicap, EV e Kelly.

## Estrutura

- `frontend/` — React + Vite para publicar na Vercel.
- `backend/` — FastAPI para publicar no Render.
- `data/` — base inicial em JSON.

## Rodar localmente

### Backend
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

No arquivo `frontend/.env.example`, copie para `.env` e ajuste:

```env
VITE_API_URL=http://localhost:8000
```

## Publicar grátis

- Frontend: Vercel
- Backend: Render
- Banco futuro: Supabase

## Próximas fases

1. Subir frontend na Vercel.
2. Subir backend no Render.
3. Conectar API de futebol.
4. Criar Supabase para histórico e usuários.
5. Criar rankings automáticos de oportunidades.
