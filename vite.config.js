import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // bind sur toutes les interfaces (évite les problèmes localhost IPv6)
    port: 5173,
    hmr: {
      protocol: 'ws',      // 'wss' si HTTPS
      host: 'localhost',  // laisser 'localhost' pour que le client utilise le bon nom
      port: 5173,
      clientPort: 5173,    // utile si le client se connecte via un reverse-proxy / VM
    },
    // https: true, // si tu sers en HTTPS -> hmr.protocol = 'wss'
  },
});
