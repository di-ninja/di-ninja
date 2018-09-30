import Container from './container'
import makeContainerApi from './makeContainerApi'

import BrowserRequire from './browserRequire'
import Dependency from './dependency'

export {
  InterfaceClass,
  InterfacePrototype,
  Interface,
  instanceOf,
} from './interface-prototype'

function makeContainer (config) {
  const container = new BrowserContainer(config)
  return makeContainerApi(container)
}

function requireFile () {
  throw new Error('The method requireContext is only for implemented node, in webpack use require api')
}
function requireContext () {
  throw new Error('The method requireContext is only for implemented node, in webpack use require.context api')
}
function dependency (dep) {
  return new Dependency(dep)
}

makeContainer.dependency = dependency
makeContainer.context = requireContext
makeContainer.require = requireFile
makeContainer.setInterfacePrototypeDefault = Container.setInterfacePrototypeDefault
makeContainer.getInterfacePrototypeDefault = Container.getInterfacePrototypeDefault

class BrowserContainer extends Container {
  depExists (requirePath) {
    return !!this.getRequire(requirePath)
  }
  depRequire (requirePath) {
    return this.getRequire(requirePath)
  }

  require (dep) {
    return new BrowserRequire(dep, this.requires)
  }
}

export default makeContainer
