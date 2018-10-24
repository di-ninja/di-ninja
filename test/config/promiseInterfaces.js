/* eslint-env mocha */

import Bluebird from 'bluebird'

export default ({ di, assert }) => {
  return function () {
    di.config('promiseInterfaces', [ Bluebird ])

    function A (b) {
      this.b = b
    }
    function B () {
      return new Bluebird((resolve, reject) => {
        resolve('b')
      })
    }

    di.addRules({
      'A': {
        classDef: A,
        params: ['B']
      },
      'B': {
        classDef: B,
        asyncResolve: true
      }
    })

    describe('promiseInterface', function () {
      it('should recognize provided interface and return instanceof Promise', function () {
        const instance = di.get('A')
        if (process.env.APP_ENV === 'browser') {
          assert(typeof instance.then === 'function')
        } else {
          assert.instanceOf(instance, Promise)
        }
      })
    })
  }
}
