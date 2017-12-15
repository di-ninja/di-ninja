import path from 'path'

export default ({di, expect})=>{
	
	return function(){
		
		di.config('autoloadPathResolver',{
			'app': path.resolve(__dirname, '../autoload'),
		});
		
		di.addRules({
			'app/A':{
				autoload: true,
			},
			'C':{
				autoload: true,
				path: path.resolve(__dirname, '../autoload/C'),
			},
		});
		
		it('should return an instance of A',function(){
			const instance = di.get('app/A');
			expect(instance).instanceof( require('../autoload/A').default );
		});
		it('should return an instance of C',function(){
			const instance = di.get('C');
			expect(instance).instanceof( require('../autoload/C').default );
		});
		
	};
	
}
