class Optimization {
    constructor(builder) {
        this._builder = builder;
    }

    set(optimization) {
        this._optimization = optimization;

        return this._builder;
    }

    extend(data) {
        this._optimization = this._optimization || {};
        Object.assign(this._optimization, data);

        return this._builder;
    }

    build() {
        return this._optimization;
    }
}

module.exports = Optimization;
