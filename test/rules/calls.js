export default ({di, assert})=>{
	return function(){
		
		class A{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
			setParams(params){
				this.params = params;
			}
		}
		class L{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
			setParams(params){
				this.params = params;
			}
		}
		class M{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
			setParams(params){
				this.params = params;
			}
		}
		di.addRules({
			'A': {
				classDef: A,
				params: [ di.value(1), di.value(2), di.value(3) ],
			},
			'L':{
				classDef: L,
				calls: [
					[ 'setParams', [ { foo: di.value('bar') } ] ]
				],
			},
			'M':{
				classDef: M,
				calls: [
					[ 'setParams', [ { a: 'A' } ] ]
				],
			},
		});
		
		describe('pass value to method on instance',function(){
						
			it('should return params passed to method configured by the rule',function(){
				const instance = di.get('L');
				const { foo } = instance.getParams();
				assert.strictEqual(foo, 'bar');
			});
			
		});
		
		describe('pass instance to method on instance',function(){
			
			it('should return params passed to method configured by the rule',function(){
				const instance = di.get('M');
				const { a } = instance.getParams();
				assert.instanceOf(a, A);
			});
			
		});
	
	};
	
}
