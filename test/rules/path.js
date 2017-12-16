import path from 'path'

export default ({di, expect})=>{
	
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
			
		});
		
		it('should return an instance of C',function(){
			const instance = di.get('C');
			expect(instance).instanceof( require('../autoload/C').default );
		});
		
		it('should return an instance of D',function(){
			const instance = di.get('D');
			expect(instance).instanceof( require('../autoload/D').classes.D );
		});
		
		it('should return an instance of D',function(){
			const instance = di.get('D2');
			expect(instance).instanceof( require('../autoload/D').classes.D );
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('server');
			expect(instance).instanceof( require('http').Server );
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('server2');
			expect(instance).instanceof( require('http').Server );
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('#server3');
			expect(instance).instanceof( require('http').Server );
		});
		
		it('should return an instance of http:Server',function(){
			const instance = di.get('#server4');
			expect(instance).instanceof( require('http').Server );
		});
		
	};
	
}
