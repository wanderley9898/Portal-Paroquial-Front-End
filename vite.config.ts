import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },

  plugins: [
    tailwindcss(),
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.png", "logo.jpeg", "cover.png"],
      manifest: {
        id: "/",
        lang: "pt-BR",
        name: "Portal Paroquial",
        short_name: "Portal Paroquial",
        description:
          "Portal Paroquial é um aplicativo web progressivo (PWA) que oferece uma experiência imersiva e envolvente para os usuários, permitindo o acesso a informações e recursos relacionados à comunidade paroquial de forma rápida e conveniente.",
        theme_color: "#0B0B0F",
        background_color: "#14141C",
        display: "standalone",
        start_url: "/",
        scope: "/",
        orientation: "portrait",
        categories: ["education", "community", "social", "entertainment"],
        icons: [
          {
            src: "/favicon.png",
            sizes: "1024x1024",
            type: "image/png",
          },
          {
            src: "/logo.jpeg",
            sizes: "1024x1024",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
});
