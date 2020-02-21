const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ip = require('ip');
const fs = require('fs');

// Our function that generates our html plugins
function generateNewHtmlWebpackPlugin(saveFolder, directory, item, templateDir, HtmlWebpackPluginOptions = {}) {
    const parts = item.split('.');
    const name = parts[0];
    const extension = parts[1];
    const options = {
        ...{
            filename: `./${saveFolder}${directory}/${name}.html`,
            template: path.resolve(__dirname, `${templateDir}/${name}.${extension}`),
        }, ...HtmlWebpackPluginOptions
    };

    return new HtmlWebpackPlugin(options);
}

function recursiveSearchFile(folderPath, folderName, saveFolder, HtmlWebpackPluginOptions) {
    // Read files in template directory
    let folderContents = fs.readdirSync(path.resolve(__dirname, folderPath));
    let collectionHtmlWebpackPlugin = [];
    folderContents.forEach(item => {
        let pathToContent = path.join(__dirname, folderPath, item);

        if (fs.lstatSync(pathToContent).isFile()) {
            const parts = item.split('.');
            const extension = parts[1];
            if (extension === 'pug') {
                collectionHtmlWebpackPlugin.push(generateNewHtmlWebpackPlugin(saveFolder, folderName, item, folderPath, HtmlWebpackPluginOptions));
            }
        }
        if (fs.lstatSync(pathToContent).isDirectory()) {
            let newArr = recursiveSearchFile(`${folderPath}/${item}`, `${folderName}/${item}`, saveFolder, HtmlWebpackPluginOptions);
            collectionHtmlWebpackPlugin = [...collectionHtmlWebpackPlugin, ...newArr]
        }
    });
    return collectionHtmlWebpackPlugin;
}

function generateHtmlPlugins (templateDir, saveFolder, HtmlWebpackPluginOptions) {
    return recursiveSearchFile(templateDir, '', saveFolder, HtmlWebpackPluginOptions);
}

// Call our function on our views directory.
//Example
// let htmlPluginsAjaxTemplate = generateHtmlPlugins('./src/ajax-template', 'ajax-template', {
//     inject: false,
//     minify: {
//         removeComments: true,
//     }
// });
let htmlPlugins = generateHtmlPlugins('./src/pages', 'pages');

module.exports = (env, argv) => ({
    entry: {
        index: './src/main.ts',
    },
    output: {
        filename: argv.mode === 'production' ? '[name].[contenthash].js' : '[name].js',
    },
    devServer: {
        host: ip.address(),
        port: 8080,
        open: true,
        hot: true,
        overlay: {
            warnings: true,
            errors: true
        },
        // contentBase: path.join(__dirname, './src'),
        // inline: true,
        // progress: true,
        // compress: true,
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
        minimizer: [
            new TerserPlugin({
                parallel: true,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                // loader: 'ts-loader',
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            transpileOnly: true, 
                            happyPackMode: true
                        }
                    }
                ],

                exclude: /node_modules/,
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.pug$/,
                // include: path.resolve(__dirname, 'src/'),
                use:  [
                    // 'html-loader',
                    {
                        loader: 'html-loader',
                        options: {
                            attributes: ['img:src', ':src'],
                            interpolate: 'require',

                            minimize: {
                                removeComments: true,
                            },
                        }
                    },
                    {
                        loader: 'pug-html-loader',
                        query: { 
                            pretty: true
                        } 
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                    }
                ]
            },
            {
                test: /\.scss$/,
                use: [
                    // 'style-loader',
                    // MiniCssExtractPlugin.loader,
                    argv.mode === 'production' ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: "css-loader",
                        options: {
                            // url: false
                        }
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
                        loader: "sass-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ]
            },
            {
                test: /\.(ttf|otf|eot|woff(2)(\?[a-z0-9]+)??)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            // outputPath: 'fonts/',
                            name: argv.mode === 'development' ? '[path][name].[ext]' : 'fonts/[name].[ext]',
                            context: 'src',
                            publicPath: '/',
                        }
                    }
                ]
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
            //     use: [
            //         {
            //             loader: 'file-loader',
            //             options: {
            //                 // name: '[path][name].[ext]',
            //                 context: 'src',
            //                 publicPath: '/',
            //                 // useRelativePath: true,
            //                 name: '[path][name].[ext]',
            //                 limit: false,
            //             }
            //         }
            //     ]
            // },
            {
                test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[path][name].[ext]',
                            context: 'src',
                            publicPath: '/',
                            limit: 200,
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
        new ForkTsCheckerWebpackPlugin({ checkSyntacticErrors: true }),
        new HtmlWebpackPlugin({
            template: './src/index.pug',
            filename: './index.html',
            inject: true
        }),
        new MiniCssExtractPlugin({
            filename: argv.mode === 'production' ? '[name].[contenthash].css' : '[name].css',
        }),
        // new CopyWebpackPlugin([
        //     {from: './src/media', to: './media'},
        // ])
        // new BundleAnalyzerPlugin()
    ].concat(htmlPlugins),
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    devtool: argv.mode === 'production' ? 'source-map' : 'eval-sourcemap',

});
