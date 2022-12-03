import * as webpack from "webpack";
import { resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";

const webpackConfig: webpack.Configuration = {
  mode: "production",
  entry: {
    main: "./index.ts",
  },
  cache: true,
  output: {
    path: resolve(__dirname, "dist"),
    filename: "[name].js",
    chunkFilename: "[name].chunk.js",
    sourceMapFilename: "[name].js.map",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.ya?ml$/,
        use: "yaml-loader",
      },
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./index.html",
      title: "My Simulator",
    }),
  ],
  devtool: "source-map",
};
export default webpackConfig;
