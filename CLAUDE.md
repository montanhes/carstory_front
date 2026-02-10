# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CarStory is a vehicle management and maintenance tracking frontend application built with React 19, TypeScript, and Vite. It connects to a Laravel backend with Sanctum authentication.

## Development Commands

```bash
npm run dev      # Start development server with HMR
npm run build    # TypeScript check + production build
npm run lint     # ESLint check
npm run preview  # Preview production build
```

No test framework is currently configured.

## Architecture

### Core Stack
- React 19 with React Compiler (Babel plugin)
- TypeScript 5.9 (strict mode)
- Vite 7 for build/dev
- Tailwind CSS 4 + DaisyUI 5 (theme: "abyss")
- React Router DOM 7 for routing
- Axios for HTTP requests

### Project Structure

```
src/
├── components/     # Reusable UI (ProtectedRoute, VehicleFormModal)
├── contexts/       # React Context providers (AuthContext)
├── layouts/        # Page layouts (DashboardLayout with sidebar)
├── pages/          # Route components (Home, Login, Dashboard, Vehicles)
├── services/       # API layer (api.ts - centralized Axios instance)
└── assets/         # Static files
```

### Authentication Flow
- JWT stored in localStorage
- AuthContext provides global auth state (`user`, `loading`, `login`, `logout`)
- Request interceptor in `services/api.ts` auto-attaches Bearer token
- ProtectedRoute component guards authenticated routes
- CSRF cookie fetched from `/sanctum/csrf-cookie` before login (Laravel Sanctum)

### API Service Pattern
All API calls go through `services/api.ts` which exports:
- `apiService` - base Axios instance with auth interceptor
- `authService` - login, logout, getUser
- `vehicleService` - CRUD operations for vehicles
- `enumService` - fetch dropdown options (body types, fuel types, etc.)

### Environment
- `VITE_API_URL` - Backend API URL (defaults to `http://localhost`)

## Theme System

The app uses a React Context-based theme system that:
- Stores selected theme in localStorage (`carstory_theme`)
- Loads saved theme on app startup
- Applies theme via `data-theme` attribute on `<html>` element
- Provides theme selector in the sidebar (DashboardLayout)

**Available themes:** abyss, dark, light, dracula, cyberpunk, synthwave, retro, forest

**Theme Context:**
- Located at `src/contexts/ThemeContext.tsx`
- Wrapped around entire app in `App.tsx` (App > ThemeProvider > BrowserRouter > AuthProvider)
- Provides `useTheme()` hook with `{ theme, setTheme, themes }`

To add new themes, update the `AVAILABLE_THEMES` array in ThemeContext.tsx.

## Styling Conventions

- Utility-first with Tailwind CSS classes
- DaisyUI components: `btn`, `card`, `input`, `select`, `badge`, `alert`, etc.
- Responsive grids: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`
- Theme-aware colors: Use `bg-base-100`, `text-base-content`, etc. (not hardcoded colors)

## Responsive Design

The app is fully responsive for mobile, tablet, and desktop:

**Breakpoints used:**
- Mobile: default (< 640px)
- Tablet: `sm:` (≥ 640px), `md:` (≥ 768px)
- Desktop: `lg:` (≥ 1024px)

**Key responsive patterns:**
- Navigation: Hamburger menu drawer on mobile (using DaisyUI drawer), fixed sidebar on lg+ screens
- Forms: Responsive input/select/textarea sizes (`input-sm md:input-md`)
- Buttons: Responsive sizing (`btn-sm md:btn-md`)
- Layout: Drawer pattern for sidebar (DashboardLayout uses `drawer` and `drawer-open` classes)
- Spacing: Reduced padding on mobile, increased on desktop (`p-4 md:p-6`)
- Typography: Responsive text sizes (`text-sm md:text-base`)
