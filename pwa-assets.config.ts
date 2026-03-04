import { defineConfig, minimalPreset } from '@vite-pwa/assets-generator/config'

export default defineConfig({
  preset: minimalPreset,
  images: ['public/icons/icon-512.svg'],
})
