/* eslint-env mocha */

import path from 'path'

export default ({ di, assert }) => {
  return function () {
    di.config({
      autoloadExtensions: ['jsx', 'js'],
      autoloadPathResolver: {
        'app': path.resolve(__dirname, '../autoload')
      }
    })

    it('should return instance of class E loaded by autoload', function () {
      di.addRules({
        'app/E': {
          autoload: true
        }
      })
      const e = di.get('app/E')
      assert(e instanceof require('../autoload/E.jsx').default)
    })
  }
}
