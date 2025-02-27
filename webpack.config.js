const path = require('path');

module.exports = {
  resolve: {
    fallback: {
      "zlib": require.resolve("browserify-zlib"),
      "querystring": require.resolve("querystring-es3"),
      "fs": false,
      "stream": require.resolve("stream-browserify"),
      "path": require.resolve("path-browserify"),
      "buffer": require.resolve("buffer/")
    }
  },
  // Outras configurações do Webpack, se necessário
};
