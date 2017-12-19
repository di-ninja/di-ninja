export default ({di, assert})=>{
	return function(){
		
		class A{}
		
		di.addRules({
			'A': {
				singleton: new A(),
			},
		});
		
		it('should return the same instance',function(){
			const A1 = di.get('A');
			const A2 = di.get('A');
			assert.strictEqual(A1, A2);
		});
	
	};
	
}
