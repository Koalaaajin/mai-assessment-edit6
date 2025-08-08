// Vite configuration for the MAI survey application. This file sets up
// the React plugin and default settings for development and build.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});