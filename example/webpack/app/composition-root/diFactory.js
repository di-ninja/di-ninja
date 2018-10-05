import container from 'di-ninja'

import dependencies from './dependencies'

export default (rules) => {
  const di = container({
    rules,
    dependencies,
  })
  return di
}
