import Require from './require'
export default class NodeRequire extends Require{
	constructor(dep){
		super(dep);
	}
	require(){
		return require(this.dep);
	}
}
