import {join, dirname} from 'path';

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        '@storybook/addon-links',
        '@storybook/addon-essentials',
        {
            name: '@storybook/addon-styling',
            options: {
                sass: {
                    implementation: require("sass"),
                },
            }
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
    async webpackFinal(config, { configType }) {
        config.resolve = config.resolve || {};
        config.resolve.alias = {
            ...(config.resolve.alias || {}),
            'react': dirname(require.resolve('react')),
            'react-dom': dirname(require.resolve('react-dom')),
        };
        config.module.rules.push({
            test: /\.svg$/,
            type: 'javascript/auto',
            use: ['@svgr/webpack'],
        });

        return config;
    }
};

export default config;
