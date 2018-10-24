/* eslint-env mocha */

export default ({ di, assert }) => {
  return function () {
    class X {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
      setParams (params) {
        this.params = params
      }
    }
    class Y {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
      setParams (params) {
        this.params = params
      }
    }

    di.addRules({
      'X': {
        classDef: X,
        shared: true,
        params: [di.value('x')]
      },
      'Y': {
        classDef: Y,
        params: [di.value('y')]
      },
      'X2': {
        instanceOf: 'X',
        inheritInstanceOf: true
      },
      'Y2': {
        instanceOf: 'Y',
        inheritInstanceOf: false
      }
    })

    describe('inheritInstanceOf true (default)', function () {
      it('should be same configuration as X', function () {
        const x = di.get('X')
        const x2 = di.get('X2')
        assert.deepEqual(x2, x)
      })
    })

    describe('inheritInstanceOf false', function () {
      it('should not be same configuration as Y', function () {
        const y = di.get('Y')
        const y2 = di.get('Y2')
        assert.notDeepEqual(y2, y)
      })
    })

    describe('inheritInstanceOf shared', function () {
      it('should be same instance, inherited shared config from X', function () {
        const x2 = di.get('X2')
        const x22 = di.get('X2')
        assert.equal(x2, x22)
      })
    })
  }
}
