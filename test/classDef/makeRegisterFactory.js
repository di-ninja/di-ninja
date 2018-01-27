/* eslint-env mocha */

import path from 'path'

export default ({di, assert}) => {
  return function () {
    di.config({
      rulesDefault: {
        autoload: true
      },
      autoloadPathResolver: {
        'app': path.resolve(__dirname, '../autoload')
      },
      autoloadFailOnMissingFile: true
    })

    di.addRules({
      'app/A':{
        
      },
      'Loader': {
        classDef: di.makeRegisterFactory('app/', [di.value({foo:'bar'})])
      }
    })

    it('should load an instance of A with dependencies', function () {
      const instance = di.get('Loader')
      const { A } = instance
      assert(A instanceof require('../autoload/A').default)
      assert.deepEqual(A.params[0], {foo:'bar'})
    })
    
  }
}
