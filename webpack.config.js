var nodeExternals = require('webpack-node-externals');
module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
    externals: [nodeExternals()],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: 'tslint-loader',
              options: {
                configFile: './tslint.json'
              },
            },
          ],
        },
        {
          test: /\.ts$/,
          use: ['ts-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.tmp$/i,
          use: 'raw-loader',
        },
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    }
  };