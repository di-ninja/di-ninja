import Var from './var'
import Sync from './sync'

function structuredResolveParamsInterface(structure, value) {

	
	if (value instanceof Sync) {
		return value.getInstance()
	}
	
	if(!(typeof structure == 'object' && structure !== null && !(structure instanceof Var))){
		return value
	}

	if (value instanceof Array) {
		return value.map((val, key)=>{
			return structuredResolveParamsInterface(structure[key], val)
		})
	}

	if (typeof value === 'object' && value !== null) {
		const o = {};
		Object.keys(value).map(key => {
			o[key] = structuredResolveParamsInterface(structure[key], value[key]);
		});
		return o;
	}

	return value
}

export default structuredResolveParamsInterface;
