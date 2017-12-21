import Factory from './factory'
export default class ClassFactory extends Factory {
  callback (shareInstances) {
    if (this.shareInstances) {
      return new this.CallbackDef(shareInstances)
    }
    return new this.CallbackDef()
  }
}
