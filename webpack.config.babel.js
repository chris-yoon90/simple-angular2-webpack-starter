"use strict";

import path from "path";
import webpack from 'webpack';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

let PROJ_ROOT = __dirname;
let BUNDLE_DEST = path.join(PROJ_ROOT, 'dist');
let LIB_DEST = 'lib';

let NODE_DEPENDENCIES = [
    { from: path.join('.', 'node_modules', 'es6-shim', 'es6-shim.min.js'), to: path.join('.', LIB_DEST) },
    { from: path.join('.', 'node_modules', 'angular2', 'bundles', 'angular2-polyfills.min.js'), to: path.join('.', LIB_DEST) }
];
let META_DATA = {
    title: 'Angular2 App',
    host: 'localhost',
    port: 3000,
    ENV: 'dev'
}

export default {
    metadata: META_DATA,
    entry: path.resolve('./src/bootstrap.ts'),
    output: {
        path: BUNDLE_DEST,
        filename: '[name].bundle.js',
        sourceMapFilename: '[name].map',
        chunkFilename: '[id].chunk.js'
    },
    devtool: 'source-map',
    debug: true,
    resolve: {
        extensions: ['', '.ts', '.js', '.html', '.scss', '.css', '.style']
    },
    
    module: {
        loaders: [
            { test: /\.ts$/, loader: 'babel-loader!ts-loader' },
            { test: /\.html$/, loader: 'raw-loader' },
            { 
                test: /\.scss$/, 
                loaders: ['raw-loader', 'sass-loader'],
                include: [ path.resolve(PROJ_ROOT, 'src', 'app') ]
            },
            { 
                test: /\.scss$/, 
                loaders: ['style-loader', 'css-loader', 'sass-loader'], 
                include: [
                    path.resolve(PROJ_ROOT, 'src', 'bootstrap.ts'),
                    path.resolve(PROJ_ROOT, 'src', 'assets', 'scss')
                ] 
            }
        ]
    },
    
    plugins: [
        new CopyWebpackPlugin(
            [{ from: './src/assets', to: './assets' }]
                .concat(NODE_DEPENDENCIES)
        ),
        new HtmlWebpackPlugin({
            title: META_DATA.title,
            template: './src/index.html',
            node_dependencies: NODE_DEPENDENCIES.map(function(d) {
                let pathObject = path.parse(d.from);
                let fileName = pathObject.base;
                return `${LIB_DEST}/${fileName}`;
                })
            })
    ],
    
    ts: {
        configFileName: 'tsconfig.json'
    },
    
    devServer: {
        port: META_DATA.port,
        host: META_DATA.host,
        historyApiFallback: true,
        watchOptions: { aggregateTimeout: 300, poll: 1000 }
    }
}