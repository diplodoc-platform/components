class DevServer {
    constructor(builder) {
        this._builder = builder;
    }

    set(devServer) {
        this._devServer = devServer;

        return this._builder;
    }

    build() {
        return this._devServer;
    }
}

module.exports = DevServer;
