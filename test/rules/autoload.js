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
		});
		
		it('should return an instance of A',function(){
			const instance = di.get('app/A');
			expect(instance).instanceof( require('../autoload/A').default );
		});
		
	};
	
}
