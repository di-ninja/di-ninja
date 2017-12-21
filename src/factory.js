import Var from './var'
export default class Factory extends Var {
  constructor (callback, shareInstances = false) {
    super()
    this.CallbackDef = callback
    this.shareInstances = shareInstances
  }
}
