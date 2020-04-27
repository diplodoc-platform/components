class Module {
    constructor(builder) {
        this._builder = builder;
        this._rules = [];
    }

    addNoParse(value) {
        this._noParse = this._noParse || [];
        this._noParse = this._noParse.concat(value);

        return this._builder;
    }

    addRule(rule) {
        this._rules.push(rule);

        return this._builder;
    }

    build() {
        return {
            noParse: this._noParse,
            rules: this._rules,
        };
    }
}

module.exports = Module;
