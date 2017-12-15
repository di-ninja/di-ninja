import { expect } from 'chai'

import loadTestFactory from './utils/loadTestFactory'
//import container from '../src/browser'
import container from '../browser'

const requires = {};

const loadTest = loadTestFactory(container,(name)=>{
	const path = name.split('/');
	const root = path.shift();
	switch(root){
		case 'rules':
			return require('./rules/'+path).default;
		break;
		case 'decorator':
			return require('./decorator').default;
		break;
	}
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
	
	loadTest('decorator');

});

describe('dependencies',function(){
	
	
	const di = container({
		rules:(di)=>({
			'app/A': {
				
			},
			'app/B': {
				
			},
			'app/B/C': {
				
			},
			
			'requireA' : {
				instanceOf: 'app/A',
				params: [ di.require('app/B') ],
			},
		}),
		dependencies: {
			'app' : require.context('./autoload', true, /\.js$/),
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
	
	it('sould be equal to B',function(){
		const A = di.get('requireA');
		expect(A.params[0]).equal( require('./autoload/B') );
	});
	
});
