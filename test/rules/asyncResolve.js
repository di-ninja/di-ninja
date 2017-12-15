export default ({di, expect})=>{
	
	return function(){
		
		function A(b, c){
			this.b = b;
			this.c = c;
		}
		
		async function B(){
			return 'b';
		}
		async function C(){
			return 'c';
		}
		
		di.addRules({
			'A': {
				classDef: A,
				params: ['B','C'],
			},
			'B': {
				classDef: B,
				asyncResolve: false, //default
			},
			'C': {
				classDef: C,
				asyncResolve: true,
			},
		});
		
		describe('simple async',function(){
			
			it('waitA sould be promise',async function(){
				const instance = di.get('A');
				//return expect(instance).instanceof(Promise);
				return expect(typeof instance == 'object' && instance !== null && typeof instance.then === 'function').equal(true);
			});
			
			it('a.b sould be promise',async function(){
				const instance = di.get('A');
				//return expect(instance.b).instanceof(Promise);
				return expect(typeof instance == 'object' && instance !== null && typeof instance.then === 'function').equal(true);
			});
			it('a.c should be resolved value of promise',async function(){
				const a = await di.get('A');
				return expect(a.c).equal('c');
			});
			
		});
		
		
	};
	
}
