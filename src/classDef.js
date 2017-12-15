export default class ClassDef {
	constructor(callback){
		this.callback = callback;
	}
	getClassDef(){
		return this.callback();
	}
}
