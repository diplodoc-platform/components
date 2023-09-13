const assert = require('node:assert');
const {statSync, existsSync} = require('node:fs');
const {join, resolve, extname} = require('node:path');

const INLINE_LOADERS = ['text', 'binary', 'base64', 'dataurl'];

const inlinedFiles = (loader) => {
    const inline = Object.keys(loader).filter((ext) => {
        return INLINE_LOADERS.includes(loader[ext]);
    });

    return (file) => inline.includes(extname(file));
};

class SparsedBuild {
    constructor(context, {extension} = {}) {
        extension = Object.assign(
            {
                '.ts': '.js',
                '.tsx': '.js',
                '.json': '.js',
            },
            extension,
        );

        this._context = context;

        this._files = new Map();

        this.plugin = {
            name: 'SparsedBuild',
            setup: ({onResolve, initialOptions}) => {
                const {
                    bundle,
                    loader = {},
                    resolveExtensions = ['.tsx', '.ts', '.jsx', '.js', '.css', '.json'],
                } = initialOptions;

                assert(bundle === true, `Option 'bundle' should be 'true' for sparsed build`);

                const shouldSkip = inlinedFiles(loader);

                onResolve({filter: /.*/}, async ({path, resolveDir, kind}) => {
                    if (kind === 'entry-point') {
                        return {};
                    }

                    // TODO: resolve ts aliases
                    if (!path.match(/^\.{1,2}/)) {
                        return {external: true};
                    }

                    const fullpath = resolveFile(
                        resolve(resolveDir, path),
                        resolveExtensions,
                        true,
                    );

                    if (shouldSkip(fullpath)) {
                        return {};
                    }

                    if (!this._has(fullpath)) {
                        await this.build(fullpath);
                    }

                    return {
                        path: replaceExt(path, extension),
                        external: true,
                    };
                });
            },
        };
    }

    get files() {
        return [...this._files.keys()];
    }

    build = async (file) => {
        const state = await this._add(file);

        if (state.build) {
            state.queued = true;
        } else {
            state.queued = false;
            // eslint-disable-next-line consistent-return
            state.build = state.context.rebuild().then(() => {
                state.build = null;

                if (state.queued) {
                    return this.build(file);
                }
            });
        }

        return state.build;
    };

    dispose = (file) => {
        const state = this._get(file);

        if (state) {
            state.build = null;
            state.queued = false;
            state.context.dispose();
            this._delete(file);
        }
    };

    async _add(file) {
        if (this._has(file)) {
            return this._get(file);
        }

        const state = {
            build: null,
            queued: false,
            context: await this._context(file),
        };

        this._files.set(file, state);

        return state;
    }

    _has(file) {
        return this._files.has(file);
    }

    _get(file) {
        return this._files.get(file);
    }

    _delete(file) {
        this._files.delete(file);
    }
}

function resolveFile(path, exts, strict) {
    const isFileExists = existsSync(path);
    const isLikeFile = exts.some((ext) => path.endsWith(ext));

    if (isFileExists) {
        const stat = statSync(path);

        if (stat.isFile()) {
            return path;
        } else if (!isLikeFile && stat.isDirectory()) {
            for (const ext of exts) {
                const file = resolveFile(join(path, 'index' + ext), exts);
                if (file) {
                    return file;
                }
            }
        }
    } else if (!isLikeFile) {
        for (const ext of exts) {
            const file = resolveFile(path + ext, exts);
            if (file) {
                return file;
            }
        }
    }

    if (strict) {
        // throw ENOENT
        return statSync(path);
    } else {
        return null;
    }
}

function replaceExt(path, extensions) {
    for (const [from, to] of Object.entries(extensions)) {
        if (path.endsWith(from)) {
            const parts = path.split(from).slice(0, -1);

            return parts.concat(parts.pop() + to).join(from);
        }
    }

    return path;
}

module.exports = {
    SparsedBuild,
};
