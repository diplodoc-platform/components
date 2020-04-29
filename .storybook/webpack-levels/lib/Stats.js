class Stats {
    constructor(builder) {
        this._builder = builder;
    }

    set(stats) {
        this._stats = stats;

        return this._builder;
    }

    build() {
        return this._stats;
    }
}

module.exports = Stats;
