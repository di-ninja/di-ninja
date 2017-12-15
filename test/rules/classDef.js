export default ({di, expect})=>{
	
	return function(){
		
		class A{}
		
		di.addRule('A',{
			classDef: A,
		});
		
		it('should return an instance of A',function(){
			const instance = di.get('A');
			expect(instance).instanceof(A);
		});
		
	};
	
}
