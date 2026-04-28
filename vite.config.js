import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // This ensures the output folder is named 'dist'
    // Azure Static Web Apps looks for this folder by default
    outDir: 'dist',
  },
  server: {
    // This helps with testing locally on your phone
    host: true, 
    port: 3000
  }
})