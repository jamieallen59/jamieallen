const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPluginConfig = require('./utils/HtmlWebpackPlugin');
const CopyWebpackPluginConfig = require('./utils/CopyWebpackPlugin');

const isProduction = process.env.NODE_ENV === 'production';

const config = {
    entry: [
        './public/js/app.js'
    ],
    output: {
        path: './',
        filename: 'index_bundle.js'
    },
    devServer: {
        // This is required for webpack-dev-server. The path should
        // be an absolute path to the build destination.
        outputPath: path.join(__dirname + '/'),
        stats: {
            chunks: false
        }
    },
    devtool: 'source-map',
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loaders: ['babel-loader']
        }, {
            test: /\.(css|less)$/,
            exclude: [ /public(\\|\/)js/ ],
            loader: ExtractTextPlugin.extract("style-loader", "css?sourceMap!less?sourceMap")
        }, {
            test: /\.(css|less)$/,
            include: [ /public(\\|\/)js/ ],
            loader: ExtractTextPlugin.extract('style-loader', 'css?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!less?outputStyle=expanded&sourceMap')
        }, {
            test: /\.(png|jpg)$/,
            loaders: ['url-loader?limit=8192']
        }] // inline base64 URLs for <=8k images, direct URLs for the rest
    },
    plugins: [
        new ExtractTextPlugin("dist/styles.css"),
        HtmlWebpackPluginConfig,
        CopyWebpackPluginConfig
    ]
}

if (isProduction) {
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false }
        })
    )
}

module.exports = config;
