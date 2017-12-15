export default ({di, expect})=>{

	return function(){
		
		class A{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class B{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		
		di.addRules({
			'A':{
				classDef: A,
				params: [ di.value('a') ],
			},
			'B':{
				classDef: B,
				inheritMixins: [ 'A' ],
			},
		});
		
		it('B should be same configuration as A',function(){
			
			const a = di.get('A').getParams();
			const b = di.get('B').getParams();
			expect(b).eql(a);
			
		});
	
	};
}
