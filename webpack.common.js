const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const EventHooksPlugin = require("event-hooks-webpack-plugin");
const RemovePlugin = require("remove-files-webpack-plugin");
const fs = require("fs-extra");

module.exports = (env) => {
  // reduce it to a nice object, the same as before

  const envKeys = Object.keys(env).reduce((prev, next) => {
    prev[`process.env.${next}`] = JSON.stringify(env[next]);
    return prev;
  }, {});

  return {
    entry: ["@babel/polyfill", "./client/index.js"],
    output: {
      path: path.resolve(__dirname, "server/public"),
      publicPath: "/public/",
      filename: "output.[hash].bundle.js",
      chunkFilename: "[id].[hash].bundle.js",
    },
    resolve: {
      alias: {
        // add as many aliases as you like!
        "@components": path.resolve(__dirname, "client/component"),
        "@stores": path.resolve(__dirname, "client/store/mobx"),
        "@api": path.resolve(__dirname, "client/api.js"),
        "@pages": path.resolve(__dirname, "./client/pages"),
        "@routers": path.resolve(__dirname, "client/routes.js"),
        "@services": path.resolve(__dirname, "client/services"),
        "@helper": path.resolve(__dirname, "client/Common/Helper/Helper.js"),
        "@responsive": path.resolve(__dirname, "client/Common/Helper/Responsive.js"),
        "@manager": path.resolve(__dirname, "client/Common/Manager"),
      },
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ["babel-loader"],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: '@svgr/webpack',
              options: {
                native: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.less$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" }, // translates CSS into CommonJS
            {
              loader: "less-loader", // compiles Less to CSS
              options: {
                modifyVars: {
                  "primary-color": "#FF0101",
                  "link-color": "#FF0101",
                  "border-radius-base": "6px",
                  // "menu-inline-toplevel-item-height": "60px",
                  // "menu-item-height": "60px",
                  // or
                  //'hack': `true; @import "your-less-file-path.less";`, // Override with less file
                },
                javascriptEnabled: true,
              },
            },
          ],
        },
        {
          test: /\.(jpg|jpeg|gif|png|svg)$/,
          use: [{ loader: "file-loader" }],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "client/index.html",
        favicon: "client/favicon/favicon.ico",
      }),
      new webpack.DefinePlugin(envKeys),
      new AntdDayjsWebpackPlugin({
        replaceMoment: true,
        preset: "custom",
        plugins: [
          "isSameOrBefore",
          "isSameOrAfter",
          "advancedFormat",
          "customParseFormat",
          "weekday",
          "weekYear",
          "weekOfYear",
          "isMoment",
          "localeData",
          "localizedFormat",
          "buddhistEra",
        ],
      }),
      new EventHooksPlugin({
        done: () => {
          console.log(`Executing 'done' callback task`);
          fs.copySync(
            path.resolve(__dirname, "client/rc-picker-moment.js"),
            path.resolve(
              __dirname,
              "node_modules/rc-picker/es/generate/moment.js"
            )
          );
        },
      }),
      new RemovePlugin({
        before: {
          root: "./server",
          test: [
            {
              folder: "./public",
              method: () => true,
            },
          ],
          exclude: [
            "./public/manifest.json",
            "./public/assets",
            "./public/flags",
            "./public/geo",
            "./public/locales",
          ],
        },
        watch: {
          // parameters for "before watch compilation" stage.
        },
        after: {
          // parameters for "after normal and watch compilation" stage.
        },
      }),
    ],
  };
};
