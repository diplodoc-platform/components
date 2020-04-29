class Output {
    constructor(builder) {
        this._builder = builder;
    }

    setPath(path) {
        this._path = path;

        return this._builder;
    }

    setPublicPath(publicPath) {
        this._publicPath = publicPath;

        return this._builder;
    }

    setFilename(filename) {
        this._filename = filename;

        return this._builder;
    }

    setChunkFilename(chunkFilename) {
        this._chunkFilename = chunkFilename;

        return this._builder;
    }

    extend(data) {
        this._extend = this._extend || {};
        Object.assign(this._extend, data);

        return this._builder;
    }

    build() {
        return Object.assign({
            path: this._path,
            publicPath: this._publicPath,
            filename: this._filename,
            chunkFilename: this._chunkFilename,
        }, this._extend);
    }
}

module.exports = Output;
