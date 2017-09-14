import path from 'path';

import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import { WDS_PORT, IS_PROD, SCRIPT_PATH } from './config';

const plugins = [
  new HtmlWebpackPlugin({
    title: 'Učeň z Okoličného',
    template: 'index.ejs',
    alwaysWriteToDisk: true
  }),
  new HtmlWebpackHarddiskPlugin()
];

let cssConfig = [
  {
    loader: 'style-loader',
    options: {
      sourceMap: true
    }
  },
  {
    loader: 'css-loader',
    options: {
      sourceMap: true,
      modules: true,
      importLoaders: 1,
      localIdentName: '[name]__[local]--[hash:base64:5]'
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: true
    }
  }
];

if (IS_PROD) {
  const extractCss = new ExtractTextPlugin({
    ignoreOrder: true,
    filename: 'css/[contenthash].style.css'
  });

  plugins.push(
    extractCss,
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'production'
      ),
      PRODUCTION: true
    })
  );

  cssConfig = extractCss.extract({
    use: [
      {
        loader: 'css-loader',
        options: {
          modules: true,
          importLoaders: 1,
          localIdentName: '[name]__[local]--[hash:base64:5]'
        }
      },
      { loader: 'postcss-loader' }
    ]
  });
} else {
  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.DefinePlugin({
      PRODUCTION: false
    })
  );
}

module.exports = {
  entry: {
    main: './js/main.js'
  },
  output: {
    filename: 'js/app.[hash].bundle.js',
    path: path.resolve(__dirname, 'public'),
    publicPath: IS_PROD ? '/' : SCRIPT_PATH
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        options: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['last 2 versions']
                },
                modules: false,
                loose: true
              }
            ],
            'react'
          ]
        }
      },
      {
        test: /\.css$/,
        use: cssConfig
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            outputPath: 'fonts/',
            publicPath: IS_PROD ? '/' : SCRIPT_PATH
          }
        }
      }
    ]
  },
  devtool: IS_PROD ? false : 'source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostCheck: true,
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: WDS_PORT,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' }
  },
  plugins
};
