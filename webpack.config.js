
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx'],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
        }),
    ],
    devServer: {
        static: [
            {
                directory: path.join(__dirname, 'dist'),
            },
            {
                directory: path.join(__dirname, 'public'),
            },
            {
                directory: path.join(__dirname, 'src'),
                publicPath: '/src',
            },
        ],
        compress: true,
        port: 3000,
        hot: true,
    },
    mode: 'development',
};
