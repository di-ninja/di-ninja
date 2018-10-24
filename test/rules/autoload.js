/* eslint-env mocha */

import path from 'path'

export default ({ di, assert }) => {
  return function () {
    di.config('autoloadPathResolver', {
      'app': path.resolve(__dirname, '../autoload')
    })

    di.addRules({
      'app/A': {
        autoload: true
      }
    })

    it('should return an instance of A', function () {
      const instance = di.get('app/A')
      assert.instanceOf(instance, require('../autoload/A').default)
    })
  }
}
