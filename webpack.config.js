module.exports.config = function(type) {

  const DEV = (type === 'development');

  var config = {
    entry: './src/scripts/main.js',
    output: {
      path: './www/',
      filename: 'main.js'
    },
    debug : DEV,
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
        {
            presets: ['es2015', 'stage-0', 'react']
        }
      }]
    }
  };

  if(DEV)
    config.devtool = 'eval';

  return config;
}