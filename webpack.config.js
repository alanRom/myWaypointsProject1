//Taken from: https://www.sitepoint.com/building-a-react-universal-blog-app-a-step-by-step-guide/
var webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: ['./client/main.js'],
  output: {
    path: __dirname + '/server/public/dist',
    filename: 'bundle.js',
    publicPath: '/dist/',
  },
  module: {
    rules: [
        {
          test: /\.js*$/,
          exclude: [/node_modules/, /.+\.config.js/],
          use: 'babel-loader',
        },
        {
          test:/\.css$/,
          use:['style-loader','css-loader'],
        },
      ],
  },
  plugins: [
    
 ],
};