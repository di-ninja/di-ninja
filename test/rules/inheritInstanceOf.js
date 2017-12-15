export default ({di, expect})=>{
	return function(){
		
		class X{
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
		class Y{
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
			'X':{
				classDef: X,
				params: [di.value('x')],
			},
			'Y':{
				classDef: Y,
				params: [di.value('y')],
			},
			'X2':{
				instanceOf: 'X',
				inheritInstanceOf: true,
			},
			'Y2':{
				instanceOf: 'Y',
				inheritInstanceOf: false,
			},
		});
		
		describe('inheritInstanceOf true (default)',function(){
				
			it('should be same configuration as X',function(){
				
				const x = di.get('X');
				const x2 = di.get('X2');
				expect(x2).eql(x);
				
			});
			
			
		});
		
		describe('inheritInstanceOf false',function(){
			
			it('should not be same configuration as Y',function(){
				const y = di.get('Y');
				const y2 = di.get('Y2');
				expect(y2).not.eql(y);
			});
			
		});
	
	};
	
}
