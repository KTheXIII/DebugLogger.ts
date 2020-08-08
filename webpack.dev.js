const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')

const entry = require('./config/entry_file')
const HTML_FILES = require('./config/html_files')

// Log configs
const stats = {
  children: false,
  colors: true,
  modules: false,
  timings: true,
}

// Modules
const modules = {
  rules: [
    {
      test: /\.ts?$/,
      use: [
        {
          loader: 'ts-loader',
          options: {
            configFile: 'tsconfig.json',
          },
        },
      ],
    },
    {
      test: /\.html$/,
      use: [
        {
          loader: 'html-loader',
        },
      ],
    },
    {
      test: /\.(png|jpg|gif|svg)$/,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'static',
            publicPath: '/static',
            useRelativePaths: true,
          },
        },
      ],
    },
    {
      test: /\.(vert|frag)$/i,
      use: [
        {
          loader: 'raw-loader',
          options: {
            esModule: false,
          },
        },
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader', // Creates `style` nodes from JS strings
        MiniCssExtractPlugin.loader,
        {
          loader: 'css-loader', // Translates CSS into CommonJS
          options: {
            sourceMap: true,
          },
        },
        {
          loader: 'sass-loader', // Compiles Sass to CSS
          options: {
            sourceMap: true,
          },
        },
      ],
    },
  ],
}

const resolve = {
  extensions: ['.ts', '.js'],
  alias: {
    src: path.resolve(__dirname, 'src'),
  },
}

// Plugins
const plugins = [
  ...HTML_FILES,
  new MiniCssExtractPlugin({
    filename: 'static/[name].css',
    chunkFilename: '[id].css',
  }),
]

// Ouput
const output = {
  publicPath: '/',
  path: path.join(__dirname, 'dist'),
  filename: 'static/[name].js',
}

module.exports = {
  entry,
  mode: 'development',
  stats,
  module: modules,
  devtool: 'inline-source-map',
  resolve,
  plugins,
  output,
  watchOptions: {
    ignored: /node_modules|build|dist/,
  },
  devServer: {
    host: '0.0.0.0',
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
  },
}
