/* eslint-env node */
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Recreate __dirname for ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist/client",
    rollupOptions: {
      input: path.resolve(__dirname, "src/main_client.jsx"),
    },
  },
});
