const paths = require('./paths');
const {merge} = require('webpack-merge');
const common = require('./webpack.common.js');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const autoprefixer = require('autoprefixer');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const {getStaticPath} = require("./paths");

module.exports = (env) => ({
    mode: 'production',
    devtool: false,
    output: {
        filename: '[name].[contenthash].js',
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                }
            }
        },
        minimize: true,
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            sourceMap: false,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer()
                            ]
                        }
                    },
                    {
                        loader: 'sass-loader',
                    }
                ],
            },
            // {
            //     test: /\.(ttf|otf|eot|woff|woff(2)(\?[a-z0-9]+)??)$/,
            //     exclude: /node_modules/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 name: getStaticPath('s'),
            //                 context: 'src',
            //                 publicPath: '/',
            //             }
            //         }
            //     ]
            // },
            // {
            //     test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 name: getStaticPath('s'),
            //                 context: 'src',
            //                 publicPath: '/',
            //                 limit: false,
            //             }
            //         }
            //     ]
            // }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: '[name].[contenthash].css',
        }),
        // new CopyWebpackPlugin([
        //   {from: './src/media', to: './media'},
        //   {from: './src/lib', to: './lib'},
        //   {from: './src/static', to: './static'},
        // ]),
    ],
})
