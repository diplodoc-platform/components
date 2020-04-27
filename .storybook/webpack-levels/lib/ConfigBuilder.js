const webpack = require('webpack');
const WebpackManifestPlugin = require('webpack-manifest-plugin');

const {getOption} = require('./utils');
const Entry = require('./Entry');
const Output = require('./Output');
const Module = require('./Module');
const Resolve = require('./Resolve');
const Plugins = require('./Plugins');
const Optimization = require('./Optimization');
const Externals = require('./Externals');
const DevServer = require('./DevServer');
const Stats = require('./Stats');
const Performance = require('./Performance');
const Node = require('./Node');

class ConfigBuilder {
    constructor(options = {}) {
        this.name = getOption(options.name);
        this.target = getOption(options.target);
        this.context = getOption(options.context);
        this.mode = getOption(options.mode, process.env.NODE_ENV || 'production');
        this.sourceMap = getOption(options.sourceMap, true);
        this.cache = getOption(options.cache);
        this.isProduction = this.mode === 'production';
        this.isDevelopment = this.mode === 'development';

        this.entry = new Entry(this);
        this.output = new Output(this);
        this.module = new Module(this);
        this.resolve = new Resolve(this);
        this.plugins = new Plugins(this);
        this.optimization = new Optimization(this);
        this.externals = new Externals(this);
        this.devServer = new DevServer(this);
        this.stats = new Stats(this);
        this.performance = new Performance(this);
        this.node = new Node(this);

        // Defaults
        if (this.sourceMap) {
            this.setDevtool(this.isProduction ? 'source-map' : 'cheap-module-source-map');
        }

        this.plugins.addPlugin(new WebpackManifestPlugin());

        if (this.isDevelopment) {
            this.plugins.addPlugin(new webpack.HotModuleReplacementPlugin());
        }

        this.stats.set({
            children: false,
            excludeAssets: (assetName) => {
                const regex = /\.map$/;

                return regex.test(assetName);
            },
        });
    }

    setMode(mode) {
        this.mode = mode;

        return this;
    }

    setContext(context) {
        this.context = context;

        return this;
    }

    setDevtool(devtool) {
        this.devtool = devtool;

        return this;
    }

    apply(definition) {
        definition(this);

        return this;
    }

    build() {
        return {
            name: this.name,
            target: this.target,
            context: this.context,
            mode: this.mode,
            cache: this.cache,
            devtool: this.devtool,
            entry: this.entry.build(),
            output: this.output.build(),
            module: this.module.build(),
            resolve: this.resolve.build(),
            plugins: this.plugins.build(),
            optimization: this.optimization.build(),
            externals: this.externals.build(),
            devServer: this.devServer.build(),
            stats: this.stats.build(),
            performance: this.performance.build(),
            node: this.node.build(),
        };
    }
}

module.exports = ConfigBuilder;
