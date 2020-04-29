exports.getOption = function getOption(value, defaultValue) {
    if (typeof value === 'undefined') {
        return defaultValue;
    }

    return value;
};

exports.ensureArray = function ensureArray(value) {
    return Array.isArray(value) ? value : [value];
};


exports.setOutput = function setOutput(config, {filename, chunkFilename}) {
    const devName = '[name].js';

    config.output.setFilename(config.isProduction ? filename : devName);
    config.output.setChunkFilename(config.isProduction ? chunkFilename : devName);
};
