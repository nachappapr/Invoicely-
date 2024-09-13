import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import { installGlobals } from "@remix-run/node";
import tsConfigPaths from "vite-tsconfig-paths";

installGlobals();
export default defineConfig({
  plugins: [remix(), tsConfigPaths()],
});
