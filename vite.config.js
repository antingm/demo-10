/**
 * ==========================================
 * Vite 設定檔
 * ==========================================
 * Anting Card 極速名片專案建置設定
 */

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        port: 3000,
        open: true
    },
    build: {
        outDir: 'dist',
        sourcemap: false
    }
});
