import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: "/EmpFrontend/",
  server :{
    port : 3001,
    open : true
  },
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        notfound: './404.html'
      }
    }
  }
})
