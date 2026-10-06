import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  base: "/",
  root: "./src",
  publicDir: "../public",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rolldownOptions: {
      input: {
        main: resolve(import.meta.dirname, 'src/index.html'),
        gameSettings: resolve(import.meta.dirname, 'src/pages/game-settings.html'),
        game: resolve(import.meta.dirname, 'src/pages/game.html'),
        gameOver: resolve(import.meta.dirname, 'src/pages/game-over.html'),
        draw: resolve(import.meta.dirname, 'src/pages/draw.html'),
        winScreen: resolve(import.meta.dirname, 'src/pages/win-screen.html'),
      },
    },
  },
});