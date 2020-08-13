const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const ROOT_DIR = path.join(__dirname, '..')
const PUBLIC_DIR = path.join(ROOT_DIR, 'test', 'public')

module.exports = [
  new HtmlWebpackPlugin({
    template: path.join(PUBLIC_DIR, 'index.html'),
    filename: 'index.html',
    chunks: ['app'],
  }),
]
