const paths = require('./paths');
const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
// const {generateHtmlPlugins} = require("../pugPathGenerate");

// Call our function on our views directory.
// const htmlPlugins = generateHtmlPlugins(`./src/pages`, 'pages');
// const htmlPluginsAjaxTemplate = generateHtmlPlugins(`./src/ajax-template`, 'ajax-template', {
//   inject: false,
//   minify: {
//     removeComments: true,
//   }
// });

module.exports = (env, argv) => ({
  entry: paths.src + '/index.ts',
  output: {
    path: paths.build,
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
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
        use: [
          // 'html-loader',
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', ':src'],
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
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource'
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline'
      },
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: paths.src + '/index.pug',
      filename: 'index.html',
      inject: true
    }),
  ],
    // .concat(htmlPlugins).concat(htmlPluginsAjaxTemplate),
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    plugins: [new TsconfigPathsPlugin({})]
  }
});
