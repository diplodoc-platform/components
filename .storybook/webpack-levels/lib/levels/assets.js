const {getOption} = require('../utils');

function addRule(config, {imgFilename, fontFilename, limit, ruleIncludes, ruleExcludes}) {
    const imagesRule = {
        test: /\.(ico|bmp|gif|jpe?g|png|svg)$/,
        include: ruleIncludes,
        exclude: ruleExcludes,
        use: [
            {
                loader: require.resolve('url-loader'),
                options: {
                    limit: limit,
                    name: imgFilename,
                    fallback: 'file-loader',
                },
            },
        ],
    };
    const fontsRule = {
        test: /\.(ttf|eot|woff2?)$/,
        include: ruleIncludes,
        exclude: ruleExcludes,
        use: [
            {
                loader: require.resolve('url-loader'),
                options: {
                    limit: limit,
                    name: fontFilename,
                    fallback: 'file-loader',
                },
            },
        ],
    };

    config.module.addRule(imagesRule);
    config.module.addRule(fontsRule);
}

module.exports = function createAssetsLevel(options = {}) {
    const imgFilename = getOption(options.imgFilename, 'assets/img/[name].[hash:8].[ext]');
    const fontFilename = getOption(options.fontFilename, 'assets/fonts/[name].[hash:8].[ext]');
    const limit = getOption(options.limit, 8192); // 8kB
    const ruleIncludes = getOption(options.ruleIncludes);
    const ruleExcludes = getOption(options.ruleExcludes);

    return function assetsLevel(config) {
        addRule(config, {imgFilename, fontFilename, limit, ruleIncludes, ruleExcludes});
    };
};
