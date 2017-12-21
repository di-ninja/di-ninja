/* eslint-env mocha */

export default ({di, assert})=>{
	
	return function(){
		
		class A{}
		
		di.addRule('A',{
			classDef: A,
		});
		
		it('should return an instance of A',function(){
			const instance = di.get('A');
			assert.instanceOf(instance, A);
		});
		
	};
	
}
