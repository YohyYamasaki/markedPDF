import {defineConfig, loadEnv} from "vite";
import react from "@vitejs/plugin-react";

// メモリ制限を増やす
process.env.NODE_OPTIONS = "--max-old-space-size=1024";

export default defineConfig(({mode}) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react()],
    define: {
      "process.env.REACT_APP_ENV_URL": JSON.stringify(env.REACT_APP_ENV_URL),
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
