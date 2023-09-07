module.exports = {
    extends: ['@gravity-ui/eslint-config'],
    root: true,
    rules: {
        'no-param-reassign': 'off',
    },
    overrides: [
        {
            files: ['!src/**/*', '!demo/**/*'],
            env: {
                node: true,
            },
        },
    ],
};
