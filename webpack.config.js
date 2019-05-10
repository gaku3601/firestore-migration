module.exports = {
    mode: 'production',
    entry: './src/index.ts',
    target: 'node',
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
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    }
  };