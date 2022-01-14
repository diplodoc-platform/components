const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

module.exports = function createAnalyzeLevel(options = {}) {
    const defaultOptions = {
        openAnalyzer: false,
        analyzerMode: 'static',
        reportFilename: 'stats.html',
    };

    return function analyzeLevel(config) {
        if (options) {
            config.plugins.addPlugin(
                new BundleAnalyzerPlugin({
                    ...defaultOptions,
                    ...options,
                }),
            );
        }
    };
};
