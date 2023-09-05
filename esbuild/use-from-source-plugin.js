const {dirname, relative, resolve} = require('node:path');

function useFromSourcePlugin(match) {
    return {
        name: 'useFromSource',
        setup(build) {
            const {outfile} = build.initialOptions;
            let {outdir, outbase = '.'} = build.initialOptions;
            outdir = resolve(outdir || dirname(outfile));
            outbase = resolve(outbase);

            build.onResolve({filter: match}, ({path, resolveDir, importer}) => {
                if (!path.match(/^\.{1,2}/)) {
                    return {external: true};
                }

                const outpath = resolve(outdir, relative(outbase, dirname(importer)));

                return {
                    external: true,
                    path: relative(outpath, resolve(resolveDir, path)),
                };
            });
        },
    };
}

module.exports = {
    useFromSourcePlugin,
};
