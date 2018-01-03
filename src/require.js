import Var from './var'
import PATH from 'path'
export default class Require extends Var {
  constructor (dep, requires = []) {
    super()
    this.dep = PATH.normalize(dep)
    this.requires = requires
  }
  require () {
    return this.requires[this.dep]
  }
}
