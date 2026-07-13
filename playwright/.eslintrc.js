const path = require('node:path');

module.exports = {
    parserOptions: {
        tsconfigRootDir: path.resolve(__dirname, '..'),
        project: false,
    },
};
