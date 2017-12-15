import Var from './var'
export default class Interface extends Var{
	constructor(name){
		super();
		this.name = name;
	}
	getName(){
		return this.name;
	}
}
