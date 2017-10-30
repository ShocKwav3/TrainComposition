const path = require('path');
const webpack = require('webpack');
const spawn = require('child_process').spawn;
//const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

const compiler = webpack({
    // add your webpack configuration here
    entry: './server/server.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: "nodebundle.js"
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['env', 'es2015', 'stage-2']
            }
          }
        }
      ],
    },
    externals: [nodeExternals()],
    node: {
        __dirname: false
    },
    target: 'node'
});

const watchConfig = {
    // compiler watch configuration
    // see https://webpack.js.org/configuration/watch/
    aggregateTimeout: 300,
    poll: 1000
};

let serverControl;

compiler.watch(watchConfig, (err, stats) => {
    if (err) {
        console.error(err.stack || err);
        if (err.details) {
            console.error(err.details);
        }
        return;
    }

    const info = stats.toJson();

    if (stats.hasErrors()) {
        info.errors.forEach(message => console.log(message));
        return;
    }

    if (stats.hasWarnings()) {
        info.warnings.forEach(message => console.log(message));
    }

    if (serverControl) {
        serverControl.kill();
    }

    // change filename to the relative path to the bundle created by webpack, if necessary(choose what to run)
    serverControl = spawn('node', [path.resolve(__dirname, 'dist/nodebundle.js')]);

    serverControl.stdout.on('data', data => console.log(data.toString()));
    serverControl.stderr.on('data', data => console.error(data.toString()));
});
