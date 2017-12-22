/* eslint-env mocha */

import {
  InterfacePrototype,
  instanceOf,
  Interface,
} from 'interface-prototype'

export default ({di, assert}) => {
  return function () {
    
    di.config('interfacePrototype', InterfacePrototype)
    
    const I = new Interface();
	
	@di('A')
    @instanceOf(I)
	class A{}
	
	@di('B')
    @instanceOf(I)
    class B{}
    
    di.addRules({
		[I]: {
			classDef: A,
		}
	})
    
    describe('interfacePrototype', function () {
      
      it('should be instance of I', function () {
        const instance = di.get('A')
        assert.instanceOf(instance, I)
      })
      
      it('should be instance of A', function () {
        const instance = di.get(I)
        assert.instanceOf(instance, A)
      })
      
    })
  }
}
