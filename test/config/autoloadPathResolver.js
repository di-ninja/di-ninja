/* eslint-env mocha */

import path from 'path'

if (process.env.APP_ENV !== 'browser') {
  // we are not in webpack/browser but in nodejs/server-side
  const container = require('../../src/node').default
  require.context = container.context
}

export default ({di, assert}) => {
  return function () {
    
    const aliasMap = {
      'app': path.resolve(__dirname, '../autoload')
    }
    
    di.config({
      rulesDefault: {
        autoload: true
      },
      autoloadPathResolver: function(pathName){
        Object.keys(aliasMap).forEach(alias => {
          const realPath = path.normalize(aliasMap[alias])
          if (pathName === alias) {
            pathName = realPath
          } else {
            const dir = pathName.substr(0, alias.length + 1).replace(/\\/g, '/')
            if (dir === alias + '/') {
              pathName = path.join(realPath, pathName.substr(alias.length))
            }
          }
        })
        return pathName
      },
      autoloadFailOnMissingFile: true,
      dependencies: {
        'app': require.context('../autoload', true, /\.js$/)
      },
    })

    di.addRules({
      'C': {
        path: path.resolve(__dirname, '../autoload/C')
      },
      'D': {
        path: path.resolve(__dirname, '../autoload/D') + ':classes:D'
      },
      'D2': {
        path: 'app/D:classes:D'
      },
    })

    it('should return an instance of C', function () {
      const instance = di.get('C')
      assert.instanceOf(instance, require('../autoload/C').default)
    })

    it('should return an instance of D', function () {
      const instance = di.get('D')
      assert.instanceOf(instance, require('../autoload/D').classes.D)
    })

    it('should return an instance of D', function () {
      const instance = di.get('D2')
      assert.instanceOf(instance, require('../autoload/D').classes.D)
    })
  }
}
