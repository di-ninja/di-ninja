/* eslint-env mocha */

import {
  InterfacePrototype,
  instanceOf,
  Interface
} from '../../src/interface-prototype'

export default ({di, assert}) => {
  return function () {
    di.config('interfacePrototype', InterfacePrototype)

    const I = new Interface()

    @di('A')
    @instanceOf(I)
    class A {}

    @di('B')
    @instanceOf(I)
    class B {}

    /* eslint-disable no-unused-vars */
    @di('D', [I])
    class D {
      constructor (i) {
        this.i = i
      }
    }
    /* eslint-enable no-unused-vars */

    di.addRules({
      [I]: {
        classDef: A
      }
    })

    describe('interfacePrototype', function () {
      it('should be instance of I', function () {
        const instance = di.get('A')
        assert.instanceOf(instance, I)
      })

      it('should be instance of A', function () {
        const instance = di.get(I)
        assert.instanceOf(instance, A)
      })

      it('should not be instance of B', function () {
        const instance = di.get(I)
        assert.notInstanceOf(instance, B)
      })

      it('should be instance of A', function () {
        const d = di.get('D')
        assert.instanceOf(d.i, A)
      })
    })
  }
}
