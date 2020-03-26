module.exports = {
  entry: './src/js/index.js',
  output: {
    path: __dirname + '/dist' + '/js',
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["modern-browsers"]
          }
        }
      }
    ]
  }
};