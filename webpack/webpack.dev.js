const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpackMerge = require("webpack-merge");
const baseConfig = require("./webpack.base");
const path = require("path");
const { DEFAULT_PORT, ROOT_PATH, DIST_PATH, SRC_PATH } = require("./utils/index");
const webpack = require("webpack");
const packageJson = require("../package.json");
const { name } = packageJson;

const entry = path.resolve(SRC_PATH, "./index.jsx");
const template = path.resolve(ROOT_PATH, "./public/index.html");

const config = {
  mode: "development",
  devtool: "inline-source-map",
  entry: entry,
  output: {
    publicPath: "/",
    filename: "index.js",
    library: name,
    libraryTarget: "umd",
    libraryExport: "default",
    path: path.resolve(ROOT_PATH, "lib"),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf)$/,
        type: "asset",
        generator: {
          filename: "static/[name].[hash:8].[ext]",
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: "index.html",
      template: template,
    }),
  ],
};

const mergedConfig = webpackMerge.merge(baseConfig, config);

module.exports = mergedConfig;
