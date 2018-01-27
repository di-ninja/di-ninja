/* eslint-env mocha */

import path from 'path'

export default ({di, assert}) => {
  return function () {
    di.config({
      rulesDefault: {
        autoload: true
      },
      autoloadFailOnMissingFile: true
    })


    it('should throw an error', function () {
      let error
      try{
        di.addRules({
          'A': {
            
          }
        })
      }
      catch(e){
        error = e
      }
      assert(error !== undefined)
    })
    it('should not throw an error', function () {
      let error
      try{
        di.addRules({
          'B': {
            classDef: function(){}
          }
        })
      }
      catch(e){
        error = e
      }
      assert(error === undefined)
    })
    
  }
}
