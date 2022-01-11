/* eslint-env node */

module.exports = {
    globals: {
        window: true,
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.json',
        },
    },
    setupFilesAfterEnv: ['<rootDir>/jest/setup.js'],
    roots: ['<rootDir>/jest', '<rootDir>/src'],
    moduleDirectories: ['node_modules', '<rootDir>/jest'],
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
        '^.+\\.(ts|tsx)$': 'ts-jest',
        '^(?!.*\\.(js|jsx|ts|tsx|json)$)': '<rootDir>/jest/fileTransform.js',
    },
    transformIgnorePatterns: ['node_modules/'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
};
