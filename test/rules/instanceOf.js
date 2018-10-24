/* eslint-env mocha */

export default ({ di, assert }) => {
  return function () {
    class A {}

    di.addRules({
      'A': {
        classDef: A
      },
      'akaOfA': {
        instanceOf: 'A'
      },
      'recursiveAkaOfA': {
        instanceOf: 'akaOfA'
      }
    })

    describe('instanceOf', function () {
      it('should return an instance of A', function () {
        const instance = di.get('akaOfA')
        assert.instanceOf(instance, A)
      })
    })
    describe('instanceOf recursive', function () {
      it('should return an instance of A', function () {
        const instance = di.get('recursiveAkaOfA')
        assert.instanceOf(instance, A)
      })
    })
  }
}
