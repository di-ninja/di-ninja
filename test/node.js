/* eslint-env mocha */

import loadTestFactory from './utils/loadTestFactory'
import container from '../src/node'

const loadTest = loadTestFactory(container, (name) => {
  return require('./' + name).default
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

  loadTest('rules/autoload')
  loadTest('rules/path')
})
describe('decorator', function () {
  loadTest('decorator')
})
describe('config', function () {
  loadTest('config/promiseFactory')
  loadTest('config/promiseInterfaces')
  loadTest('config/interfacePrototype')
  loadTest('config/dependencies')
  loadTest('config.node/dependencies')
  loadTest('config/autoloadPathResolver')
  loadTest('config/rulesDefault')
})
