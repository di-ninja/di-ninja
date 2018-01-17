/* eslint-env mocha */

export default ({di, assert}) => {
  return function () {
    di.config('rulesDefault', {
      shared: true,
    })

    di.addRules({
      'A': {
        classDef: function(){},
      },
      'B': {
        instanceOf: 'A',
      },
    })

    describe('rulesDefault shared true', function () {
      it('should be same instance', function () {
        const a = di.get('A')
        const a2 = di.get('A')
        assert.equal(a, a2)
      })
    })
    describe('extended via instanceOf', function () {
      it('should be same instance', function () {
        const b = di.get('B')
        const b2 = di.get('B')
        assert.equal(b, b2)
      })
    })
  }
}
