import type {StorybookConfig} from '@storybook/react-webpack5';

import {dirname} from 'node:path';
import sass from 'sass';

const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        {
            name: '@storybook/addon-styling',
            options: {
                sass: {
                    implementation: sass,
                },
            },
        },
        '@storybook/addon-onboarding',
        '@storybook/addon-interactions',
    ],
    framework: {
        name: '@storybook/react-webpack5',
        options: {},
    },
    docs: {
        autodocs: 'tag',
    },
    async webpackFinal(config) {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            react: dirname(require.resolve('react')),
            'react-dom': dirname(require.resolve('react-dom')),
        };
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        config.module.rules.push({
            test: /\.svg$/,
            type: 'javascript/auto',
            use: ['@svgr/webpack'],
        });

        return config;
    },
};

export default config;
