const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const {getOption} = require('../utils');

function addRules(config, {browsers, extract, ruleIncludes, ruleExcludes, paths}) {
    const styleLoader = {
        loader: require.resolve('style-loader'),
    };
    const cssLoader = {
        loader: require.resolve('css-loader'),
        options: {
            sourceMap: config.sourceMap,
            importLoaders: 2,
        },
    };
    const postcssLoader = {
        loader: require.resolve('postcss-loader'),
        options: {
            sourceMap: config.sourceMap,
            plugins: [
                autoprefixer({browsers}),
            ],
        },
    };
    const sassLoader = {
        loader: require.resolve('sass-loader'),
        options: {
            sourceMap: config.sourceMap,
            sassOptions: {
                includePaths: paths,
            },
        },
    };
    const stylusLoader = {
        loader: require.resolve('stylus-loader'),
        options: {
            sourceMap: config.sourceMap,
            paths: paths,
        },
    };
    const resolveUrlLoader = {
        loader: require.resolve('resolve-url-loader'),
        options: {
            sourceMap: config.sourceMap,
        },
    };

    const sassRule = {
        test: /\.s?css$/,
        include: ruleIncludes,
        exclude: ruleExcludes,
        use: [
            cssLoader,
            postcssLoader,
            resolveUrlLoader,
            sassLoader,
        ],
    };
    const stylusRule = {
        test: /\.styl$/,
        include: ruleIncludes,
        exclude: ruleExcludes,
        use: [
            cssLoader,
            postcssLoader,
            stylusLoader,
        ],
    };

    if (config.isProduction && extract) {
        sassRule.use.unshift(MiniCSSExtractPlugin.loader);
        stylusRule.use.unshift(MiniCSSExtractPlugin.loader);
    } else {
        sassRule.use.unshift(styleLoader);
        stylusRule.use.unshift(styleLoader);
    }

    config.module.addRule(sassRule);
    config.module.addRule(stylusRule);
}

function addPlugins(config, {filename}) {
    config.plugins.addPlugin(new MiniCSSExtractPlugin({
        filename: config.isProduction ? filename : '[name].css',
        chunkFilename: config.isProduction ? filename : '[name].css',
    }));
}

module.exports = function createStylesLevel(options = {}) {
    const filename = getOption(options.filename, 'css/[name].[contenthash:8].css');
    const extract = getOption(options.extract, true);
    const browsers = getOption(options.browsers);
    const ruleIncludes = getOption(options.ruleIncludes);
    const ruleExcludes = getOption(options.ruleExcludes);
    const paths = getOption(options.paths);

    return function stylesLevel(config) {
        addRules(config, {filename, extract, browsers, ruleIncludes, ruleExcludes, paths});
        addPlugins(config, {filename});
    };
};
