import { defineConfig } from '@tanstack/start/config';
import tailwindcss from '@tailwindcss/vite';
import tsConfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    vite: {
        plugins: [tsConfigPaths({projects: ['./tsconfig.json']}), tailwindcss()],
    }
});