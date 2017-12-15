export default (promiseInterfaces = [ Promise ], checkThenMethod = true)=>{
	return class PromiseInterface {
		static [Symbol.hasInstance](instance) {
			if( promiseInterfaces.some( promiseInterface => instance instanceof promiseInterface) ){
				return true;
			}
			if( checkThenMethod && typeof instance == 'object' && instance !== null && typeof instance.then === 'function' ){
				return true;
			}
			return false;
		}
	}
}
