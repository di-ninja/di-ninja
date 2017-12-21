/* eslint-env mocha */

export default ({di, assert})=>{
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
		class C{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class D{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class E{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class F{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		
		class G{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
			setH(h){
				this.params[0] = h;
			}
			setI(i){
				this.params[1] = i;
			}
		}
		class H{}
		class I{}
		
		
		di.addRules({
			'A': {
				classDef: A,
			},
			
			'B': {
				classDef: B,
			},
			
			'C': {
				classDef: C,
				params: ['A','B'],
			},
			
			'D': {
				classDef: D,
				params: ['C'],
			},
			
			
			
			'SubstitutionsParentIndex': {
				classDef: C,
				params: ['A','B'],
				substitutions: ['E','F'],
			},
			'SubstitutionsParentAssoc': {
				classDef: C,
				params: ['A','B'],
				substitutions: {
					B:'F',
					A:'E',
				},
			},
			
			'SubstitutionsParentIndexWithValue': {
				classDef: C,
				params: ['A','B'],
				substitutions: [di.value('E'),di.value('F')],
			},
			'SubstitutionsParentAssocWithValue': {
				classDef: C,
				params: ['A','B'],
				substitutions: {
					B:di.value('F'),
					A:di.value('E'),
				},
			},
			
			'SubstitutionsParentAssocInSubkey': {
				classDef: C,
				params: [{
					subkey: {
						A:'A',
						B:'B'
					},
				}],
				substitutions: {
					B:di.value('F'),
					A:di.value('E'),
				},
			},
			
			'E':{
				classDef: E,
			},
			'F':{
				classDef: F,
			},
			
			'SubstitutionsParentAssocWithCalls':{
				classDef: G,
				calls: [
					[ 'setH', [ 'E' ] ],
					[ 'setI', [ 'F' ] ],
				],
				substitutions: {
					'E': 'H',
					'F': 'I',
				},
			},
			'H':{
				classDef: H,
			},
			'I':{
				classDef: I,
			},
		});
		
		describe('substitutions by index',function(){
						
			it('should return substituted instances',function(){
				const instance = di.get('SubstitutionsParentIndex');
				const [ e, f ] = instance.getParams();
				assert.instanceOf(e, E);
				assert.instanceOf(f, F);
			});
			
		});
		
		describe('substitutions by associative keys',function(){
					
			it('should return substituted instances',function(){
				const instance = di.get('SubstitutionsParentAssoc');
				const [ e, f ] = instance.getParams();
				assert.instanceOf(e, E);
				assert.instanceOf(f, F);
			});
			
		});
		
		describe('substitutions by index with value',function(){
					
			it('should return substituted values',function(){
				const instance = di.get('SubstitutionsParentIndexWithValue');
				const [ e, f ] = instance.getParams();
				assert.strictEqual(e, 'E');
				assert.strictEqual(f, 'F');
			});
			
		});
		
		describe('substitutions by associative keys with value',function(){
					
			it('should return substituted values',function(){
				const instance = di.get('SubstitutionsParentAssocWithValue');
				const [ e, f ] = instance.getParams();
				assert.strictEqual(e, 'E');
				assert.strictEqual(f, 'F');
			});
			
		});
	
		describe('substitutions by associative keys in subkey',function(){
					
			it('should return substituted values',function(){
				const instance = di.get('SubstitutionsParentAssocInSubkey');
				const [ o ] = instance.getParams();
				assert.strictEqual(o.subkey.A, 'E');
				assert.strictEqual(o.subkey.B, 'F');
			});
			
		});
		
		describe('substitutions by associative keys with calls',function(){
					
			it('should return substituted instances',function(){
				const instance = di.get('SubstitutionsParentAssocWithCalls');
				const [ h, i ] = instance.getParams();
				assert.instanceOf(h, H);
				assert.instanceOf(i, I);
			});
			
		});
	
	};
	
}
