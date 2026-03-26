import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  root: dirname(fileURLToPath(import.meta.url)),
  server: { port: 5199, strictPort: true },
});
