const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const paths = require('./paths');
const {generateHtmlPlugins} = require("../pugHtmlPlugin");
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

// generateHtmlPlugins('./src/ajax-template', 'ajax-template', {
//   inject: false,
//   minify: {
//     removeComments: true,
//   }
// }),
const htmlPlugins = [
  generateHtmlPlugins('./src/pages', 'pages')
];


module.exports = {
  // Where webpack looks to start building the bundle
  entry: [paths.src + '/index.ts'],

  // Where webpack outputs the assets and bundles
  output: {
    path: paths.build,
    filename: '[name].js',
    publicPath: '/',
  },

  // Determine how modules within the project are treated
  module: {
    rules: [
      // JavaScript: Use Babel to transpile JavaScript files
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
        use: ['babel-loader']
      },

      //Pug: Transpiling pug to html
      {
        test: /\.pug$/,
        use: [
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
          }
        ]
      },

      //Assets: Load Media
      {
        test: /\.(png|jpe?g|gif|svg|ico)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
              publicPath: '/',
              limit: false,
            }
          }
        ]
      }
    ],
  },

  // Customize the webpack build process
  plugins: [
    new ForkTsCheckerWebpackPlugin(),

    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    // new CopyWebpackPlugin({
    // }),

    // Generates an HTML file from a template
    new HtmlWebpackPlugin({
      template: paths.src + '/index.pug',
      filename: 'index.html',
      inject: true
    }),
  ].concat(...htmlPlugins),

  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsconfigPathsPlugin({})]
  },
}
