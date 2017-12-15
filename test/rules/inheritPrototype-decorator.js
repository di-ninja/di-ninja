export default ({di, expect})=>{

	return function(){
		
		class Z{
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
		class ZX extends Z{}

		class One{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class Two extends One{
			constructor(...params){
				super(params);
			}
			getParams(){
				return this.params;
			}
		}

		di.addRules({
			'Z':{
				classDef: Z,
				params: [di.value('z')],
				decorator: true, //needed for parent class by extended using inheritPrototype
			},
			'Z2':{
				classDef: ZX,
				inheritPrototype: false,
			},
			'Z3':{
				classDef: ZX,
				inheritPrototype: true,
			},
			
			'One':{
				classDef: One,
				params: [di.value('one')],
				decorator: false,
			},
			'Two':{
				classDef: Two,
				inheritPrototype: true,
			},
		});
		
		describe('inheritPrototype false (default) + parent decorator true',function(){
				
			it('should not be same configuration as Z',function(){
				const z = di.get('Z').getParams();
				const z2 = di.get('Z2').getParams();
				expect(z2).not.eql(z);
			});
			
		});
		
		describe('inheritPrototype true + parent decorator true',function(){
			
			it('should be same configuration as Z',function(){
				
				const z = di.get('Z').getParams();
				const z3 = di.get('Z3').getParams();
				expect(z3).eql(z);
				
			});
			
			
		});
		
		describe('inheritPrototype true + parent decorator false (default)',function(){
			
			it('should not be same configuration as One',function(){
				
				const one = di.get('One').getParams();
				const two = di.get('Two').getParams();
				expect(two).not.eql(one);
				
			});
			
			
		});
	
	};
}
