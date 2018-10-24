/* eslint-env mocha */

export default ({ di, assert }) => {
  return function () {
    class N {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class O {
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

    class P {
      constructor (...params) {
        this.params = params
      }
      getParams () {
        return this.params
      }
    }
    class Q {
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

    class R {
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
    class S {
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
    class T {
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

    class U {
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
    class V {
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
    class W {
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
      'N': {
        shared: true,
        classDef: N,
        params: [ { o: 'O' } ]
      },
      'O': {
        shared: true,
        classDef: O,
        lazyCalls: [
          [ 'setParams', [ { n: 'N' } ] ]
        ]
      },

      'Q': {
        shared: true,
        classDef: Q,
        calls: [
          [ 'setParams', [ { p: 'P' } ] ]
        ]
      },
      'P': {
        shared: true,
        classDef: P,
        params: [ { q: 'Q' } ]
      },

      'R': {
        shared: true,
        classDef: R,
        params: [ { s: 'S' } ]
      },
      'S': {
        shared: true,
        classDef: S,
        params: [ { t: 'T' } ]
      },
      'T': {
        shared: true,
        classDef: T,
        calls: [
          [ 'setParams', [ { r: 'R' } ] ]
        ]
      },

      'U': {
        shared: true,
        classDef: U,
        params: [ { v: 'V' } ]
      },
      'V': {
        shared: true,
        classDef: V,
        params: [ { w: 'W' } ]
      },
      'W': {
        shared: true,
        classDef: W,
        calls: [
          [ 'setParams', [ { u: 'U' } ] ]
        ]
      }
    })

    describe('cyclic dependency via lazy call: n -> o -> n', function () {
      it('should return params passed to method configured by the rule', function () {
        const instance = di.get('N')
        const [{ o }] = instance.getParams()
        assert.instanceOf(o, O)
        const { n } = o.getParams()
        assert.strictEqual(n, instance)
      })
    })

    describe('cyclic dependency via call (implicit, cylic detected and turned into lazyCall): p -> q -> p', function () {
      it('should return params passed to method configured by the rule', function () {
        const instance = di.get('P')
        const [{ q }] = instance.getParams()
        assert.instanceOf(q, Q)
        const { p } = q.getParams()
        assert.strictEqual(p, instance)
      })
    })

    describe('recursive cyclic dependency via lazy call: r -> s -> t', function () {
      it('should return params passed to method configured by the rule', function () {
        const instance = di.get('R')
        const [{ s }] = instance.getParams()
        assert.instanceOf(s, S)
        const [{ t }] = s.getParams()
        assert.instanceOf(t, T)
        const { r } = t.getParams()
        assert.strictEqual(r, instance)
      })
    })

    describe('recursive cyclic dependency via call (implicit, cylic detected and turned into lazyCall): u -> v -> w', function () {
      it('should return params passed to method configured by the rule', function () {
        const instance = di.get('U')
        const [{ v }] = instance.getParams()
        assert.instanceOf(v, V)
        const [{ w }] = v.getParams()
        assert.instanceOf(w, W)
        const { u } = w.getParams()
        assert.strictEqual(u, instance)
      })
    })
  }
}
