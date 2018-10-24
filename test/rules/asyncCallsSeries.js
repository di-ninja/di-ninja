/* eslint-env mocha */

export default ({ di, assert, sinon }) => {
  return function () {
    let clock
    before(function () {
      clock = sinon.useFakeTimers()
    })
    after(function () {
      clock.restore()
    })

    class A {
      setB (d) {
        this.b = ++d.i
      }
      setC (d) {
        this.c = ++d.i
      }
    }

    function B (d) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(d)
        }, 200)
      })
    }
    function C (d) {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(d)
        }, 100)
      })
    }

    function D () {
      this.i = 0
    }

    di.addRules({
      'A': {
        classDef: A,
        calls: [
          [ 'setB', ['B'] ],
          [ 'setC', ['C'] ],
          [ (a) => {
            const d = new D()
            a.d = d
          } ]
        ],
        sharedInTree: ['D'],
        asyncCallsSerie: false // default
      },
      'A2': {
        instanceOf: 'A',
        asyncCallsSerie: true
      },

      'B': {
        classDef: B,
        params: ['D'],
        asyncResolve: true
      },
      'C': {
        classDef: C,
        params: ['D'],
        asyncResolve: true
      },
      'D': {
        classDef: D
      }

    })

    describe('run async calls in parallel (default)', function () {
      it('a.c should be equal to 1', async function () {
        let a = di.get('A')
        clock.runAll()
        a = await a
        return assert.strictEqual(a.b, 2)
      })

      it('a.c should be equal to 2', async function () {
        let a = di.get('A')
        clock.runAll()
        a = await a
        return assert.strictEqual(a.c, 1)
      })
    })

    describe('run async calls in serie', function () {
      it('a.c should be equal to 1', async function () {
        let a = di.get('A2')
        clock.runAll()
        a = await a
        return assert.strictEqual(a.b, 1)
      })

      it('a.c should be equal to 2', async function () {
        let a = di.get('A2')
        clock.runAll()
        a = await a
        return assert.strictEqual(a.c, 2)
      })
    })
  }
}
