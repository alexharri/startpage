const production = process.env.NODE_ENV === "production";
const path = require("path");
const webpack = require("webpack");

console.log({ production });

const CompressionPlugin = require("compression-webpack-plugin");

module.exports = {
  context: path.join(__dirname, "src"),
  devtool: production ? "cheap-module-source-map" : "inline-sourcemap",
  entry: "./index.js",
  module: {
    loaders: [{
      test: /\.js$/,
      loader: "babel-loader",
      exclude: /node_modules/,
    }],
  },
  output: {
    path: path.join(__dirname, "/src/"),
    filename: "bundle.js",
  },
  eslint: {
    configFile: "./.eslintrc",
  },
  preLoaders: [
    {
      test: /\.js$/,
      loader: "eslint?parser=babel-eslint",
      exclude: /node_modules/,
    },
  ],
  plugins: production ? [
    new webpack.DefinePlugin({
      "process.env": {
        "NODE_ENV": JSON.stringify("production"), // eslint-disable-line
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({ warnings: false }),
    new CompressionPlugin({
      asset: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  ] : [],
};
