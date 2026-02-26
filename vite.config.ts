import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const viteConfig = defineConfig({
	base: "./",
	plugins: [react(), tailwindcss()],
});

// oxlint-disable-next-line import/no-default-export
export default viteConfig;
