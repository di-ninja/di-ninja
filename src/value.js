import Var from './var'
export default class Value extends Var{
	constructor(value){
		super();
		this.value = value;
	}
	getValue(){
		return this.value;
	}
}
