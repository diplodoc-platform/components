class Externals {
    constructor(builder) {
        this._builder = builder;
    }

    extend(data) {
        this._externals = this._externals || {};
        Object.assign(this._externals, data);

        return this._builder;
    }

    build() {
        return this._externals;
    }
}

module.exports = Externals;
