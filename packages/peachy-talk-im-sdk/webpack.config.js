/*
 * @Author: shenqi.lv 248120694@qq.com
 * @Date: 2024-05-17 20:02:01
 * @LastEditors: shenqi.lv 248120694@qq.com
 * @LastEditTime: 2024-05-18 09:12:46
 * @FilePath: \PeachyTalk-IM-SDK\webpack.config.js
 * @Description: 打包配置
 */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isProduction ? 'source-map' : 'inline-source-map',
  entry: './src/index.ts',
  output: {
    filename: 'peachy-talk-im-sdk.js',
    library: 'peachyTalkImSdk',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        use: 'node-loader',
      },
      {
        test: /\.(ts|js)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  target: 'node',
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: [
        path.resolve(__dirname, 'dist'),
        path.resolve(__dirname, 'types'),
      ],
    }),
    new ESLintPlugin({
      context: path.resolve(__dirname, 'src'),
      exclude: ['node_modules', 'dist', 'types'],
    }),
  ],
  externals: {
    bufferutil: 'bufferutil',
    'utf-8-validate': 'utf-8-validate',
    axios: 'axios',
    mqtt: 'mqtt',
    '@protobuf-ts/runtime': 'commonjs @protobuf-ts/runtime',
  },
};
