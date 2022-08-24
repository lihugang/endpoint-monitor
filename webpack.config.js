
const path = require('path');

module.exports = {
    entry: '/dist/index.js',
    output: {
        filename: 'pack.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        extensions: [
            '.js',
            '.ts',
            '.json'],
    },
    target: 'node',
    module: {
        rules: [{
            test: /\.ts$/,
            use:
            {
                loader: 'ts-loader',
                options: {
                },
            },

        }],
    },
    resolve: {
        fallback: {
            fs: false,
        },
    },
};