import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0", // Hər yerdən gələn bağlantılara icazə verir
    port: 5175, // İstədiyiniz portu təyin edin
    allowedHosts: ["menu.khankishiyevravan.info"],
    proxy: {
      "/api": {
        target: "http://localhost:5002", // Backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        icon: true,
        // This will transform your SVG to a React component
        exportType: "named",
        namedExport: "ReactComponent",
      },
    }),
  ],
});
