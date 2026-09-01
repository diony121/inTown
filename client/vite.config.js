import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const serverPort = 3000;
console.log(`api needs to run on ${serverPort} for vite server`)
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": `http://localhost:${serverPort}`,
    },
  },
});