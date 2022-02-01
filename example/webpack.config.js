const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const TravelmAgencyPlugin = require("../plugin").default;

module.exports = {
  entry: "./src/index.js",
  mode: "development",
  resolve: {
    extensions: [".js", ".elm"],
  },
  module: {
    rules: [
      {
        test: /\.elm$/,
        exclude: [/elm-stuff/, /node_modules/],
        use: [
          {
            loader: "elm-webpack-loader",
            options: {
              optimize: false,
              debug: true,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      favicon: path.join(__dirname, "public/favicon.ico"),
      template: path.join(__dirname, "public/index.html"),
    }),
    new TravelmAgencyPlugin({
      translationDir: "./translations",
      elmPath: "generated/Translations.elm",
      jsonPath: "translations",
      generatorMode: "dynamic",
      addContentHash: true,
    }),
  ],
  output: {
    filename: "[name].[contenthash].js",
    path: path.join(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    static: path.join(__dirname, "public"),
    compress: true,
    open: true,
    port: 3000,
    historyApiFallback: true,
  },
};
