const path = require('node:path');

module.exports = {
    extends: require.resolve('@diplodoc/infra/eslint-config/client'),
    parserOptions: {
        tsconfigRootDir: path.resolve(__dirname, '..'),
        project: false,
    },
    settings: {
        'import/resolver': {
            typescript: {
                project: path.resolve(__dirname, '../../tsconfig.storybook.json'),
            },
            node: true,
        },
    },
    rules: {
        'react/react-in-jsx-scope': 'off',
    },
};
