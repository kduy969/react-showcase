import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig((c) => {
  const config = {
    plugins: [react()],
    server: {
      host: true,
    },
    base: "/",
  };

  if (c.command !== "serve") {
    config.base = "/react-showcase/";
  }
  return config;
});
