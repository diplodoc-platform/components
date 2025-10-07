import type {StorybookConfig} from '@storybook/react-webpack5';

import {dirname, join} from 'node:path';
import sass from 'sass';

type RuleSetRule = {
    test: RegExp;
    use: Loader[];
};

type Loader = {
    loader: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options: Record<string, any>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isRuleSet(rule: any): rule is RuleSetRule {
    return rule && rule.test;
}

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
            '@diplodoc/components': dirname(dirname(__dirname)),
        };
        config.module = config.module || {};
        config.module.rules = config.module.rules || [];
        config.module.rules.push({
            test: /\.svg$/,
            type: 'javascript/auto',
            use: ['@svgr/webpack'],
        });

        const sassRule = config.module.rules.find((rule) => {
            if (!isRuleSet(rule)) {
                return false;
            }

            return rule && rule?.test && rule.test.test('test.scss');
        }) as RuleSetRule;

        const sassLoader = sassRule
            ? sassRule.use.find((loader) => {
                  return loader.loader.match('sass-loader');
              })
            : null;

        if (sassLoader) {
            sassLoader.options = sassLoader.options || {};
            sassLoader.options.api = 'modern';
            sassLoader.options.sassOptions = sassLoader.options.sassOptions || {};
            sassLoader.options.sassOptions.loadPaths = [
                join(dirname(require.resolve('@diplodoc/transform/package.json')), 'dist/scss'),
                join(__dirname, '../node_modules'),
                dirname(dirname(__dirname)), // Корень проекта для @diplodoc/components
            ];
        }

        return config;
    },
};

export default config;
