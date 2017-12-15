import path from 'path'

import stackTrace from 'stack-trace'

import Dependency from './dependency'

export default function requireFile(dep, parentDir = undefined){
	if(!parentDir){
		parentDir = path.dirname(stackTrace.get()[1].getFileName());
	}
	const depFile = path.resolve(parentDir, dep);
	return new Dependency( require( depFile ) );
}
