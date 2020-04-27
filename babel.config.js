/* eslint-env node */
const env = process.env.BABEL_ENV || process.env.NODE_ENV || 'development';
const isEnvDevelopment = env === 'development';
const isEnvProduction = env === 'production';
const isEnvTest = env === 'test';

module.exports = {
    presets: [
        // Latest stable ECMAScript features
        (isEnvDevelopment || isEnvProduction) && [require.resolve('@babel/preset-env'), {}],
        // ES features necessary for current Node version
        isEnvTest && [require.resolve('@babel/preset-env'), Object.assign({}, {}, {
            targets: {
                node: 'current',
            },
        })],
        // JSX
        [require.resolve('@babel/preset-react'), {
            development: isEnvDevelopment || isEnvTest,
            useBuiltIns: true,
        }],
        [require.resolve('@babel/preset-typescript')],
    ].filter(Boolean),
    plugins: [
        // class { handleClick = () => { } }
        [require.resolve('@babel/plugin-proposal-class-properties'), {
            loose: true,
        }],
        // const { a, ...z } = { a: 1, b: 2, c: 3 }
        [require.resolve('@babel/plugin-proposal-object-rest-spread'), {
            useBuiltIns: true,
        }],
        [require.resolve('@babel/plugin-proposal-decorators'), {
            // @decorator
            // export class Foo {}
            decoratorsBeforeExport: true,
        }],
        // Polyfills the runtime needed for async/await and generators
        [require.resolve('@babel/plugin-transform-runtime'), {}],
        isEnvProduction && [require.resolve('babel-plugin-transform-react-remove-prop-types'), {
            removeImport: true,
        }],
        // function* () { yield 42; yield 43; }
        (isEnvDevelopment || isEnvProduction) && [require.resolve('@babel/plugin-transform-regenerator'), {
            // Async functions are converted to generators by @babel/preset-env
            async: false,
        }],
        // a?.b?.c
        require.resolve('@babel/plugin-proposal-optional-chaining'),
        // a ?? b;
        require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
        // Adds syntax support for import()
        require.resolve('@babel/plugin-syntax-dynamic-import'),
        // Compiles import() to a deferred require()
        isEnvTest && require.resolve('babel-plugin-dynamic-import-node'),
    ].filter(Boolean),
};
