autoprefixer = require('autoprefixer');
precss = require('precss');

module.exports = {
  entry: './src/main.jsx',

  output: {
    filename: 'build/bundle.js',
  },

  module: {
    loaders: [
      { 
        test: /\.jsx?$/, 
        exclude: /node_modules/, 
//        include: /react-leaflet/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },

      { 
        test: /\.css$/, 
        exclude: /node_modules/, 
        loader: 'style-loader!css-loader' 
      },

      { 
        test: /\.json$/,
        loader: 'json-loader'
      },

//      { test:   /\.css$/, exclude: /node_modules/, loader: "style-loader!css-loader!postcss-loader"},
    ],


  },

  postcss: function () {
    return [autoprefixer, precss];
  },

  resolve: {
    extensions: ['', '.js', '.json', ],
  },
};
