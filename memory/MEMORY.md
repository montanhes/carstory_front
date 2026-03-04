# Moviu — Memória do Projeto

## Stack
- React 19 + TypeScript 5.9 (strict) + Vite 7
- Tailwind CSS 4 + DaisyUI 5 (temas: light/dark customizados — sem abyss)
- React Router DOM 7
- Axios com `withCredentials: true` e `withXSRFToken: true`

## Auth
- Laravel Sanctum **session-based** (cookies, NÃO JWT)
- CSRF via `/sanctum/csrf-cookie` antes de login/register
- `AuthContext` faz `authService.me()` no mount para checar sessão

## PWA
- Usa `vite-plugin-pwa` v1.x com Workbox
- `registerType: 'prompt'` — update prompt manual via `PWAUpdatePrompt.tsx`
- API routes (`/api/*`, `/sanctum/*`) usam `NetworkOnly` — crítico por ser session-based auth
- Assets estáticos são precacheados automaticamente via globPatterns
- Ícones em `public/icons/icon-192.svg` e `public/icons/icon-512.svg`
- Tipos do virtual module em `tsconfig.app.json` → `"vite-plugin-pwa/client"`
- `PWAUpdatePrompt` adicionado diretamente no `App.tsx` antes do `BrowserRouter`

## Temas
- `ThemeContext` salva em `localStorage` key `moviu_theme`
- Aplicado via `data-theme` no `<html>`
- Temas disponíveis: light, dark (customizados no index.css)
- Toggle de tema na navbar do Home e no DashboardLayout

## Estrutura de rotas
- `/` → Home (landing page pública)
- `/login`, `/register`, `/auth/callback` → auth público
- `/onboarding/plan` → seleção de plano (requer user, sem plano)
- `/dashboard/*` → ProtectedRoute + DashboardLayout
