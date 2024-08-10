module.exports = {
    extends: [
        '@gravity-ui/eslint-config',
        process.env.npm_command && '@gravity-ui/eslint-config/prettier',
    ].filter(Boolean),
    root: true,
    rules: {
        'no-param-reassign': 'off',
        '@typescript-eslint/no-shadow': 'off',
        'import/order': [
            'error',
            {
                alphabetize: {
                    order: 'asc',
                },
                'newlines-between': 'always',
                groups: ['type', ['builtin', 'external'], 'internal', 'parent', 'sibling', 'index'],
                warnOnUnassignedImports: true,
                pathGroups: [
                    {
                        pattern: '*.s?css$',
                        group: 'index',
                    },
                ],
            },
        ],
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
