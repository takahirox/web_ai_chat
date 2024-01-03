const path = require('path');
const webpack = require('webpack');

const mode = 'development';

module.exports = [
  {
    devServer: {
      client: {
        progress: true
      },
      host: '0.0.0.0',
      port: 8080,
      static: {
        directory: path.join(__dirname),
      }
    },
    devtool: 'source-map',
    entry: {
      app: './src/index.ts',
      worker: './src/worker.ts'
    },
    mode: mode,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        }
      ]
    },
    name: "app",
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: [
        '.js',
        '.ts',
        '.tsx'
      ]
    }
  }
];