var webpack = require("webpack");
var path = require("path");
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DEV = path.resolve(__dirname, "dev");
var DIST = path.resolve(__dirname, "dist");
 
module.exports = {
  entry: [ DEV + "/index.jsx", DEV + "/styles/site.scss" ],
  output: {
    path: DIST,
    filename: "iceandfire.js"
  },
  module: {
    loaders: [
      {
        test: /\.js[x]?$/,
        exclude: /(node_modules)/,
        loaders: "babel-loader"
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css-loader!sass-loader")
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin("iceandfire.css", { allChunks: true })
  ]
};
