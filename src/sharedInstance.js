export default class SharedInstance{
	constructor(interfaceName, container){
		this.container = container;
		this.interfaceName = interfaceName;
	}
	get(shareInstances, stack = []){
		if(!this.instance){
			this.instance = this.container.get(this.interfaceName, undefined, shareInstances, stack);
		}
		return this.instance;
	}
}
