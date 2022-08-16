import * as path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import MiniCssExtractPlugin from "mini-css-extract-plugin";

import CssMinimizer from "css-minimizer-webpack-plugin";

import 'webpack-dev-server';

module.exports = {
    entry: './src/client/index.tsx',

    output: {
      path: path.resolve(__dirname, 'build'),
      filename: '[name].js',
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
          test: /\.s?css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        },
        {
          test: /\.svg$/,
          loader: '@svgr/webpack',
        },
        {
          test: /\.(png|jpg|jpeg|gif)$/,
          type: 'asset/resource',
        },
      ],
    },

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    devtool: 'hidden-source-map',
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
      new MiniCssExtractPlugin({
        filename: "[name].css",
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