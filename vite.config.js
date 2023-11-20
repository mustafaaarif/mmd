import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import fs from 'fs/promises';
import svgr from '@svgr/rollup';

// https://vitejs.dev/config/

export default defineConfig(({ command, mode }) => {

    const env = loadEnv(mode, process.cwd(), '');

    return {
        server: {
            hmr: {
                overlay: false
            }
        },

        define: {
            'process.env.REACT_APP_API_URL_BASE': JSON.stringify(env.REACT_APP_API_URL_BASE),
            'process.env.REACT_APP_X_API_KEY': JSON.stringify(env.REACT_APP_X_API_KEY),
            'process.env.REACT_APP_POLICY_LINK': JSON.stringify(env.REACT_APP_POLICY_LINK),
            'process.env.REACT_APP_TERMS': JSON.stringify(env.REACT_APP_TERMS),
            'process.env.REACT_APP_INTERCOM_APP_ID': JSON.stringify(env.REACT_APP_INTERCOM_APP_ID),
            'process.env.REACT_APP_GA_TRACKING_ID': JSON.stringify(env.REACT_APP_GA_TRACKING_ID),
            'process.env.REACT_APP_MUSIC_LINK_URL': JSON.stringify(env.REACT_APP_MUSIC_LINK_URL),
            'process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID': JSON.stringify(env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID),
            'process.env.REACT_APP_DROPBOX_APP_KEY': JSON.stringify(env.REACT_APP_DROPBOX_APP_KEY),
            'process.env.REACT_APP_WEB_SOCKET_URL': JSON.stringify(env.REACT_APP_WEB_SOCKET_URL)
        },
        resolve: {
            alias: {
                src: resolve(__dirname, 'src'),
            },
        },
        esbuild: {
            loader: 'jsx',
            include: /src\/.*\.jsx?$/,
            exclude: [],
        },
        optimizeDeps: {
            exclude: ['js-big-decimal'],
            esbuildOptions: {
                plugins: [
                    {
                        name: 'load-js-files-as-jsx',
                        setup(build) {
                            build.onLoad(
                                { filter: /src\\.*\.js$/ },
                                async (args) => ({
                                    loader: 'jsx',
                                    contents: await fs.readFile(args.path, 'utf8'),
                                })
                            );
                        },
                    },
                ],
            },
        },

        // plugins: [react(),svgr({
        //   exportAsDefault: true
        // })],
        plugins: [svgr(), react()],
    };
});