/* eslint-env mocha */

import path from 'path'

export default ({di, assert})=>{
	
	return function(){
		
		di.config({
			rulesDefault:{
				autoload: true,
			},
			autoloadPathResolver: {
				'app': path.resolve(__dirname, '../autoload'),
			},
			autoloadFailOnMissingFile: true,
		});
		
		di.addRules({
			'C':{
				path: path.resolve(__dirname, '../autoload/C'),
			},
			'D':{
				path: path.resolve(__dirname, '../autoload/D')+':classes:D',
			},
			'D2':{
				path: 'app/D:classes:D',
			},
			
			'server':{
				path: 'http:Server',
			},
			
			'server2':{
				instanceOf: 'http:Server',
			},
			
			'#server3':{
				path: 'http:Server',
			},
			
			'#server4':{
				instanceOf: 'http:Server',
			},
			
			'http:Server':{
			
			},
		});
		
		it('should return an instance of C',function(){
			const instance = di.get('C');
			assert.instanceOf(instance, require('../autoload/C').default);
		});
		
		it('should return an instance of D',function(){
			const instance = di.get('D');
			assert.instanceOf(instance, require('../autoload/D').classes.D);
		});
		
		it('should return an instance of D',function(){
			const instance = di.get('D2');
			assert.instanceOf(instance, require('../autoload/D').classes.D);
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('server');
			assert.instanceOf(instance, require('http').Server);
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('server2');
			assert.instanceOf(instance, require('http').Server);
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('#server3');
			assert.instanceOf(instance, require('http').Server);
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('#server4');
			assert.instanceOf(instance, require('http').Server);
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('http:Server');
			assert.instanceOf(instance, require('http').Server);
		});
		
	};
	
}
