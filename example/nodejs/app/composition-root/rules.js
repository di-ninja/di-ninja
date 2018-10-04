import config from 'app/config'

export default (di) => ({
  '#di': {
    singleton: di
  },
  '#factoryApi': {
    shared: true,
    path: 'app/composition-root/factoryApi',
    params: ['#di'],
  },

  '$context': {
    path: 'app/composition-root/context',
  },

  '#factoryError':{
    shared: true,
    path: 'app/composition-root/factoryError',
    params: [{
      factory: di.value((name) => {
        if (di.exists('app/errors/' + name)) {
          return di.get('app/errors/' + name, [{
            error: '#factoryError',
          }])
        }
      })
    }]
  },

  '#server': {
    shared: true,
    path: 'app/server',
    params: [{
      server: '#httpServer',
      app: '#app',
      factoryApi: '#factoryApi',
      config: di.value({
        SERVER_PORT: config.SERVER_PORT,
      }),
      error: '#factoryError',
    }]
  },

  '#httpServer': {
    path: 'http:Server',
    shared: true,
    params: [
      '#app'
    ]
  },

  '#app': {
    instanceOf: 'express',
    shared: true
  },

})
