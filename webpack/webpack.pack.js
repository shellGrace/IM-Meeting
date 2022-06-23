const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpackMerge = require("webpack-merge");
const path = require("path");

const baseConfig = require("./webpack.base");
const packageJson = require("../package.json");
const { name } = packageJson;
const { ROOT_PATH, SRC_PATH } = require("./utils/index");
const entry = path.resolve(SRC_PATH, "./index.tsx");


const config = {
  mode: "production",
  entry: entry,
  output: {
    filename: "index.js",
    library: name,
    libraryTarget: "umd",
    libraryExport: "default",
    path: path.resolve(ROOT_PATH, "lib"),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf)$/,
        type: "asset/inline",
      },
    ],
  },
  optimization: {
    minimize: true,
    sideEffects: true,
    nodeEnv: "production",
    minimizer: [
      new TerserPlugin({
        parallel: require("os").cpus().length,
        terserOptions: {
          compress: {
            warnings: false,
            drop_debugger: true,
          },
        },
        extractComments: false,
      }),
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [],
};

const mergedConfig = webpackMerge.merge(baseConfig, config);
module.exports = mergedConfig;
