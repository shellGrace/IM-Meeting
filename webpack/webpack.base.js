const { ROOT_PATH } = require("./utils/index");
const path = require("path");
const webpack = require("webpack");
const webpackbar = require("webpackbar");
const data = require("dotenv").config().parsed || {};

const { AGORA_APP_ID = "", AGORA_APP_CERTIFICATE = "", EASEMOB_APP_KEY = "" } = data;

console.log("env ", data);

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(ROOT_PATH, "src"),
    },
  },
  module: {
    unknownContextCritical: false,
    rules: [
      {
        test: /\.[jt]s(x)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "thread-loader",
          },
          {
            loader: "babel-loader",
          },
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: "thread-loader",
          },
          {
            loader: "style-loader",
          },
          {
            loader: "css-loader",
          },
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                config: path.resolve(ROOT_PATH, "./postcss.config.js"),
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new webpackbar(),
    new webpack.DefinePlugin({
      AGORA_APP_ID: JSON.stringify(AGORA_APP_ID),
      AGORA_APP_CERTIFICATE: JSON.stringify(AGORA_APP_CERTIFICATE),
      EASEMOB_APP_KEY: JSON.stringify(EASEMOB_APP_KEY),
    }),
  ],
};
