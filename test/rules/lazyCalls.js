export default ({di, expect})=>{
	return function(){
		
		class N{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class O{
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

		class P{
			constructor(...params){
				this.params = params;
			}
			getParams(){
				return this.params;
			}
		}
		class Q{
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

		class R{
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
		class S{
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
		class T{
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

		class U{
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
		class V{
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
		class W{
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
			'N':{
				shared: true,
				classDef: N,
				params: [ { o: 'O' } ],
			},
			'O':{
				shared: true,
				classDef: O,
				lazyCalls: [
					[ 'setParams', [ { n: 'N' } ] ]
				],
			},
			
			
			'Q':{
				shared: true,
				classDef: Q,
				calls: [
					[ 'setParams', [ { p: 'P' } ] ]
				],
			},
			'P':{
				shared: true,
				classDef: Q,
				params: [ { q: 'Q' } ],
			},
			
			
			'R':{
				shared: true,
				classDef: R,
				params: [ { s: 'S' } ],
			},
			'S':{
				shared: true,
				classDef: S,
				params: [ { t: 'T' } ],
			},
			'T':{
				shared: true,
				classDef: T,
				calls: [
					[ 'setParams', [ { r : 'R' } ] ]
				],
			},
			
			'U':{
				shared: true,
				classDef: U,
				params: [ { v: 'V' } ],
			},
			'V':{
				shared: true,
				classDef: V,
				params: [ { w: 'W' } ],
			},
			'W':{
				shared: true,
				classDef: W,
				calls: [
					[ 'setParams', [ { u : 'U' } ] ]
				],
			},
		});
		
		describe('cyclic dependency via lazy call: n -> o -> n',function(){
						
			it('should return params passed to method configured by the rule',function(){
				const instance = di.get('N');
				const [{ o }] = instance.getParams();
				expect(o).instanceof(O);
				const { n } = o.getParams();
				expect(n).equal(instance);
			});
			
		});
		
		describe('cyclic dependency via call (implicit, cylic detected and turned into lazyCall): p -> q -> p',function(){
					
			it('should return params passed to method configured by the rule',function(){
				const instance = di.get('P');
				const [{ q }] = instance.getParams();
				expect(q).instanceof(Q);
				const { p } = q.getParams();
				expect(p).equal(instance);
			});
			
		});
		
		
		describe('recursive cyclic dependency via lazy call: r -> s -> t',function(){
					
			it('should return params passed to method configured by the rule',function(){
				const instance = di.get('R');
				const [{ s }] = instance.getParams();
				expect(s).instanceof(S);
				const [{ t }] = s.getParams();
				expect(t).instanceof(T);
				const { r } = t.getParams();
				expect(r).equal(instance);
			});
			
		});
		
		describe('recursive cyclic dependency via call (implicit, cylic detected and turned into lazyCall): u -> v -> w',function(){
					
			it('should return params passed to method configured by the rule',function(){
				const instance = di.get('U');
				const [{ v }] = instance.getParams();
				expect(v).instanceof(V);
				const [{ w }] = v.getParams();
				expect(w).instanceof(W);
				const { u } = w.getParams();
				expect(u).equal(instance);
			});
			
		});
	
	};
	
}
