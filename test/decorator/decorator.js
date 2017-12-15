export default ({di, expect})=>{
	
	return function(){		
		
		di.config('rulesDefault',{
			'decorator': true,
		});
		
		
		class B{}
		
		function A(B){
			this.B = B;
		}
		di('A',['B'])(A);
		
		
		@di('C')
		class C{
			@di(['B'])
			method(b){
				this.B = b;
			}
		}
		
		@di('D')
		class D{
			@di(['B'], true)
			method(b){
				this.B = b;
			}
		}
		
		@di('E')
		class E{
			@di.wrap(['B'])
			method(b){
				this.B = b;
			}
		}
		
		di.addRules({
			'A':{
				classDef: A,
			},
			'B':{
				classDef: B,
			},
			'C':{
				calls:[
					[ 'method' ],
				],
			},
		});
		
		it('should return an instance of B',function(){
			const instance = di.get('A');
			expect(instance.B).instanceof( B );
		});
		
		
		
		
		
		it('should return an instance of B',function(){
			const instance = di.get('C');
			expect(instance.B).instanceof( B );
		});
		it('should not return an instance of B',function(){
			const instance = di.get('C');
			instance.method();
			expect(instance.B).not.instanceof( B );
		});
		
		it('should return an instance of B',function(){
			const instance = di.get('D');
			instance.method();
			expect(instance.B).instanceof( B );
		});
		it('should return an instance of B',function(){
			const instance = di.get('E');
			instance.method();
			expect(instance.B).instanceof( B );
		});
		
	};
	
}
