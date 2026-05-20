import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const configuration = defineConfig({
	base: "./",
	plugins: [react(), babel({ presets: [reactCompilerPreset()] }), tailwindcss()],
	resolve: { tsconfigPaths: true },
});

export default configuration;
