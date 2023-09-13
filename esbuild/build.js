#!/usr/bin/env node

const autoprefixer = require('autoprefixer');
const esbuild = require('esbuild');
const {sassPlugin} = require('esbuild-sass-plugin');
const {resolve} = require('node:path');
const postcss = require('postcss');
const postcssPresetEnv = require('postcss-preset-env');

const {FileWatcher} = require('./FileWatcher');
const {SparsedBuild} = require('./SparsedBuild');

async function build({path, format}) {
    const tsconfig = require(`../tsconfig${format ? '.' + format : ''}.json`);
    const {
        compilerOptions: {target},
    } = tsconfig;

    const watcher = new FileWatcher(process.argv.indexOf('--watch') > -1);
    const sparsed = new SparsedBuild(
        async (entry) => {
            return esbuild.context({
                bundle: true,
                sourcemap: true,
                target: target,
                tsconfig: './tsconfig.json',
                entryPoints: [entry],
                outbase: './src',
                outdir: `./build${format ? '/' + format : ''}`,
                format: format,
                loader: {
                    '.json': 'text',
                },
                plugins: [
                    sparsed.plugin,
                    sassPlugin({
                        async transform(source) {
                            const {css} = await postcss([
                                autoprefixer({cascade: false}),
                                postcssPresetEnv({stage: 0}),
                            ]).process(source, {from: undefined});

                            return css;
                        },
                    }),
                ].filter(Boolean),
            });
        },
        {
            extension: {
                '.scss': '.css',
            },
        },
    );

    await sparsed.build(resolve(path));
    await watcher.watch(sparsed.files, sparsed.build, sparsed.dispose);
}

build({path: 'src/index.ts', format: 'cjs'});
build({path: 'src/index.ts', format: 'esm'});
build({path: 'src/index.scss'});
build({path: 'src/themes/common/index.scss'});
