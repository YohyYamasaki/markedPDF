import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({mode}) =>{
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    define: {
      'process.env.REACT_APP_ENV_URL': JSON.stringify(env.REACT_APP_ENV_URL)
    },
    base: "/markedPDF/",
    server: {
      host: true,
      watch: {
        usePolling: true,
      },
    },
    resolve: {
      alias: {
        "@": "/src",
      },
    },
  };
});