/*
    This file is part of RepQuest.

    RepQuest is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    RepQuest is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with RepQuest.  If not, see <https://www.gnu.org/licenses/>.
 */
import { sentryVitePlugin } from "@sentry/vite-plugin";
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import {VitePWA} from "vite-plugin-pwa";

export default defineConfig({
    base: '/',
    build: {
        outDir: "build"
    },
    plugins: [react(), VitePWA({
        registerType: 'autoUpdate',
        workbox: {
            maximumFileSizeToCacheInBytes: 3000000,
            globPatterns: ['**/*.{js,css,html,ico,png,svg}']
        },
        manifest: {
            "id": "net.marcsances.weightlog",
            "dir": "ltr",
            "orientation": "portrait",
            "short_name": "RepQuest",
            "name": "RepQuest",
            "description": "RepQuest is an online fitness tracking app.",
            "lang": "en",
            "icons": [
                {
                    "src": "favicon.ico",
                    "sizes": "64x64 32x32 24x24 16x16",
                    "type": "image/x-icon"
                },
                {
                    "src": "logo192.png",
                    "type": "image/png",
                    "sizes": "192x192"
                },
                {
                    "src": "logo512.png",
                    "type": "image/png",
                    "sizes": "512x512"
                }
            ],
            "start_url": ".",
            "display": "standalone",
            "theme_color": "#1F1F8B",
            "background_color": "#121212",
            "categories": ["fitness", "health", "health & fitness"]
        }
    }), sentryVitePlugin({
        org: "marc-sances",
        project: "javascript-react"
    })],
    server: {
        port: 3000
    }
})
