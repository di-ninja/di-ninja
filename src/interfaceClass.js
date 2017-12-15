import Interface from './interface'
export default class InterfaceClass extends Interface{
	constructor(name, interfaceClass){
		super(name);
		this.interfaceClass = interfaceClass;
	}
	getInterfaceClass(){
		return this.interfaceClass;
	}
}
