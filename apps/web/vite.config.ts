import { tamaguiPlugin } from "@tamagui/vite-plugin";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const config = defineConfig({
    server: {
        port: 3000,
    },
    resolve: { tsconfigPaths: true },
    optimizeDeps: {
        include: [
            "@tanstack/react-form",
            "react-native-web",
            "@tamagui/lucide-icons",
            "@tamagui/get-font-sized",
            "@tamagui/get-token",
        ],
    },
    plugins: [
        devtools(),
        tamaguiPlugin(),
        tailwindcss(),
        tanstackStart(),
        viteReact(),
    ],
});

export default config;
