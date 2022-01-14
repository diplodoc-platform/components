const webpack = require('webpack');
const FortTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const {getOption, setOutput} = require('../utils');

function addRule(
    config,
    {
        browsers,
        langs,
        bemLevels,
        ruleIncludes,
        ruleExcludes,
        reactHotLoader,
        cacheLoader,
        threadLoader,
        typescript,
    },
) {
    const envConfig = {
        targets: browsers,
        modules: false,
    };

    const jsRule = {
        test: typescript ? /\.[jt]sx?$/ : /\.jsx?$/,
        include: ruleIncludes,
        exclude: ruleExcludes,
        use: [
            {
                loader: require.resolve('babel-loader'),
                options: {
                    plugins: [reactHotLoader && require.resolve('react-hot-loader/babel')].filter(
                        Boolean,
                    ),
                    sourceType: 'unambiguous',
                    cacheDirectory: config.isDevelopment,
                    compact: config.isProduction,
                },
            },
        ],
    };

    if (threadLoader) {
        jsRule.use.unshift({
            loader: require.resolve('thread-loader'),
            options: {
                workers: require('os').cpus().length - 1,
            },
        });
    }

    if (cacheLoader) {
        jsRule.use.unshift({
            loader: require.resolve('cache-loader'),
        });
    }

    config.module.addRule(jsRule);
}

function addPlugins(config, {langs, buildLang, typescript, forkTsChecker}) {
    config.plugins.addPlugin(
        new webpack.ContextReplacementPlugin(
            /moment[\\/]locale$/,
            new RegExp(`^\\./(${langs.join('|')})$`),
        ),
    );

    if (typescript) {
        config.plugins.addPlugin(
            new FortTsCheckerWebpackPlugin({
                checkSyntacticErrors: true,
                useTypescriptIncrementalApi: true,
                ...forkTsChecker,
            }),
        );
    }
}

function addResolve(config, {reactHotLoader, typescript}) {
    if (reactHotLoader && config.isDevelopment) {
        config.resolve.addAliases({
            'react-dom': require.resolve('@hot-loader/react-dom'),
        });
    }

    if (typescript) {
        config.resolve.addExtensions(['.ts', '.tsx']);
    }
}

module.exports = function createJavascriptLevel(options = {}) {
    const filename = getOption(options.filename, 'js/[name].[chunkhash:8].js');
    const chunkFilename = getOption(options.chunkFilename, filename);
    const browsers = getOption(options.browsers);
    const langs = getOption(options.langs, ['ru']);
    const bemLevels = getOption(options.bemLevels, []);
    const typescript = getOption(options.typescript, false);
    const buildLang = getOption(options.buildLang, 'ru');
    const ruleIncludes = getOption(options.ruleIncludes);
    const ruleExcludes = getOption(options.ruleExcludes);
    const reactHotLoader = getOption(options.reactHotLoader, true);
    const cacheLoader = getOption(options.cacheLoader, true);
    const threadLoader = getOption(options.threadLoader, true);
    const forkTsChecker = getOption(options.forkTsChecker, {});

    return function javascriptLevel(config) {
        setOutput(config, {filename, chunkFilename});
        addRule(config, {
            browsers,
            langs,
            bemLevels,
            ruleIncludes,
            ruleExcludes,
            reactHotLoader,
            cacheLoader,
            threadLoader,
            typescript,
        });
        addPlugins(config, {langs, buildLang, typescript, forkTsChecker});
        addResolve(config, {typescript, reactHotLoader});
    };
};
