const { ROOT_PATH } = require("./utils/index");
const path = require("path");
const webpackbar = require("webpackbar");

module.exports = {
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    alias: {
      "@": path.resolve(ROOT_PATH, "src"),
    },
    symlinks: false,
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
      }
    ],
  },
  plugins: [new webpackbar()],
};
