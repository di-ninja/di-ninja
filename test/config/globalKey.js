/* eslint-env mocha */

export default ({di, assert}) => {
  return function () {
    di.config({
      globalKey: 'diNinja',
    })

    it('should provide global diNinja variable with container api', function () {
      assert.equal(di.container, diNinja.container)
    })
  }
}
