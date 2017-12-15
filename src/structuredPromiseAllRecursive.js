import Var from './var'

const nativePromise = Promise;

function structuredPromiseAllRecursive(structure, value, PromiseInterface = nativePromise, PromiseFactory = nativePromise) {

	if (value instanceof PromiseInterface) {
		return value
	}
	
	if(!(typeof structure == 'object' && structure !== null && !(structure instanceof Var))){
		return PromiseFactory.resolve(value);
	}

	if (value instanceof Array) {
		return PromiseFactory.all(value.map((val, key)=>{
			return structuredPromiseAllRecursive(structure[key], val, PromiseInterface, PromiseFactory)
		}))
	}

	if (typeof value === 'object' && value !== null) {
		return resolveObject(structure, value, PromiseInterface, PromiseFactory)
	}

	return PromiseFactory.resolve(value)
}

function resolveObject(structure, object, PromiseInterface, PromiseFactory) {
	const promises = Object.keys(object).map(key => {		
		return structuredPromiseAllRecursive(structure[key], object[key], PromiseInterface, PromiseFactory).then(value => ({ key, value }));
	});

	return PromiseFactory.all(promises).then(results => {
		return results.reduce((obj, pair) => {
			obj[pair.key] = pair.value;
			return obj;
		}, {});
	});
}

export default structuredPromiseAllRecursive;
