class Performance {
    constructor(builder) {
        this._builder = builder;
    }

    set(performance) {
        this._performance = performance;

        return this._builder;
    }

    build() {
        return this._performance;
    }
}

module.exports = Performance;
