import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import CssExtractor from "mini-css-extract-plugin";

import CssMinimizer from "css-minimizer-webpack-plugin";

import 'webpack-dev-server';

module.exports = {
    entry: './src/client/index.tsx',

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].bundle.js',
      publicPath: '/',
      clean: true,
    },

    module: {
      rules: [
        {
          test: /\.html$/,
          loader: 'html-loader',
        },
        { 
          test: /\.tsx?$/, 
          loader: 'ts-loader',
          exclude: ['/src/server'],
        },
        {
          test: /\.scss$/,
          use: [CssExtractor.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          loader: '@svgr/webpack',
        },
        {
          test: /\.(png|jpg|jpeg|gif|css)$/,
          type: 'asset/resource',
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    devtool: 'cheap-source-map',
    target: 'web',

    devServer: {
      port: '8080',
      open: false,
      hot: true,
      liveReload: true,
      historyApiFallback: true,
      client: {
        overlay: {
          errors: true,
          warnings: false,
        },
        progress: true,
      }
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: 'src/client/index.html',
      }),
      new CssExtractor({
        filename: "css.bundle.css",
    }),
    ],

    optimization: {
      minimize: true, // set true to run minimizers also in development
      minimizer: [
          new CssMinimizer(),
      ],
    },

    infrastructureLogging: {
      level: 'none',
    },
  };