// File: sentiric-playground/vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";
import pkg from "./package.json";

const getEntries = () => {
  const entries = { main: resolve(__dirname, "index.html") };
  const solutionFiles = glob.sync("src/solutions/**/index.html");
  solutionFiles.forEach((file) => {
    const parts = file.split("/");
    const name = parts[parts.length - 2];
    entries[name] = resolve(__dirname, file);
  });
  return entries;
};

export default defineConfig({
  base: "/sentiric-playground/",
  define: {
    // Merkezi Konfigürasyon ve Versiyon Bilgileri
    __SDK_URL__: JSON.stringify("https://sentiric.github.io/sentiric-stream-sdk/stream-sdk.js"),
    __GATEWAY_URL__: JSON.stringify(process.env.VITE_GATEWAY_URL || "wss://http-stream-gateway-service-sentiric.azmisahin.com/ws"),
    __DEFAULT_TENANT__: JSON.stringify("demo"),
    __PG_VERSION__: JSON.stringify(pkg.version)
  },
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "src/lib"),
      "@solutions": resolve(__dirname, "src/solutions"),
    },
  },
  build: {
    rollupOptions: { input: getEntries() },
    minify: "terser",
    outDir: "dist",
  },
});