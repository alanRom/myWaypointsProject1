//Taken from: https://www.sitepoint.com/building-a-react-universal-blog-app-a-step-by-step-guide/
var webpack = require('webpack')

var front_config = {
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

var back_config = {
  target: "node",
  entry: ['./server/server.js'],
  output: {
    path: __dirname + '/build/',
    filename: 'server.js',
  },
  module: {
    rules: [
        {
          test: /\.js*$/,
          exclude: [/node_modules/, /.+\.config.js/],
          use: 'babel-loader',
        },
      ],
  },
};
module.exports = [front_config, back_config]