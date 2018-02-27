/* eslint-env mocha */

if (process.env.APP_ENV !== 'browser') {
  // we are not in webpack/browser but in nodejs/server-side
  const container = require('../../src/node').default
  require.context = container.context
}

export default ({di, assert}) => {
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
  }
}
