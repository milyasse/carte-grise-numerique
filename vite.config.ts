import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Le chemin de base correspond au nom du dépôt GitHub (GitHub Pages : https://<compte>.github.io/<depot>/).
// Il peut être surchargé par la variable BASE_PATH (utilisée par le workflow de déploiement).
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH ?? "/carte-grise-numerique/",
});
