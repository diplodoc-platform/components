const path = require('node:path');

module.exports = {
    extends: require.resolve('@diplodoc/infra/eslint-config/client'),
    parserOptions: {
        tsconfigRootDir: path.resolve(__dirname, '..'),
        project: false,
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
    },
};
