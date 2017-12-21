import PATH from 'path'
import Require from './require'
export default class BrowserRequire extends Require{
	constructor(dep, requires = []){
		super( PATH.normalize(dep) );
		this.requires = requires;
	}
	require(){
		return this.requires[this.dep];
	}
}
