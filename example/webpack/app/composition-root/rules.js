import config from 'app/config'

const componentAsyncSharedDeps = {
  containerFactory: '#containerFactory',
  componentFactory: '#componentFactory',
}

export default (di) => {

  const componentCommon = {

    containerFactory: '#containerFactory',
    componentFactory: '#componentFactory',

    debug: di.value(config.DEBUG),

    APP_TITLE: di.value(config.APP_TITLE),
  }

  return {

    '#di': {
      singleton: di
    },

    'app/view': {
      params: [{
        containerFactory: '#rootContainerFactory',
      }]
    },

    '#rootContainerFactory':{
      asyncResolve: true,
      shared: true,
      classDef: di.makeRegisterFactory('app/containers/', [componentCommon], [componentAsyncSharedDeps]),
    },
    '#componentFactory':{
      asyncResolve: true,
      shared: true,
      classDef: di.makeRegisterFactory('app/components/', [componentCommon]),
    },
    '#containerFactory':{
      asyncResolve: true,
      shared: true,
      classDef: di.makeRegisterFactory('app/containers/', [componentCommon]),
    },

  }
}
