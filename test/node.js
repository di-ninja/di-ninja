import path from 'path'
import { expect } from 'chai'

import loadTestFactory from './utils/loadTestFactory'
import container from '../src/node'

const loadTest = loadTestFactory(container,(name)=>{
	return require('./'+name).default;
});

describe('rules',function(){		
	
	
	loadTest('rules/classDef');
	loadTest('rules/instanceOf');
	loadTest('rules/shared');
	loadTest('rules/params');
	loadTest('rules/singleton');
	loadTest('rules/substitutions');
	loadTest('rules/sharedInTree');
	loadTest('rules/calls');
	loadTest('rules/lazyCalls');
	loadTest('rules/inheritInstanceOf');
	loadTest('rules/inheritPrototype-decorator');
	loadTest('rules/inheritMixins');
	loadTest('rules/asyncResolve');
	loadTest('rules/asyncCallsSeries');
	loadTest('rules/asyncCallsParamsSerie');
	
	loadTest('rules/autoload');
	
	loadTest('decorator');

});

describe('dependencies',function(){
	
	const di = container({
		rules:{
			'app/A': {
				
			},
			'app/B': {
				
			},
			'app/B/C': {
				
			},
		},
		
		dependencies: {
			
			'app' : container.context('./autoload', true, /\.js$/),
			
			'A': container.require('./autoload/A'),
			
			'B': container.dependency(require('./autoload/B')),
			
		},
		
	});
	
	
	it('sould be instance of A',function(){
		const A = di.get('app/A');
		expect(A).instanceof( require('./autoload/A').default );
	});
	
	it('sould be instance of B',function(){
		const B = di.get('app/B');
		expect(B).instanceof( require('./autoload/B').default );
	});
	
	it('sould be instance of C',function(){
		const C = di.get('app/B/C');
		expect(C).instanceof( require('./autoload/B/C').default );
	});
	
	
	
	it('sould be instance of A',function(){
		const A = di.get('A');
		expect(A).instanceof( require('./autoload/A').default );
	});
	
	it('sould be instance of B',function(){
		const B = di.get('B');
		expect(B).instanceof( require('./autoload/B').default );
	});
	
});
