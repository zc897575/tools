var path = require('path')
var utils = require('./utils')
const webpack = require('webpack')

var projectRoot = path.resolve(__dirname, '../')
const InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
const vuxLoader = require('vux-loader')

var config = require('../config')
var vueLoaderConfig = require('./vue-loader.conf')

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

let webpackConfig = {
    entry: {
        app: ['babel-polyfill', './src/main.js']
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath: process.env.NODE_ENV === 'production'
            ? config.build.assetsPublicPath
            : config.dev.assetsPublicPath
    },
    resolve: {
        extensions: ['.js', '.vue', '.json'],
        alias: {
            'vue$': 'vue',
            '@': resolve('src'),
            'static': resolve('static'),
            'assets': resolve('src/assets')
        }
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: vueLoaderConfig
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src'), resolve('test')]
            },
            {
                test: /\.(png|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 5000,
                    name: utils.assetsPath('img/[name].[hash:7].[ext]')
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                }
            }
        ]
    },
    plugins: [
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '..'),
            manifest: require('./babel-manifest.json')
        }),
        new webpack.DllReferencePlugin({
            context: path.resolve(__dirname, '..'),
            manifest: require('./vendor-manifest.json')
        }),
        new InlineManifestWebpackPlugin({
            names: ['webpackManifest']
        })
    ]
}


module.exports = vuxLoader.merge(webpackConfig, {
    plugins: ['vux-ui', 'progress-bar', 'duplicate-style']
})
