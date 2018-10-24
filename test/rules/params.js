/* eslint-env mocha */

import {
  Interface
  // InterfacePrototype,
} from '../../src/interface-prototype'

// import InterfaceTypeError from '../../src/interfaceTypeError'

export default ({ di, assert }) => {
  return function () {
    class A {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class B {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class C {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class D {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class E {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class F {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }

    class G {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }

    // di.config('interfacePrototype',InterfacePrototype);
    di.config('interfaceTypeCheck', true)
    const I = Interface()
    I.implementClass(A)

    /* eslint-disable no-unused-vars */
    @di('H', [I])
    class H {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    /* eslint-enable no-unused-vars */

    di.addRules({
      'A': {
        classDef: A,
        params: [ di.value(1), di.value(2), di.value(3) ]
      },

      'B': {
        classDef: B
      },

      'C': {
        classDef: C,
        params: ['A', 'B']
      },

      'D': {
        classDef: D,
        params: ['C']
      },
      'E': {
        classDef: E,
        params: [di.valueFactory(() => 'A'), di.valueFactory(() => new B())]
      },

      'F': {
        classDef: F,
        params: ['A']
      },

      'G': {
        classDef: G,
        params: [I]
      },

      [I]: {
        classDef: A
      },

      'J': {
        classDef: A,
        params: [{
          key: []
        }]
      }
    })

    describe('values from rule', function () {
      it('sould return params from rule', function () {
        const instance = di.get('A')
        const paramsOfA = instance.getParams()
        assert.deepEqual(paramsOfA, [1, 2, 3])
      })
    })

    describe('values from manual call', function () {
      it('sould return params passed to get call', function () {
        const instance = di.get('A', [di.value(4), di.value(5), di.value(6)])
        const paramsOfA = instance.getParams()
        assert.deepEqual(paramsOfA, [4, 5, 6])
      })
    })

    describe('interfaces from rule', function () {
      it('sould return instances from rule\'s params', function () {
        const instance = di.get('C')
        const [ a, b ] = instance.getParams()
        assert.instanceOf(a, A)
        assert.instanceOf(b, B)
      })
    })

    describe('interfaces from manual call', function () {
      it('sould return instances from call\'s params', function () {
        const instance = di.get('C', ['A', 'B'])
        const [ a, b ] = instance.getParams()
        assert.instanceOf(a, A)
        assert.instanceOf(b, B)
      })
    })

    describe('recursive interfaces from rule', function () {
      it('sould return sub instances from rule\'s params', function () {
        const instance = di.get('D')
        const [ c ] = instance.getParams()
        const [ a, b ] = c.getParams()
        assert.instanceOf(a, A)
        assert.instanceOf(b, B)
      })
    })

    describe('recursive interfaces from manual call', function () {
      it('sould return sub instances from call\'s params', function () {
        const instance = di.get('D', ['C'])
        const [ c ] = instance.getParams()
        const [ a, b ] = c.getParams()
        assert.instanceOf(a, A)
        assert.instanceOf(b, B)
      })
    })

    describe('valueFactory from rule', function () {
      it('sould return values from factories from call\'s params', function () {
        const instance = di.get('E')
        const [ a, b ] = instance.getParams()
        assert.strictEqual(a, 'A')
        assert.instanceOf(b, B)
      })
    })

    describe('valueFactory from manual call', function () {
      it('sould return values from factories from call\'s params', function () {
        const instance = di.get('E', [di.valueFactory(() => new A()), di.valueFactory(() => 'B')])
        const [ a, b ] = instance.getParams()
        assert.instanceOf(a, A)
        assert.strictEqual(b, 'B')
      })
    })

    describe('direct class definition from rule', function () {
      it('sould return instance of class definition', function () {
        const instance = di.get('F')
        const [ a ] = instance.getParams()
        assert.instanceOf(a, A)
      })
    })
    describe('direct class definition from manual call', function () {
      it('sould return instance of class definition', function () {
        const instance = di.get('F', [ A ])
        const [ a ] = instance.getParams()
        assert.instanceOf(a, A)
      })
    })

    describe('direct interface definition by symbol from manual call', function () {
      it('sould return instance of class definition', function () {
        const instance = di.get('F', [ I ])
        const [ a ] = instance.getParams()
        assert.instanceOf(a, A)
      })
    })
    describe('direct interface definition by symbol from rules', function () {
      it('sould return instance of class definition', function () {
        const instance = di.get('G')
        const [ a ] = instance.getParams()
        assert.instanceOf(a, A)
      })
    })

    describe('direct interface definition by symbol from decorator', function () {
      it('sould return instance of class definition', function () {
        const instance = di.get('H')
        const [ a ] = instance.getParams()
        assert.instanceOf(a, A)
      })
    })

    describe('direct interface definition by symbol from manual call with decorator specification', function () {
      it('sould throw an interfaceTypeError', function () {
        let error
        let instance
        let b
        try {
          instance = di.get('H', [B]);
          [ b ] = instance.getParams()
        } catch (e) {
          error = e
        }
        assert.notInstanceOf(b, B)

        assert.instanceOf(error, Error)
        assert.instanceOf(error, TypeError)

        // assert.instanceOf(error, InterfaceTypeError);
        assert.strictEqual(error.errorName, 'interfaceTypeError')
      })
    })

    describe('recursive params resolution', function () {
      it('should be an array', function () {
        const instance = di.get('J')
        const [ a ] = instance.getParams()
        assert(a.key instanceof Array)
      })
    })
  }
}
