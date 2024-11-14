import { fileURLToPath, URL } from 'node:url'
import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  publicPath: '/ivanor-test-task/',
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  css: {
    preprocessorOptions: {
        stylus: {
          additionalData: `@import "${path.resolve(__dirname, 'src/assets/stylus/variables.styl')}" @import "${path.resolve(__dirname, 'src/assets/stylus/mixins.styl')}"`
        },
    },
  },
  build: {
    outDir: 'htdocs',
    emptyOutDir: true
  },
  server: {
    host: true
  }
})
