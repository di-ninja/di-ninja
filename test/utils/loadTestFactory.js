/* eslint-env mocha */

import { assert } from 'chai'
import sinon from 'sinon'

import {
  InterfacePrototype
} from '../../src/interface-prototype'

export default function loadTestFactory (container, requireCaller) {
  container.setInterfacePrototypeDefault(InterfacePrototype)

  return function loadTest (test) {
    const di = container()
    const factory = requireCaller(test)

    const fn = factory({
      di,
      assert,
      sinon
    })

    describe(test, fn)
  }
};
