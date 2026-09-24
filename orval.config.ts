import { defineConfig } from "orval";

export default defineConfig({
  zefir: {
    output: {
      workspace: "./src/api",
      target: "./zefir.ts",
      schemas: "./model",
      mode: "tags-split",
      client: "swr",
      mock: true,
    },
    input: {
      target: "https://dom.zefir.app/api/openapi.json", // @TODO: Replace with up to date BE openapi URL
    },
  },
});
