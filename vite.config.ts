// File: sentiric-playground/vite.config.ts
import { defineConfig } from "vite";
import { resolve } from "path";
import { glob } from "glob";

const getEntries = () => {
  const entries = {
    main: resolve(__dirname, "index.html"),
  };
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
    __SDK_URL__: JSON.stringify(
      "https://sentiric.github.io/sentiric-stream-sdk/stream-sdk.js",
    ),
  },
  resolve: {
    alias: {
      "@lib": resolve(__dirname, "src/lib"),
      "@solutions": resolve(__dirname, "src/solutions"),
    },
  },
  build: {
    rollupOptions: {
      input: getEntries(),
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    outDir: "dist",
  },
});
