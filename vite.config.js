import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'icon.png', 'og-image.png', 'robots.txt'],
      manifest: {
        name: 'Pankaj Typing',
        short_name: 'Pankaj Typing',
        description: 'Free touch typing tutor and speed test. Learn touch typing step by step from the home row to 60+ WPM.',
        theme_color: '#1F6F54',
        background_color: '#FAFAF7',
        display: 'standalone',
        icons: [
          {
            src: 'icon.png',
            sizes: '256x256',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      }
    })
  ],
  base: './',
  server: {
    port: 5173,
    host: true
  }
});
