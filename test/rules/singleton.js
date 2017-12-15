export default ({di, expect})=>{
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
			expect(A1).equal(A2);
		});
	
	};
	
}
