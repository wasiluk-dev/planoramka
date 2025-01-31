import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
    ],
    // TODO: change as needed
    server: {
        host: '127.0.0.1',
        port: 5173,
    },
    build: {
        target: 'esnext',
    },
});
