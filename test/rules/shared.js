export default ({di, expect})=>{
	return function(){
		
		class A{}
		
		di.addRules({
			'A': {
				classDef: A,
				shared: true,
			},
			
			'B': {
				classDef: A,
			},
		});
		
		describe('shared',function(){
			it('should return the same instance',function(){
				const A1 = di.get('A');
				const A2 = di.get('A');
				expect(A1).equal(A2);
			});
		});
		describe('not shared (default)',function(){
			it('should return a new instance',function(){
				const B1 = di.get('B');
				const B2 = di.get('B');
				expect(B1).not.equal(B2);
			});
		});
	
	};
	
}
