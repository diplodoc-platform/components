const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const {getOption} = require('../utils');

const defaultVendorsList = [
    'react',
    'react-dom',
    'react-is',
    'redux',
    'react-redux',
    'lodash',
    'lodash-es',
    'moment',
    'scheduler',
    '@babel/runtime',
];

module.exports = function createOptimizeLevel(options = {}) {
    const vendors = getOption(options.vendors, true);
    const vendorsList = getOption(options.vendorsList, defaultVendorsList);
    const commons = getOption(options.commons, true);
    const minCommonsChunks = getOption(options.minCommonsChunks, 2);
    const runtimeChunk = getOption(options.runtimeChunk, true);
    const customCacheGroups = getOption(options.cacheGroups, {});
    const terser = getOption(options.terser);

    const cacheGroups = {
        default: false,
    };

    if (vendors) {
        cacheGroups.vendors = {
            name: 'vendors',
            test: new RegExp(`([\\\\/])node_modules\\1(${vendorsList.join('|')})\\1`),
            priority: Infinity,
        };
    } else {
        // Webpack by default has its own vendors cache group.
        // We don't want to use it.
        cacheGroups.vendors = false;
    }

    if (commons) {
        cacheGroups.commons = {
            name: 'commons',
            minChunks: minCommonsChunks,
        };
    }

    return function optimizeLevel(config) {
        if (config.isProduction) {
            config.optimization.extend({
                minimizer: [
                    new TerserWebpackPlugin({
                        sourceMap: config.sourceMap,
                        terserOptions: terser,
                    }),
                    new OptimizeCSSAssetsPlugin({
                        cssProcessorPluginOptions: {
                            preset: [
                                'default',
                                {
                                    svgo: false,
                                },
                            ],
                        },
                    }),
                ],
                splitChunks: {
                    chunks: 'all',
                    cacheGroups: {
                        ...cacheGroups,
                        ...customCacheGroups,
                    },
                },
                runtimeChunk: runtimeChunk ? 'single' : false,
            });
        }
    };
};
