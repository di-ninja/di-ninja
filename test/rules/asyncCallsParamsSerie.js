//waiting for https://github.com/sinonjs/lolex/pull/105#pullrequestreview-49708156

export default ({di, expect, sinon})=>{
	
	return function(){
		
		let clock;
		before(function(){
			clock = sinon.useFakeTimers({
				//shouldAdvanceTime: true,
			});
		});
		after(function(){
			clock.restore();
		});
		
		class A{
			setB(b){
				this.b = b;
			}
			setC(c){
				this.c = c;
			}
		}
		
		async function B(d){
			return new Promise((resolve)=>{
				setTimeout(()=>{
					resolve(++d.i)
				}, 20);
			});
		}
		async function C(d){
			return new Promise((resolve)=>{
				setTimeout(()=>{
					resolve(++d.i);
				}, 10);
			});
		}
		
		function D(){
			this.i = 0;
		}
		
		di.addRules({
			'A': {
				classDef: A,
				calls: [
					['setB', ['B'] ],
					['setC', ['C'] ],
				],
				asyncCallsSerie: true,
				asyncCallsParamsSerie: true,
				sharedInTree: ['D'],
			},
			'B': {
				classDef: B,
				params: ['D'],
				asyncResolve: true,
			},
			'C': {
				classDef: C,
				params: ['D'],
				asyncResolve: true,
			},
			'D':{
				classDef: D,
			},
		});
		
		describe('run async calls params in serie',function(){
			
			it('a.c should be equal to 1',async function(){
				let a = di.get('A');
				
				//clock.runAllAsync();
				clock.runAll();
				clock.restore();
				
				a = await a;
				
				return expect(a.b).equal(1);
			});
			
			it('a.c should be equal to 2',async function(){
				let a = di.get('A');
				a = await a;
				
				//clock.runAllAsync();
				clock.runAll();
				clock.restore();
				
				return expect(a.c).equal(2);
			});
			
		});
		
	};
	
}
