const {ensureArray} = require('./utils');

class Resolve {
    constructor(builder) {
        this._builder = builder;
        this._defaultModules = ['node_modules'];
        this._modules = [];
        this._defaultExtensions = ['.js', '.jsx', '.json'];
        this._extensions = [];
    }

    addModules(paths) {
        paths = ensureArray(paths);
        this._modules = this._modules.concat(paths);

        return this._builder;
    }

    addAliases(aliases) {
        this._aliases = this._aliases || {};
        Object.assign(this._aliases, aliases);

        return this._builder;
    }

    addExtensions(extensions) {
        extensions = ensureArray(extensions);
        this._extensions = this._extensions.concat(extensions);

        return this._builder;
    }

    extend(data) {
        this._extend = this._extend || {};
        Object.assign(this._extend, data);

        return this._builder;
    }

    build() {
        return Object.assign({
            modules: this._modules.concat(this._defaultModules),
            alias: this._aliases,
            extensions: this._extensions.concat(this._defaultExtensions),
        }, this._extend);
    }
}

module.exports = Resolve;
