/* eslint-env mocha */

import container from '../../src/node'

export default ({ di, assert }) => {
  return function () {
    di.config({
      rules: {
        'app/A': {

        },
        'app/B': {

        },
        'app/B/C': {

        }
      },

      dependencies: {

        'app': container.context('../autoload', true, /\.js$/),

        'A': container.require('../autoload/A'),

        'B': container.dependency(require('../autoload/B'))

      }

    })

    it('sould be instance of A', function () {
      const A = di.get('app/A')
      assert.instanceOf(A, require('../autoload/A').default)
    })

    it('sould be instance of B', function () {
      const B = di.get('app/B')
      assert.instanceOf(B, require('../autoload/B').default)
    })

    it('sould be instance of C', function () {
      const C = di.get('app/B/C')
      assert.instanceOf(C, require('../autoload/B/C').default)
    })

    it('sould be instance of A', function () {
      const A = di.get('A')
      assert.instanceOf(A, require('../autoload/A').default)
    })

    it('sould be instance of B', function () {
      const B = di.get('B')
      assert.instanceOf(B, require('../autoload/B').default)
    })
  }
}
