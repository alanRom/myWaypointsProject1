//Taken from: https://www.sitepoint.com/building-a-react-universal-blog-app-a-step-by-step-guide/
var webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: './main.js',
  output: {
    path: __dirname + '/public/dist',
    filename: 'bundle.js',
    publicPath: '/dist/'
  },
  module: {
    rules: [
        {
          test: /\.jsx*$/,
          exclude: [/node_modules/, /.+\.config.js/],
          use: 'babel-loader',
        }
      ]
  },
  plugins: [
    
 ]
};