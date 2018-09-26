var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var APP_PATH = path.resolve(__dirname, 'app');
var SRC_PATH = path.resolve(__dirname, 'src');

module.exports = {
    cache: true,
    target: 'electron',

    devtool: 'source-map',
    entry: {
        ui: './src/ui'
    },
    output: {
        path: APP_PATH,
        filename: '[name].js',
        chunkFilename: '[chunkhash].js',
        sourceMapFilename: '[name].map'
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /\.less$/,
                loader: 'style-loader!css-loader!less-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react', 'es2015'],
                    plugins: ['transform-class-properties']
                }
            }
        ]
    },
    plugins: [
        new webpack.optimize.DedupePlugin(),
        //new webpack.optimize.UglifyJsPlugin({comments: false}),
        new webpack.EnvironmentPlugin(["NODE_ENV"]),
        new CopyWebpackPlugin([
            {from: path.resolve(SRC_PATH, 'main.js'), to: 'main.js'},
            {from: path.resolve(SRC_PATH, 'ui/index.html'), to: 'index.html'},
            {from: path.resolve(__dirname, 'package.json'), to: 'package.json'}
        ])
    ]
};
