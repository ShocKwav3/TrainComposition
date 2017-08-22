const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: path.resolve(__dirname, 'src') + '/app/index.js',
  output: {
    path: path.resolve(__dirname, 'dist') + '/bundled',
    filename: 'bundle.js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', ['es2015', { "modules": false }]],
              plugins: ['transform-class-properties']
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader']
        })
      },
      {
        test: /\.css$/,
        use: ['style-loader','css-loader']
      },
      {
      test: /\.woff$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff&name=[path][name].[ext]"
    }, {
      test: /\.woff2$/,
      loader: "url-loader?limit=10000&mimetype=application/font-woff2&name=[path][name].[ext]"
    }, {
      test: /\.(eot|ttf|svg|gif|png)$/,
      loader: "file-loader"
    }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Train Composition Viewer',
      hash: true,
      template: './src/index.ejs'
      /*minify: {
          collapseWhitespace: true
      }*/
    }),
    new ExtractTextPlugin('style.css')
  ]
};
