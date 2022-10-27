'use strict';
const path = require('path');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const {ConfigBuilder, javascript, styles, assets, optimize} = require('./webpack-levels');

const srcRoot = path.resolve(__dirname, '..', 'src');
const stylesRoot = path.resolve(__dirname, '..', 'styles');
const assetsRoot = path.resolve(__dirname, '..', 'assets');
const storybookRoot = path.resolve(__dirname, '..', '.storybook');
const storybookHost = path.resolve(__dirname, '..', 'node_modules/storybook-host');
const yfmTransformDir = path.resolve(srcRoot, '../node_modules/@doc-tools/transform');
const uiKitDir = path.resolve(srcRoot, '../node_modules/@gravity-ui/uikit');

const ruleIncludes = [
    srcRoot,
    stylesRoot,
    assetsRoot,
    storybookRoot,
    storybookHost,
    yfmTransformDir,
    uiKitDir,
];

const config = new ConfigBuilder();

config
    .apply(
        javascript({
            bem: false,
            typescript: true,
            reactHotLoader: false,
            ruleIncludes,
        }),
    )
    .apply(
        styles({
            ruleIncludes,
        }),
    )
    .apply(
        assets({
            ruleIncludes,
            ruleExcludes: [path.resolve(assetsRoot, 'icons')],
        }),
    )
    .apply(optimize())
    .resolve.addModules(srcRoot)
    .module.addRule({
        test: /\.svg$/,
        include: [path.resolve(assetsRoot, 'icons')],
        loader: 'svg-sprite-loader',
        options: {
            extract: true,
            spriteFilename: 'sprite-[hash:6].svg',
        },
        exclude: [path.resolve(assetsRoot, 'icons')],
    })
    .module.addRule({
        test: /\.svg$/,
        loader: 'react-svg-loader',
        include: [path.resolve(assetsRoot, 'icons')],
        options: {
            svgo: {
                plugins: [
                    {
                        removeViewBox: false,
                    },
                ],
            },
        },
    })
    .plugins.addPlugin(new SpriteLoaderPlugin({plainSprite: true}));

const projectConfig = config.build();

module.exports = ({config: storybookBaseConfig}) => {
    storybookBaseConfig.module = projectConfig.module;
    storybookBaseConfig.resolve = projectConfig.resolve;

    // storybook-readme
    storybookBaseConfig.module.rules.push({
        test: /\.md$/,
        include: [path.resolve(__dirname, '..')],
        use: [{loader: 'html-loader'}, {loader: 'markdown-loader'}],
    });

    storybookBaseConfig.plugins.push(...projectConfig.plugins);

    return storybookBaseConfig;
};
