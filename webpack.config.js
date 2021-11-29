const {merge} = require("webpack-merge");
const commonConfig = require("./config/webpack.common");
const developmentConfig = require("./config/webpack.dev");
const productionConfig = require("./config/webpack.prod");

module.exports = env => {
    switch (env.NODE_ENV) {
        case 'production':
            return merge(commonConfig(env), productionConfig(env));
        case 'development':
            return merge(commonConfig(env), developmentConfig(env));
        default:
            throw new Error('No matching configuration was found!');
    }
}
