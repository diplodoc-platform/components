import path from 'node:path';

import type {StorybookConfig} from '@storybook/react-vite';
import {mergeConfig} from 'vite';
import svgr from 'vite-plugin-svgr';

const sourceDir = path.join(import.meta.dirname, '../src');

const config: StorybookConfig = {
    framework: {
        name: '@storybook/react-vite',
        options: {},
    },
    stories: ['../demo/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    async viteFinal(config) {
        return mergeConfig(config, {
            plugins: [svgr({include: '**/*.svg'})],
            define: {
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
            },
            resolve: {
                dedupe: ['react', 'react-dom'],
                alias: [
                    {find: /^~(.*)$/, replacement: '$1'},
                    {
                        find: '@diplodoc/components/styles',
                        replacement: path.join(sourceDir, 'index.scss'),
                    },
                    {
                        find: '@diplodoc/components/i18n',
                        replacement: path.join(sourceDir, 'i18n'),
                    },
                    {
                        find: /^@diplodoc\/components\/themes\/(.*)$/,
                        replacement: path.join(sourceDir, 'themes/$1/index.scss'),
                    },
                    {
                        find: '@diplodoc/components',
                        replacement: sourceDir,
                    },
                ],
            },
            css: {
                preprocessorOptions: {
                    scss: {
                        api: 'modern',
                    },
                },
            },
        });
    },
};

export default config;
