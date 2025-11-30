// frontend/vite.config.js

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';

// Caminhos relativos para os arquivos SSL na pasta backend/
const CERT_PATH = '../backend/server.cert'; 
const KEY_PATH = '../backend/server.key'; 

export default defineConfig({
  plugins: [react()],
  server: {
    // Habilita HTTPS para o servidor de desenvolvimento do Vite
    https: {
      key: fs.readFileSync(KEY_PATH),
      cert: fs.readFileSync(CERT_PATH),
    },
    port: 5173,
  },
});