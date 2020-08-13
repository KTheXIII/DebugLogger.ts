const path = require('path')

const ROOT_DIR = path.join(__dirname, '..')

const ENTRY_DIR = path.join(ROOT_DIR, 'test', 'scripts')
const STYLE_DIR = path.join(ROOT_DIR, 'test', 'styles')

module.exports = {
  app: [path.join(ENTRY_DIR, 'app.ts'), path.join(STYLE_DIR, 'main.scss')],
}
