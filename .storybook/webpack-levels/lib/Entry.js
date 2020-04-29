const {ensureArray} = require('./utils');

class Entry {
    constructor(builder) {
        this._builder = builder;
        this._entry = {};
        this._preEntry = [];
        this._postEntry = [];
    }

    addEntry(name, value) {
        let entries;

        if (typeof name === 'string') {
            entries = {[name]: value};
        } else {
            entries = name;
        }

        Object.keys(entries).forEach((entryName) => {
            const entryValue = entries[entryName];
            this._entry[entryName] = ensureArray(entryValue);
        });

        return this._builder;
    }

    addPreEntry(value) {
        this._preEntry = this._preEntry.concat(value);

        return this._builder;
    }

    addPostEntry(value) {
        this._postEntry = this._postEntry.concat(value);

        return this._builder;
    }

    build() {
        return Object.keys(this._entry).reduce((res, name) => {
            res[name] = this._preEntry.concat(this._entry[name], this._postEntry);

            return res;
        }, {});
    }
}

module.exports = Entry;
