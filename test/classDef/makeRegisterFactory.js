/* eslint-env mocha */

if (process.env.APP_ENV !== 'browser') {
  // we are not in webpack/browser but in nodejs/server-side
  const container = require('../../src/node').default
  require.context = container.context
}

export default ({ di, assert }) => {
  return function () {
    di.config({
      rulesDefault: {
        autoload: true
      },
      dependencies: {
        'app': require.context('../autoload', true, /\.js$/)
      },
      autoloadFailOnMissingFile: true
    })

    di.addRules({
      'app/A': {

      },
      'Loader': {
        classDef: di.makeRegisterFactory('app/', [{ foo: di.value('bar') }])
      },
      'LoaderCurry': {
        classDef: di.makeRegisterFactory('app/', [{ foo: di.value('bar') }], undefined, true)
      },
      'Loader2': {
        classDef: di.makeRegisterFactory('app/', [], undefined, false, ['then', 'test'])
      }
    })

    it('should load an instance of A with dependencies', function () {
      const instance = di.get('Loader')
      const { A } = instance
      assert(A instanceof require('../autoload/A').default)
      assert.deepEqual(A.params[0], { foo: 'bar' })
    })

    it('should load an instance of A with dependencies and merged dependencies', function () {
      const instance = di.get('LoaderCurry')
      const { A } = instance
      const a = A({ foo2: 'bar2' })
      assert(a instanceof require('../autoload/A').default)
      assert.deepEqual(a.params[0], { foo: 'bar', foo2: 'bar2' })
    })

    it('should return undefined', function () {
      const instance = di.get('Loader2')
      const { then, test } = instance
      assert.equal(then, undefined)
      assert.equal(test, undefined)
    })
  }
}
