class Plugins {
    constructor(builder) {
        this._builder = builder;
        this._plugins = [];
    }

    addPlugin(plugin) {
        this._plugins.push(plugin);

        return this._builder;
    }

    build() {
        return this._plugins;
    }
}

module.exports = Plugins;
