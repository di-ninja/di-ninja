/* eslint-env mocha */

import loadTestFactory from './utils/loadTestFactory'
 // import container from '../src/browser'
import container from '../browser'

const loadTest = loadTestFactory(container, (name) => {
  const path = name.split('/')
  const root = path.shift()
  switch (root) {
    case 'rules':
      return require('./rules/' + path).default
    case 'config':
      return require('./config/' + path).default
    case 'decorator':
      return require('./decorator').default
  }
})

describe('rules', function () {
  loadTest('rules/classDef')
  loadTest('rules/instanceOf')
  loadTest('rules/shared')
  loadTest('rules/params')
  loadTest('rules/singleton')
  loadTest('rules/substitutions')
  loadTest('rules/sharedInTree')
  loadTest('rules/calls')
  loadTest('rules/lazyCalls')
  loadTest('rules/inheritInstanceOf')
  loadTest('rules/inheritPrototype-decorator')
  loadTest('rules/inheritMixins')
  loadTest('rules/asyncResolve')
  loadTest('rules/asyncCallsSeries')
  loadTest('rules/asyncCallsParamsSerie')
})
describe('decorator', function () {
  loadTest('decorator')
})
describe('config', function () {
  loadTest('config/promiseFactory')
  loadTest('config/promiseInterfaces')
  loadTest('config/interfacePrototype')
  loadTest('config/dependencies')
  loadTest('config/autoloadPathResolver')
})
