import Require from './require'
export default class NodeRequire extends Require {
  require () {
    return require(this.dep)
  }
}
