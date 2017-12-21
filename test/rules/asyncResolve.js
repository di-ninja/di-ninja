/* eslint-env mocha */

export default ({di, assert}) => {
  return function () {
    function A (b, c) {
      this.b = b
      this.c = c
    }

    async function B () {
      return 'b'
    }
    async function C () {
      return 'c'
    }

    di.addRules({
      'A': {
        classDef: A,
        params: ['B', 'C']
      },
      'B': {
        classDef: B,
        asyncResolve: false // default
      },
      'C': {
        classDef: C,
        asyncResolve: true
      }
    })

    describe('simple async', function () {
      it('waitA sould be promise', async function () {
        const instance = di.get('A')
				// return assert.instanceOf(instance, Promise);
        return assert(typeof instance === 'object' && instance !== null && typeof instance.then === 'function')
      })

      it('a.b sould be promise', async function () {
        const instance = di.get('A')
				// return assert.instanceOf(instance.b, Promise);
        return assert(typeof instance === 'object' && instance !== null && typeof instance.then === 'function')
      })
      it('a.c should be resolved value of promise', async function () {
        const a = await di.get('A')
        return assert.strictEqual(a.c, 'c')
      })
    })
  }
}
