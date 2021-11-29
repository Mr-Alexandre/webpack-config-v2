const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const path = require('path');

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

function generateHtmlPlugins(templateDir, saveFolder, HtmlWebpackPluginOptions) {
  return recursiveSearchFile(templateDir, '', saveFolder, HtmlWebpackPluginOptions);
}

module.exports = {
  generateHtmlPlugins: generateHtmlPlugins,
}
