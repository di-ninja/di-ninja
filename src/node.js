import PATH from 'path'

import Container from './container'
import makeContainerApi from './makeContainerApi'

import NodeRequire from './nodeRequire'
import nodeRequireContext from './nodeRequireContext'

import Dependency from './dependency'
import requireFile from './nodeRequireFile'

export {
  InterfaceClass,
  InterfacePrototype,
  Interface,
  instanceOf
} from './interface-prototype'

export default makeContainer

export function makeContainer (config) {
  const container = new NodeContainer(config)
  return makeContainerApi(container)
}

function dependency (dep) {
  return new Dependency(dep)
}

makeContainer.dependency = dependency
makeContainer.context = nodeRequireContext
makeContainer.require = requireFile
makeContainer.setInterfacePrototypeDefault = Container.setInterfacePrototypeDefault
makeContainer.getInterfacePrototypeDefault = Container.getInterfacePrototypeDefault

export class NodeContainer extends Container {
  depExists (requirePath) {
    requirePath = PATH.normalize(requirePath)
    if (requirePath in this.requires) {
      return true
    }

    try {
      require.resolve(requirePath)
      return true
    } catch (e) {
      return false
    }
  }
  depRequire (requirePath) {
    requirePath = PATH.normalize(requirePath)
    const required = this.requires[requirePath]
    if (undefined !== required) {
      return required
    }
    return require(requirePath)
  }

  require (dep) {
    return new NodeRequire(dep, this.requires)
  }

  static polyfillRequireContext = false
  setPolyfillRequireContext (polyfill = false) {
    if (polyfill && !NodeContainer.polyfillRequireContext) {
      NodeContainer.polyfillRequireContext = true
      const wrap = module.constructor.wrap
      const options = JSON.stringify({
        alias: {
          'di-ninja': PATH.join(__dirname, 'node')
        }
      })
      require('babel-plugin-module-resolver')
      module.constructor.wrap = function (script) {
        return wrap(`require.context = require(
          require('babel-plugin-module-resolver').resolvePath('di-ninja', '${module.filename}', ${options})
        ).default.context
          ${script}
        `)
      }
    }
  }

  setLazyRequire (enable = false) {
    this.lazyRequire = enable
  }
}
