module.exports = {
  entry: './src/js/index.js',
  output: {
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader'}
        ]
      }
    ]
  }
};