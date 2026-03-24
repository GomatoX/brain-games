import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vite.dev/config/
export default defineConfig(({ command, mode }) => {
  const isLibBuild = mode === "lib" || mode === "wordgame" || mode === "wordsearch";

  // Determine which game to build
  const gameConfigs = {
    lib: {
      entry: "src/crossword-engine.js",
      name: "CrosswordEngine",
      fileName: "crossword-engine",
    },
    wordgame: {
      entry: "src/word-game-engine.js",
      name: "WordGameEngine",
      fileName: "word-game-engine",
    },
    wordsearch: {
      entry: "src/word-search-engine.js",
      name: "WordSearchEngine",
      fileName: "word-search-engine",
    },
  };

  const gameConfig = gameConfigs[mode] || gameConfigs.lib;

  return {
    base: isLibBuild ? "/" : "/play/",
    plugins: [
      svelte({
        compilerOptions: {
          // Only enable customElement for library builds
          customElement: isLibBuild,
        },
      }),
    ],
    build: isLibBuild
      ? {
          emptyOutDir: false,
          lib: {
            entry: gameConfig.entry,
            name: gameConfig.name,
            fileName: gameConfig.fileName,
            formats: ["iife"],
          },
          rollupOptions: {
            output: {
              inlineDynamicImports: true,
            },
          },
        }
      : { outDir: "dist/play" },
    server: {
      cors: true,
      headers: {
        // Allow being framed by Directus for live preview
        "X-Frame-Options": "ALLOWALL",
        "Content-Security-Policy":
          "frame-ancestors 'self' http://localhost:8055 http://127.0.0.1:8055 http://localhost:3000",
      },
    },
  };
});
