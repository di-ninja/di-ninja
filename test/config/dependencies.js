/* eslint-env mocha */

if (process.env.APP_ENV !== 'browser') {
  // we are not in webpack/browser but in nodejs/server-side
  const container = require('../../src/node').default
  require.context = container.context
}

export default ({ di, assert }) => {
  return function () {
    di.config({
      rules: (di) => ({
        'app/A': {

        },
        'app/B': {

        },
        'app/B/C': {

        },

        'requireA': {
          instanceOf: 'app/A',
          params: [ di.require('app/B') ]
        },

        'app/F': {

        },

        'app/G': {

        },

        'app/G/index': {

        },

        'app/H': {

        }

      }),
      dependencies: {
        'app': require.context('../autoload', true, /\.js$/)
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

    it('sould be equal to B', function () {
      const A = di.get('requireA')
      assert.strictEqual(A.params[0], require('../autoload/B'))
    })

    it('sould be F from root', function () {
      const F = di.get('app/F')
      assert.instanceOf(F, require('../autoload/F').default)
    })

    it('sould be G from index', function () {
      const G = di.get('app/G')
      assert.instanceOf(G, require('../autoload/G/index').default)
    })

    it('sould be G/index from index', function () {
      const G = di.get('app/G/index')
      assert.instanceOf(G, require('../autoload/G/index').default)
    })

    it('sould be H from H/H', function () {
      const H = di.get('app/H')
      assert.instanceOf(H, require('../autoload/H/H').default)
    })
  }
}
