import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['icons/*.svg'],
      manifest: {
        name: 'Moviu',
        short_name: 'Moviu',
        description: 'Gestão inteligente de veículos',
        lang: 'pt-BR',
        theme_color: '#4ade80',
        background_color: '#111714',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: 'icons/icon-192.svg',
            sizes: '192x192',
            type: 'image/svg+xml',
            purpose: 'any',
          },
          {
            src: 'icons/icon-512.svg',
            sizes: '512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // SPA: todas as navegações servem o index.html do cache
        navigateFallback: 'index.html',
        // Não interceptar rotas da API como navegação
        navigateFallbackDenylist: [/^\/api/, /^\/sanctum/],
        // Precache de todos os assets do build
        globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2}'],
        runtimeCaching: [
          {
            // API Laravel — NUNCA cachear (auth por sessão/cookie)
            urlPattern: ({ url }) => url.pathname.startsWith('/api'),
            handler: 'NetworkOnly',
          },
          {
            // CSRF cookie do Sanctum — NUNCA cachear
            urlPattern: ({ url }) => url.pathname.startsWith('/sanctum'),
            handler: 'NetworkOnly',
          },
          {
            // Imagens externas — cache por 30 dias
            urlPattern: /\.(?:png|jpg|jpeg|gif|webp|ico)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
          {
            // Fontes externas (Google Fonts, etc.)
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'fonts',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
    }),
  ],
})
