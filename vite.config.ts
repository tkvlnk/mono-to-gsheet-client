import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  server:{
    port: 3000,
    host: '127.0.0.1',
    https: true
  }
})
