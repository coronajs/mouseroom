var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var routes = require('./route');

var config = {
  context: path.join(__dirname, '..', '/client'),
  entry: {
      // Add each page's entry here
    },
    output: {
      path: path.join(__dirname, '..', '/public'),
      filename: '[name].bundle.js',
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')), // judge if dev environment.
        __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')) // judge if secret environment.
      }),
      new ExtractTextPlugin("[name].css")
    ],
    module: {
      perLoaders: [
        {
          test: /\.(js|jsx)?$/,
          exclude: /node_modules/,
          loader: 'jshint-loader'
        }
      ],
      loaders: [
        {
           test: /\.jsx?$/,
           exclude: /node_modules/,
           loader: "babel"
         },
         {
           test: /\.(tsx|ts)?$/,
           loader: 'ts-loader',
           exclude: path.join(__dirname, '..', '/app'),
           include: path.join(__dirname, '..', '/client'),
         },
         {
           test: /\.css$/,
           loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}')
         },
         {
           test: /\.scss$/,
           loader: ExtractTextPlugin.extract('style-loader', 'css-loader!autoprefixer?{browsers:["last 2 version", "> 1%"]}!sass')
         },
         {
           test: /\.(jpe?g|png|gif)$/i,
           loader: 'url?limit=10000!img?progressive=true'
         },
         {
            test: /\.(eot|woff|ttf|svg)$/,
            loader: 'url?limit=10000'
          }
      ],
      noParse: []
    },
    resolve: {
      extensions: ['', '.js', '.json', '.jsx', ".webpack.js", ".web.js", ".ts", ".tsx"],
      alias: {}
    },
    devtool: 'eval-source-map',
    jshint: {
      "esnext": true
    },
};

for (var i = 0; i < routes.length; i++) {
  var route = routes[i];
  config.entry[route.name] = route.entry;
  config.plugins.push(new HtmlWebpackPlugin({
    template: route.plugins.template,
    filename: route.plugins.filename,
    // favicon: './../assets/image/favicon.ico',
    chunks: [route.name],
    inject: 'body'
  }));
}

module.exports = config;