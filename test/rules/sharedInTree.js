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
		class H{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class I{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class J{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class K{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		
		di.addRules({
			'A': {
				classDef: A,
				params: [ di.value(1), di.value(2), di.value(3) ],
			},
			'H':{
				classDef: H,
				sharedInTree: ['A'],
				params: [{a: 'A', i: 'I'}],
			},
			'I':{
				classDef: I,
				params: [{a: 'A', j: 'J'}],
			},
			'J':{
				classDef: J,
				params: ['A'],
			},
			'K':{
				classDef: K,
				sharedInTree: ['A'],
				params: [{i: 'I'}],
			},
		});
		
		describe('sharedInTree accross tree with direct child param dependency',function(){
						
			it('sharedInstances should be the sames accross the tree',function(){
				const instance = di.get('H');
				const [ {a, i} ] = instance.getParams();
				const [ {a: a2, j} ] = i.getParams();
				const [ a3 ] = j.getParams();
				expect(a).equal(a2).equal(a3);
			});
			
		});
		
		describe('sharedInTree accross tree without direct child param dependency',function(){
					
			it('sharedInstances should be the sames accross the tree',function(){
				const instance = di.get('K');
				const [ {i} ] = instance.getParams();
				const [ {a, j} ] = i.getParams();
				const [ a2 ] = j.getParams();
				expect(a).equal(a2);
			});
			
		});
	
	};
	
}
