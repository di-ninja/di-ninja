import Factory from './factory'
export default class ValueFactory extends Factory {
	callback(shareInstances){
		if(this.shareInstances){
			return this.callbackDef(shareInstances);
		}
		return this.callbackDef();
	}
}
