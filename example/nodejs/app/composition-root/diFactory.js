import container from 'di-ninja'

import path from 'path'

import dependencies from './dependencies'

export default (rules) => {
  return container({
    rules,

    rulesDefault: {
      autoload: true
    },

    autoloadPathResolver: {
      'app': path.resolve(__dirname, '..')
    },

    dependencies,

    autoloadFailOnMissingFile: true

  })
}
