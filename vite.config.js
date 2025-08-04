import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        cleanupOutdatedCaches: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      },
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'wine-4851696.png'],
      manifest: {
        name: 'SacaRolha - Cadastro de Vinhos',
        short_name: 'SacaRolha',
        description: 'Aplicativo para gerenciamento e cadastro de vinhos da sua confraria',
        theme_color: '#395a4f',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: 'wine-4851696.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'wine-4851696.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Cadastrar Vinho',
            short_name: 'Cadastrar',
            description: 'Cadastre um novo vinho na sua coleção',
            url: '/cadastrar',
            icons: [{ src: 'wine-4851696.png', sizes: '96x96' }]
          },
          {
            name: 'Ver Coleção',
            short_name: 'Listagem',
            description: 'Visualize todos os vinhos cadastrados',
            url: '/listagem',
            icons: [{ src: 'wine-4851696.png', sizes: '96x96' }]
          }
        ],
        categories: ['food', 'lifestyle', 'productivity'],
        lang: 'pt-BR'
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  server: {
    host: true,
  },
})
