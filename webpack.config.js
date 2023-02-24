const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
    mode: "development",
  entry:{
    background: path.resolve(__dirname, "src/background.js"),
    contentscript: path.resolve(__dirname, "src/contentScript.js"),
    options: path.resolve(__dirname, "src/options.js"),
    optionsCss: path.resolve(__dirname, "src/options.css")
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: "[name].bundle.js",
  },
  devtool: "source-map",
  module: {
    rules: [
      { 
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },
      { 
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader'
        ]
      }
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
    template:'./src/options.html',
    filename:'options.html',
  }),
  
    new CopyPlugin({
      patterns: [
        { from: 'public'}
      ],
    }),
  ]
};