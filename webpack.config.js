const {merge} = require("webpack-merge");
const commonConfig = require("./config/webpack.common");
const developmentConfig = require("./config/webpack.dev");
const productionConfig = require("./config/webpack.prod");

module.exports = env => {
  switch (env.NODE_ENV) {
    case 'development':
      return merge(commonConfig, developmentConfig);
    case 'production':
      return merge(commonConfig, productionConfig);
    default:
      throw new Error('No matching configuration was found!');
  }
}
