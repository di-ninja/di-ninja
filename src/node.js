import PATH from 'path'
import FS from 'fs'

import Container from './container'
import makeContainerApi from './makeContainerApi'

import NodeRequire from './nodeRequire'
import nodeRequireContext from './nodeRequireContext'

import Dependency from './dependency'
import requireFile from './nodeRequireFile'

export default makeContainer;

export function makeContainer(config){
	const container = new NodeContainer(config);
	return makeContainerApi(container);
}

function dependency(dep){
	return new Dependency(dep);
}

makeContainer.dependency = dependency;
makeContainer.context = nodeRequireContext;
makeContainer.require = requireFile;
makeContainer.setInterfacePrototypeDefault = Container.setInterfacePrototypeDefault;
makeContainer.getInterfacePrototypeDefault = Container.getInterfacePrototypeDefault;

export class NodeContainer extends Container {
	
	
	depExists(requirePath){
		if(undefined !== this.requires[requirePath]){
			return true;
		}
		
		try{
			require.resolve(requirePath);
			return true;
		}
		catch(e){
			return false;
		}
	}
	depRequire(requirePath){
		if(undefined !== this.requires[requirePath]){
			return this.requires[requirePath];
		}
		return require(requirePath);
	}
	
	require(dep){
		return new NodeRequire(dep);
	}
	
}
