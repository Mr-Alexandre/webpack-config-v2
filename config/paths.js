const path = require('path');

function getStaticPath(env) {
  switch (env.NODE_ENV) {
    case 'production':
      return 'shop/static/assets/[name].[ext]';
    case 'preProduction':
      return 'static/assets/[name].[ext]';
    case 'development':
      return '[path][name].[ext]';
    default:
      return '[path][name].[ext]';
  }
}

module.exports = {
  src: path.resolve(__dirname, '../src'),
  build: path.resolve(__dirname, '../dist'),
  getStaticPath: getStaticPath,
}
