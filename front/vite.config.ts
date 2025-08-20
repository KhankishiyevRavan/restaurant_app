import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // istədiyin port
    open: true, // istəsən avtomatik brauzer açar
  },
})