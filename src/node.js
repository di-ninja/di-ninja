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
		requirePath = PATH.normalize(requirePath);
		if(undefined !== this.requires[requirePath]){
			return true;
		}
		
		try{
			console.log('require.resolve', requirePath);
			require.resolve(requirePath);
			return true;
		}
		catch(e){
			return false;
		}
	}
	depRequire(requirePath){
		requirePath = PATH.normalize(requirePath);
		const required = this.requires[requirePath];
		if(undefined !== required){
			return required;
		}
		return require(requirePath);
	}
	
	require(dep){
		return new NodeRequire(dep);
	}
	
}
