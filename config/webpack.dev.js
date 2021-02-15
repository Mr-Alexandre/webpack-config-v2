const webpack = require('webpack');
const autoprefixer = require('autoprefixer');
const paths = require("./paths");

module.exports = {
  // Set the mode to development or production
  mode: 'development',

  // Control how source maps are generated
  devtool: 'inline-source-map',

  // Spin up a server for quick development
  devServer: {
    historyApiFallback: true,
    useLocalIp: true,
    host: '0.0.0.0',
    port: 8080,
    open: true,
    overlay: {
      warnings: true,
      errors: true
    },
  },

  module: {
    rules: [
      // Styles: Inject CSS into the head with source maps
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              // sourceMap: true,
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'style-loader',
          {
            loader: "css-loader",
            options: {
              // sourceMap: true,
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              // sourceMap: true,
              plugins: [
                autoprefixer()
              ]
            }
          },
          {
            loader: "sass-loader",
            options: {
              // sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(ttf|otf|eot|woff|woff(2)(\?[a-z0-9]+)??)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
              context: 'src',
              publicPath: '/',
            }
          }
        ]
      },
    ]
  },

  plugins: [
    // Only update what has changed on hot reload
    new webpack.HotModuleReplacementPlugin(),
  ]
}
