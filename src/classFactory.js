import Factory from './factory'
export default class ClassFactory extends Factory {
	callback(shareInstances){
		if(this.shareInstances){
			return new this.callbackDef(shareInstances);
		}
		return new this.callbackDef();
	}
}
