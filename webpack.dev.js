const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
    // hot reload when there are changes to the html files
    // https://stackoverflow.com/questions/71355628/webpack-dev-server-doesnt-update-html-auto
    watchFiles: ['./src/*.html'],
    hot: true,
  },
});
