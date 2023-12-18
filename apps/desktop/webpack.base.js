const path = require('node:path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = function ({
  transpileOnly = false,
}) {
  const moduleConfig = {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          'babel-loader',
          {
            loader: 'ts-loader',
            options: {
              transpileOnly,
            },
          },
        ],
      },
    ],
  }
  const resolve = {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
  const electronMainConfig = {
    entry: {
      index: './src/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js',
    },
    devtool: 'inline-cheap-source-map',
    target: 'electron-main',
    node: {
      __dirname: false,
    },
    resolve,
    module: moduleConfig,
    // CopyPlugin
  }

  const electronRendererConfig = {
    entry: {
      preloadUI: './src/renderers/ui/preload.ts',
      preloadAPI: './src/renderers/api/preload.ts',
      ui: './src/renderers/ui/index.ts',
      api: './src/renderers/api/index.ts',
    },
    output: {
      path: path.resolve(__dirname, 'dist', 'renderers'),
      publicPath: '/',
    },
    target: 'electron-renderer',
    devtool: 'inline-cheap-source-map',
    node: {
      __dirname: false,
    },
    resolve,
    module: moduleConfig,
    // externals: {
    //   electron: 'commonjs electron',
    // },
  }

  const styleConfig = {
    entry: {
      ui: './src/styles/index.scss',
    },
    output: {
      path: path.resolve(__dirname, 'dist', 'styles'),
    },
    optimization: {
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.(scss|css)$/,
          use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                sassOptions: {
                  outputStyle: 'expanded',
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'ui.css',
      }),
    ],
  }

  return [
    electronMainConfig,
    electronRendererConfig,
    styleConfig,
  ]
}
