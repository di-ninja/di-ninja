import Require from './require'
export default class NodeRequire extends Require {
  require () {
    if (this.dep in this.requires) {
      return this.requires[this.dep]
    }
    return require(this.dep)
  }
}
