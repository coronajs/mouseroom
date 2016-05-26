var webpack = require('webpack');
var path = require('path');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlWebpackPlugin = require('html-webpack-plugin');
var uglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var routes = require('./route');

var config = {
  context: path.join(__dirname, '..', '/client'),
  entry: {
      vendors: ['jquery']
  },
  output: {
      path: path.join(__dirname, '..', '/public_dist'),
      filename: '[name].bundle.js',
  },
  plugins: [
      new webpack.DefinePlugin({
          __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')), // judge if dev environment.
          __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false')) // judge if secret environment.
      }),
      new uglifyJsPlugin({
        compress: {
          warnings: false
        }
      }),
      new webpack.optimize.MinChunkSizePlugin({minChunkSize: 20000}),
      new webpack.optimize.OccurenceOrderPlugin(false),
      new webpack.optimize.AggressiveMergingPlugin({
            minSizeReduce: 1.5,
            moveToParents: true
      }),
      new CommonsChunkPlugin('vendors', 'vendors.js', Infinity),
      new ExtractTextPlugin("[name].css"),
      new webpack.optimize.DedupePlugin(),
      new webpack.DefinePlugin({
        "process.env": { 
          NODE_ENV: JSON.stringify("production") 
        }
      })
  ],
  module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "babel"
         },
         {
           test: /\.(tsx|ts)?$/,
           loader: 'ts-loader'
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
      ]
  },
  resolve: {
    extensions: ['', '.js', '.json', '.jsx', ".webpack.js", ".web.js", ".ts", ".tsx"],
  }
};

for (var i = 0; i < routes.length; i++) {
  var route = routes[i];
  config.entry[route.name] = route.entry;
  config.plugins.push(new HtmlWebpackPlugin({
    template: route.plugins.template || './../templates/index.html',
    filename: route.plugins.filename || 'index.html',
    chunks: [route.name,'vendors'],
    inject: 'body',
    // hash: true
  }));
}

module.exports = config;