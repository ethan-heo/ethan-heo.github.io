// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwindcss from "@tailwindcss/vite";
import sitemap from "@astrojs/sitemap";
import robots from "astro-robots-txt";

// https://astro.build/config
export default defineConfig({
    site: "https://ethan-heo.github.io",
    integrations: [react(), sitemap(), robots()],
    vite: {
        plugins: [tailwindcss()],
    },
});
