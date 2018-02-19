/* eslint-env mocha */

export default ({di, assert}) => {
  return function () {
    di.config('rulesDefault', {
      'decorator': true
    })

    class B {}

    function A (B) {
      this.B = B
    }
    di('A', ['B'])(A)

    /* eslint-disable no-unused-vars */
    @di('C')
    class C {
      @di(['B'])
      method (b) {
        this.B = b
      }
    }

    @di('D')
    class D {
      @di(['B'], true)
      method (b) {
        this.B = b
      }
    }

    @di('E')
    class E {
      @di.wrap(['B'])
      method (b) {
        this.B = b
      }
    }
    /* eslint-enable no-unused-vars */

    di.addRules({
      'A': {
        classDef: A
      },
      'B': {
        classDef: B
      },
      'C': {
        calls: [
          [ 'method' ]
        ]
      }
    })

    it('should return an instance of B', function () {
      const instance = di.get('A')
      assert.instanceOf(instance.B, B)
    })

    it('should return an instance of B', function () {
      const instance = di.get('C')
      assert.instanceOf(instance.B, B)
    })
    it('should not return an instance of B', function () {
      const instance = di.get('C')
      instance.method()
      assert.notInstanceOf(instance.B, B)
    })

    it('should return an instance of B', function () {
      const instance = di.get('D')
      instance.method()
      assert.instanceOf(instance.B, B)
    })
    it('should return an instance of B', function () {
      const instance = di.get('E')
      instance.method()
      assert.instanceOf(instance.B, B)
    })
  }
}
