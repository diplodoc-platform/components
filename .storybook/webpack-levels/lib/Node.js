class Node {
    constructor(builder) {
        this._builder = builder;
    }

    set(node) {
        this._node = node;

        return this._builder;
    }

    build() {
        return this._node;
    }
}

module.exports = Node;
