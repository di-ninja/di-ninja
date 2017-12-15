import InterfaceClass from './interfaceClass'
import InterfaceTypeError from './interfaceTypeError'
function structuredInterfacePrototype(structure, value) {
	if (structure instanceof InterfaceClass) {
		const interfaceClass = structure.getInterfaceClass();
		if(!(value instanceof interfaceClass)){
			throw new InterfaceTypeError('Expected instance of class implementing interface "'+JSON.stringify(typeof interfaceClass === 'symbol' ? 'symbol' : interfaceClass)+'" but got "'+JSON.stringify(typeof value === 'symbol' ? 'symbol' : value)+'"');
		}
	}
	else if (structure instanceof Array) {
		structure.forEach( (val, key) => structuredInterfacePrototype(structure[key], value[key]) )
	}
	else if (typeof structure === 'object' && structure !== null) {
		Object.keys(structure).map(key => structuredInterfacePrototype(structure[key], value[key]) );
	}
}

export default structuredInterfacePrototype;
