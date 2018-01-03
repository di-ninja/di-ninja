import Require from './require'
export default class NodeRequire extends Require {
  require () {
    if (this.requires.hasOwnProperty(this.dep)) {
      return this.requires[this.dep]
    }
    return require(this.dep)
  }
}
