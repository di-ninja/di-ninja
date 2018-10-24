/* eslint-env mocha */

export default ({di, assert}) => {
  return function () {
    di.config({
      rulesDefault: {
        autoload: true
      },
      autoloadFailOnMissingFile: true,
      lazyRequire: false,
    })

    it('should throw an error', function () {
      let error
      try {
        di.addRules({
          'A': {

          }
        })
      } catch (e) {
        error = e
      }
      assert(error !== undefined)
    })
    it('should not throw an error', function () {
      let error
      try {
        di.addRules({
          'B': {
            classDef: function () {}
          }
        })
      } catch (e) {
        error = e
      }
      assert(error === undefined)
    })
  }
}
