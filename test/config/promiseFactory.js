/* eslint-env mocha */

import Bluebird from 'bluebird'

export default ({di, assert}) => {
  return function () {
    di.config('promiseFactory', Bluebird)

    function A (b) {
      this.b = b
    }
    function B () {
      return new Promise((resolve, reject) => {
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

    describe('promiseFactory', function () {
      it('should return instanceof selected factory', function () {
        const instance = di.get('A')
        assert.instanceOf(instance, Bluebird)
      })
    })
  }
}
