import path from 'path'

export default ({di, expect})=>{
	
	return function(){
		
		di.config('autoloadPathResolver',{
			'app': path.resolve(__dirname, '../autoload'),
		});
		
		di.addRules({
			'C':{
				path: path.resolve(__dirname, '../autoload/C'),
			},
		});
		
		di.addRules({
			'D':{
				path: path.resolve(__dirname, '../autoload/D')+':classes:D',
			},
		});
		
		di.addRules({
			'D2':{
				path: 'app/D:classes:D',
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
		
	};
	
}
