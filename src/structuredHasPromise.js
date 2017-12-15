import Var from './var'

const nativePromise = Promise;

export default function structuredHasPromise(structure, mixed, PromiseInterface = nativePromise){
	
	if(mixed instanceof PromiseInterface){
		return true
	}
	if(typeof structure == 'object' && structure !== null && !(structure instanceof Var)){
		return Object.keys(structure).some(key=>{
			return structuredHasPromise(structure[key], mixed[key], PromiseInterface)
		})
	}
	
}
