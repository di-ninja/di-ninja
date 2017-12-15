export default ({di, expect})=>{
	return function(){
		
		class A{}
		
		di.addRules({
			'A': {
				classDef: A,
			},
			'akaOfA': {
				instanceOf: 'A'
			},
			'recursiveAkaOfA': {
				instanceOf: 'akaOfA'
			},
		});
		
		describe('instanceOf',function(){
			it('should return an instance of A',function(){
				const instance = di.get('akaOfA');
				expect(instance).instanceof(A);
			});
		});
		describe('instanceOf recursive',function(){
			it('should return an instance of A',function(){
				const instance = di.get('recursiveAkaOfA');
				expect(instance).instanceof(A);
			});
		});
	
	};
	
}
